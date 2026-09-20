import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useSalesReturns() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReturns = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sale_returns')
      .select('*, sale_return_items(*)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('useSalesReturns fetch error:', error.message)
    } else {
      setReturns(
        (data || []).map((r) => ({
          id: r.id,
          saleId: r.sale_id,
          customerId: r.customer_id,
          customerName: r.customer_name,
          date: r.date,
          items: (r.sale_return_items || []).map((i) => ({
            productId: i.product_id,
            name: i.name,
            qty: i.qty,
            price: Number(i.price),
          })),
          subtotal: Number(r.subtotal),
          vat: Number(r.vat),
          grandTotal: Number(r.grand_total),
          reason: r.reason,
          status: r.status,
          cashier: r.cashier,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchReturns() }, [fetchReturns])

  const addReturn = async (ret) => {
    const { count } = await supabase.from('sale_returns').select('*', { count: 'exact', head: true })
    const nextNum = (count || returns.length) + 1004
    const id = `CN-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const { error } = await supabase.from('sale_returns').insert([{
      id,
      sale_id: ret.saleId || null,
      customer_id: ret.customerId || 0,
      customer_name: ret.customerName || 'Walk-in Customer',
      date,
      subtotal: ret.subtotal,
      vat: ret.vat,
      grand_total: ret.grandTotal,
      reason: ret.reason || '',
      status: ret.status || 'Refunded',
      cashier: ret.cashier || '',
    }])
    if (error) { console.error('addReturn error:', error.message); return null }

    if (ret.items && ret.items.length > 0) {
      const items = ret.items.map((i) => ({
        return_id: id,
        product_id: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
      }))
      const { error: itemsErr } = await supabase.from('sale_return_items').insert(items)
      if (itemsErr) console.error('addReturn items error:', itemsErr.message)
    }

    const newReturn = { ...ret, id, date }
    setReturns((prev) => [newReturn, ...prev])
    return newReturn
  }

  const kpis = useMemo(() => {
    const total = returns.reduce((s, x) => s + x.grandTotal, 0)
    const refunded = returns.filter((r) => r.status === 'Refunded').reduce((s, x) => s + x.grandTotal, 0)
    const pending = returns.filter((r) => r.status !== 'Refunded').reduce((s, x) => s + x.grandTotal, 0)
    return { total, refunded, pending, count: returns.length }
  }, [returns])

  return { returns, loading, addReturn, kpis }
}
