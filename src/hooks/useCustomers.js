import { useState, useMemo, useEffect } from 'react'
import { initialCustomers } from '../data/customer'

export default function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })

  useEffect(() => {
    const t = setTimeout(() => { setCustomers(initialCustomers); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch = !filters.search ||
        c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.phone.includes(filters.search) ||
        c.email.toLowerCase().includes(filters.search.toLowerCase())
      const matchStatus = !filters.status || c.status === filters.status
      return matchSearch && matchStatus
    })
  }, [customers, filters])

  const kpis = useMemo(() => {
    const total = customers.length
    const active = customers.filter((c) => c.status === 'Active').length
    const receivable = customers.reduce((s, c) => s + c.due, 0)
    const overdue = customers.filter((c) => c.status === 'Overdue').reduce((s, c) => s + c.due, 0)
    return { total, active, receivable, overdue }
  }, [customers])

  const addCustomer = (data) => {
    const newCustomer = {
      ...data, id: Math.max(0, ...customers.map((c) => c.id)) + 1,
      totalPurchases: 0, paid: 0, due: 0, status: 'Active', createdAt: new Date().toISOString().slice(0, 10), transactions: [],
    }
    setCustomers((prev) => [newCustomer, ...prev])
    return newCustomer
  }

  const updateCustomer = (id, data) => setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c))
  const deleteCustomer = (id) => setCustomers((prev) => prev.filter((c) => c.id !== id))

  return { customers: filtered, all: customers, loading, filters, setFilters, kpis, addCustomer, updateCustomer, deleteCustomer }
}