import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useStockTransfers() {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransfers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_transfers')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      console.error('useStockTransfers fetch error:', error.message)
    } else {
      setTransfers(
        (data || []).map((t) => ({
          id: t.id,
          date: t.date,
          productId: t.product_id,
          productName: t.product_name,
          fromLocation: t.from_location,
          toLocation: t.to_location,
          qty: t.qty,
          reference: t.reference,
          status: t.status,
          user: t.performed_by,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchTransfers() }, [fetchTransfers])

  const addTransfer = async (transfer) => {
    const { count } = await supabase.from('stock_transfers').select('*', { count: 'exact', head: true })
    const nextNum = String((count || transfers.length) + 13).padStart(4, '0')
    const id = `TRF-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      date,
      product_id: transfer.productId,
      product_name: transfer.productName,
      from_location: transfer.fromLocation,
      to_location: transfer.toLocation,
      qty: transfer.qty,
      reference: transfer.reference || '',
      status: transfer.status || 'Completed',
      performed_by: transfer.user || '',
    }
    const { error } = await supabase.from('stock_transfers').insert([payload])
    if (error) { console.error('addTransfer error:', error.message); return null }

    const newTransfer = {
      id,
      date,
      productId: transfer.productId,
      productName: transfer.productName,
      fromLocation: transfer.fromLocation,
      toLocation: transfer.toLocation,
      qty: transfer.qty,
      reference: transfer.reference || '',
      status: transfer.status || 'Completed',
      user: transfer.user || '',
    }
    setTransfers((prev) => [newTransfer, ...prev])
    return newTransfer
  }

  const kpis = useMemo(() => {
    const unitsMoved = transfers.reduce((s, x) => s + x.qty, 0)
    const completed = transfers.filter((t) => t.status === 'Completed').length
    const pending = transfers.filter((t) => t.status !== 'Completed').length
    return { count: transfers.length, unitsMoved, completed, pending }
  }, [transfers])

  return { transfers, loading, addTransfer, kpis }
}
