import { useState, useMemo, useEffect } from 'react'
import { stockHistory } from '../data/inventory'

export default function useInventory(products) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setHistory(stockHistory); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const kpis = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((s, p) => s + p.stock, 0)
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
    const outOfStock = products.filter((p) => p.stock === 0).length
    const stockValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0)
    return { totalProducts, totalStock, lowStock, outOfStock, stockValue }
  }, [products])

  const addHistoryEntry = (entry) => {
    const newEntry = { ...entry, id: Math.max(0, ...history.map((h) => h.id)) + 1, date: new Date().toISOString().slice(0, 10) }
    setHistory((prev) => [newEntry, ...prev])
    return newEntry
  }

  return { history, loading, kpis, addHistoryEntry }
}