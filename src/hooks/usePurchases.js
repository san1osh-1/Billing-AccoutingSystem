import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function usePurchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPurchases = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('purchases')
      .select('*, purchase_items(*)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('usePurchases fetch error:', error.message)
    } else {
      setPurchases(
        (data || []).map((p) => ({
          id: p.id,
          supplierId: p.supplier_id,
          supplierName: p.supplier_name,
          date: p.date,
          invoiceNo: p.invoice_no,
          items: (p.purchase_items || []).map((i) => ({
            productId: i.product_id,
            name: i.name,
            qty: i.qty,
            price: Number(i.price),
            discount: Number(i.discount),
          })),
          subtotal: Number(p.subtotal),
          discount: Number(p.discount),
          vat: Number(p.vat),
          grandTotal: Number(p.grand_total),
          paymentMethod: p.payment_method,
          paymentStatus: p.payment_status,
          amountPaid: Number(p.amount_paid),
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchPurchases() }, [fetchPurchases])

  const addPurchase = async (purchase) => {
    const { count } = await supabase.from('purchases').select('*', { count: 'exact', head: true })
    const nextNum = String((count || purchases.length) + 216).padStart(4, '0')
    const id = `PUR-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const { error: purErr } = await supabase.from('purchases').insert([{
      id,
      supplier_id: purchase.supplierId || 0,
      supplier_name: purchase.supplierName || '',
      date,
      invoice_no: purchase.invoiceNo || '',
      subtotal: purchase.subtotal,
      discount: purchase.discount || 0,
      vat: purchase.vat || 0,
      grand_total: purchase.grandTotal,
      payment_method: purchase.paymentMethod,
      payment_status: purchase.paymentStatus,
      amount_paid: purchase.amountPaid || 0,
    }])
    if (purErr) { console.error('addPurchase error:', purErr.message); return null }

    if (purchase.items && purchase.items.length > 0) {
      const items = purchase.items.map((i) => ({
        purchase_id: id,
        product_id: i.productId,
        name: i.name,
        qty: i.qty,
        price: i.price,
        discount: i.discount || 0,
      }))
      const { error: itemsErr } = await supabase.from('purchase_items').insert(items)
      if (itemsErr) console.error('addPurchase items error:', itemsErr.message)
    }

    const newPurchase = { ...purchase, id, date }
    setPurchases((prev) => [newPurchase, ...prev])
    return newPurchase
  }

  const kpis = useMemo(() => {
    const total = purchases.reduce((s, x) => s + x.grandTotal, 0)
    const paid = purchases.reduce((s, x) => s + x.amountPaid, 0)
    const due = total - paid
    return { total, paid, due, count: purchases.length }
  }, [purchases])

  return { purchases, loading, addPurchase, kpis }
}