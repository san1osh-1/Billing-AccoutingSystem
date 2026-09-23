import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useSales() {
  const { businessId } = useAuth()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSales = useCallback(async () => {
    if (!businessId) {
      setSales([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('sales')
      .select('*, sale_items(*)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('useSales fetch error:', error.message)
      setSales([])
    } else {
      setSales(
        (data || []).map((s) => ({
          id: s.id,
          customerId: s.customer_id,
          customerName: s.customer_name,
          date: s.date,
          items: (s.sale_items || []).map((i) => ({
            productId: i.product_id,
            name: i.name,
            qty: i.qty,
            price: Number(i.price),
            discount: Number(i.discount),
          })),
          subtotal: Number(s.subtotal),
          discount: Number(s.discount),
          vat: Number(s.vat),
          grandTotal: Number(s.grand_total),
          paymentMethod: s.payment_method,
          status: s.status,
          cashier: s.cashier,
        }))
      )
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const addSale = async (sale) => {
    const { count } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)

    const nextNum = (count || sales.length) + 1043
    const id = `INV-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const { error: saleErr } = await supabase.from('sales').insert([
      {
        id,
        business_id: businessId,
        customer_id: sale.customerId || 0,
        customer_name: sale.customerName || 'Walk-in Customer',
        date,
        subtotal: sale.subtotal,
        discount: sale.discount,
        vat: sale.vat,
        grand_total: sale.grandTotal,
        payment_method: sale.paymentMethod,
        status: sale.status,
        cashier: sale.cashier || '',
      },
    ])
    if (saleErr) {
      console.error('addSale error:', saleErr.message)
      return null
    }

    // Insert sale items
    if (sale.items && sale.items.length > 0) {
      const items = sale.items.map((i) => ({
        sale_id: id,
        product_id: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        discount: i.discount || 0,
      }))
      const { error: itemsErr } = await supabase.from('sale_items').insert(items)
      if (itemsErr) console.error('addSale items error:', itemsErr.message)
    }

    const newSale = { ...sale, id, date }
    setSales((prev) => [newSale, ...prev])
    return newSale
  }

  const kpis = useMemo(() => {
    const total = sales.reduce((s, x) => s + x.grandTotal, 0)
    const paid = sales.filter((s) => s.status === 'Paid').reduce((s, x) => s + x.grandTotal, 0)
    const due = sales.filter((s) => s.status !== 'Paid').reduce((s, x) => s + x.grandTotal, 0)
    return { total, paid, due, count: sales.length }
  }, [sales])

  return { sales, loading, addSale, kpis }
}