import { useState, useMemo, useEffect } from 'react'
import { initialPayments } from '../data/payment'

export default function usePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setPayments(initialPayments); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const addPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: `PAY-${String(513 + payments.length).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
    }
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