import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useStockAdjustments() {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAdjustments = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_adjustments')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      console.error('useStockAdjustments fetch error:', error.message)
    } else {
      setAdjustments(
        (data || []).map((a) => ({
          id: a.id,
          date: a.date,
          productId: a.product_id,
          productName: a.product_name,
          type: a.type,
          qty: a.qty,
          reason: a.reason,
          reference: a.reference,
          user: a.performed_by,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAdjustments() }, [fetchAdjustments])

  const addAdjustment = async (adj) => {
    const { count } = await supabase.from('stock_adjustments').select('*', { count: 'exact', head: true })
    const nextNum = String((count || adjustments.length) + 43).padStart(4, '0')
    const id = `ADJ-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      date,
      product_id: adj.productId,
      product_name: adj.productName,
      type: adj.type,
      qty: adj.qty,
      reason: adj.reason || '',
      reference: adj.reference || '',
      performed_by: adj.user || '',
    }
    const { error } = await supabase.from('stock_adjustments').insert([payload])
    if (error) { console.error('addAdjustment error:', error.message); return null }

    const newAdj = {
      id,
      date,
      productId: adj.productId,
      productName: adj.productName,
      type: adj.type,
      qty: adj.qty,
      reason: adj.reason || '',
      reference: adj.reference || '',
      user: adj.user || '',
    }
    setAdjustments((prev) => [newAdj, ...prev])
    return newAdj
  }

  return { adjustments, loading, addAdjustment }
}
