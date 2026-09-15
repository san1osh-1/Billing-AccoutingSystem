import { useState, useEffect } from 'react'
import { initialAdjustments } from '../data/stockAdjustment'

export default function useStockAdjustments() {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setAdjustments(initialAdjustments); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const addAdjustment = (adj) => {
    const newAdj = {
      ...adj,
      id: `ADJ-${String(43 + adjustments.length).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
    }
    setAdjustments((prev) => [newAdj, ...prev])
    return newAdj
  }
  return { adjustments, loading, addAdjustment }
}

