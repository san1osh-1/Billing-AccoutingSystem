import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useInventory(products) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_history')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      console.error('useInventory fetch error:', error.message)
    } else {
      setHistory(
        (data || []).map((h) => ({
          id: h.id,
          date: h.date,
          productId: h.product_id,
          productName: h.product_name,
          type: h.type,
          qty: h.qty,
          reference: h.reference,
          user: h.performed_by,
          reason: h.reason,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const kpis = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((s, p) => s + p.stock, 0)
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
    const outOfStock = products.filter((p) => p.stock === 0).length
    const stockValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0)
    return { totalProducts, totalStock, lowStock, outOfStock, stockValue }
  }, [products])

  const addHistoryEntry = async (entry) => {
    const payload = {
      date: new Date().toISOString().slice(0, 10),
      product_id: entry.productId,
      product_name: entry.productName,
      type: entry.type,
      qty: entry.qty,
      reference: entry.reference || '',
      performed_by: entry.user || '',
      reason: entry.reason || '',
    }
    const { data: inserted, error } = await supabase
      .from('stock_history')
      .insert([payload])
      .select()
      .single()
    if (error) { console.error('addHistoryEntry error:', error.message); return null }

    const newEntry = {
      id: inserted.id,
      date: inserted.date,
      productId: inserted.product_id,
      productName: inserted.product_name,
      type: inserted.type,
      qty: inserted.qty,
      reference: inserted.reference,
      user: inserted.performed_by,
      reason: inserted.reason,
    }
    setHistory((prev) => [newEntry, ...prev])
    return newEntry
  }

  return { history, loading, kpis, addHistoryEntry }
}