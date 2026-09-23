import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function usePayments() {
  const { businessId } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = useCallback(async () => {
    if (!businessId) {
      setPayments([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('business_id', businessId)
      .order('date', { ascending: false })

    if (error) {
      console.error('usePayments fetch error:', error.message)
      setPayments([])
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
  }, [businessId])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const addPayment = async (payment) => {
    const { count } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)

    const nextNum = String((count || payments.length) + 513).padStart(4, '0')
    const id = `PAY-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      business_id: businessId,
      date,
      type: payment.type,
      party_type: payment.partyType || 'Customer',
      party_id: payment.partyId || 0,
      party_name: payment.partyName || '',
      amount: payment.amount,
      method: payment.method || 'cash',
      reference: payment.reference || '',
      notes: payment.notes || '',
    }

    const { error } = await supabase.from('payments').insert([payload])
    if (error) {
      console.error('addPayment error:', error.message)
      return null
    }

    const newPay = { ...payment, id, date }
    setPayments((prev) => [newPay, ...prev])
    return newPay
  }

  const kpis = useMemo(() => {
    const received = payments.filter((p) => p.type === 'received').reduce((s, x) => s + x.amount, 0)
    const made = payments.filter((p) => p.type === 'made').reduce((s, x) => s + x.amount, 0)
    return { received, made, count: payments.length }
  }, [payments])

  return { payments, loading, addPayment, kpis }
}