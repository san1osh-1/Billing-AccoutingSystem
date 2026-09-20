import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', method: '' })

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
    if (error) {
      console.error('useExpenses fetch error:', error.message)
    } else {
      setExpenses(
        (data || []).map((e) => ({
          id: e.id,
          date: e.date,
          category: e.category,
          description: e.description,
          amount: Number(e.amount),
          method: e.method,
          status: e.status,
          paidBy: e.paid_by,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

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

  const addExpense = async (data) => {
    const { count } = await supabase.from('expenses').select('*', { count: 'exact', head: true })
    const nextNum = String((count || expenses.length) + 211).padStart(4, '0')
    const id = `EXP-${nextNum}`
    const date = new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      date,
      category: data.category,
      description: data.description,
      amount: Number(data.amount),
      method: data.method,
      status: 'Paid',
      paid_by: data.paidBy || '',
    }
    const { error } = await supabase.from('expenses').insert([payload])
    if (error) { console.error('addExpense error:', error.message); return null }

    const newExpense = { ...data, id, date, status: 'Paid', paidBy: data.paidBy || '' }
    setExpenses((prev) => [newExpense, ...prev])
    return newExpense
  }

  const kpis = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const currentMonth = new Date().toISOString().slice(0, 7)
    const thisMonth = expenses
      .filter((e) => e.date && e.date.toString().startsWith(currentMonth))
      .reduce((s, e) => s + e.amount, 0)
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})
    return { total, thisMonth, byCategory }
  }, [expenses])

  return { expenses: filtered, all: expenses, loading, filters, setFilters, addExpense, kpis }
}