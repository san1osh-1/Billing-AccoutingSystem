import { useState, useMemo, useEffect } from 'react'
import { initialPurchases } from '../data/purchases'

export default function usePurchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setPurchases(initialPurchases); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const addPurchase = (purchase) => {
    const newPurchase = {
      ...purchase,
      id: `PUR-${String(216 + purchases.length).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
    }
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