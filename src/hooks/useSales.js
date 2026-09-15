import { useState, useMemo, useEffect } from 'react'
import { initialSales } from '../data/sales'

export default function useSales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setSales(initialSales); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const addSale = (sale) => {
    const newSale = {
      ...sale,
      id: `INV-${1043 + sales.length}`,
      date: new Date().toISOString().slice(0, 10),
    }
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