import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function usePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      console.error('usePayments fetch error:', error.message)
    } else {
      setPayments(
        (data || []).map((p) => ({
          id: p.id,
          date: p.date,
          type: p.type,
          partyType: p.party_type,
          partyId: p.party_id,
          partyName: p.party_name,
          amount: Number(p.amount),
          method: p.method,
          reference: p.reference,
          notes: p.notes,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const addPayment = async (payment) => {
    const { count } = await supabase.from('payments').select('*', { count: 'exact', head: true })
    const nextNum = String((count || payments.length) + 513).padStart(4, '0')
    const id = `PAY-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      date,
      type: payment.type,
      party_type: payment.partyType,
      party_id: payment.partyId || 0,
      party_name: payment.partyName || '',
      amount: Number(payment.amount),
      method: payment.method,
      reference: payment.reference || '',
      notes: payment.notes || '',
    }
    const { error } = await supabase.from('payments').insert([payload])
    if (error) { console.error('addPayment error:', error.message); return null }

    const newPayment = { ...payment, id, date }
    setPayments((prev) => [newPayment, ...prev])
    return newPayment
  }

  const kpis = useMemo(() => {
    const received = payments.filter((p) => p.type === 'received').reduce((s, x) => s + x.amount, 0)
    const made = payments.filter((p) => p.type === 'made').reduce((s, x) => s + x.amount, 0)
    return { received, made, net: received - made, count: payments.length }
  }, [payments])

  return { payments, loading, addPayment, kpis }
}