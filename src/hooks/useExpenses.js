import { useState, useMemo, useEffect } from 'react'
import { initialExpenses } from '../data/expenses'

export default function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', method: '' })

  useEffect(() => {
    const t = setTimeout(() => { setExpenses(initialExpenses); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch = !filters.search ||
        e.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.id.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.category || e.category === filters.category
      const matchMethod = !filters.method || e.method === filters.method
      return matchSearch && matchCategory && matchMethod
    })
  }, [expenses, filters])

  const addExpense = (data) => {
    const newExpense = {
      ...data,
      id: `EXP-${String(211 + expenses.length).padStart(4, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Paid',
    }
    setExpenses((prev) => [newExpense, ...prev])
    return newExpense
  }

  const kpis = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const thisMonth = expenses
      .filter((e) => e.date.startsWith('2026-09'))
      .reduce((s, e) => s + e.amount, 0)
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})
    return { total, thisMonth, byCategory }
  }, [expenses])

  return { expenses: filtered, all: expenses, loading, filters, setFilters, addExpense, kpis }
}