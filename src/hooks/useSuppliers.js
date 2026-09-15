import { useState, useMemo, useEffect } from 'react'
import { initialSuppliers } from '../data/suppliers'

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })

  useEffect(() => {
    const t = setTimeout(() => { setSuppliers(initialSuppliers); setLoading(false) }, 300)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      const matchSearch = !filters.search ||
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.phone.includes(filters.search) ||
        s.email.toLowerCase().includes(filters.search.toLowerCase())
      const matchStatus = !filters.status || s.status === filters.status
      return matchSearch && matchStatus
    })
  }, [suppliers, filters])

  const kpis = useMemo(() => {
    const total = suppliers.length
    const active = suppliers.filter((s) => s.status === 'Active').length
    const payable = suppliers.reduce((s, x) => s + x.due, 0)
    const overdue = suppliers.filter((s) => s.status === 'Overdue').reduce((s, x) => s + x.due, 0)
    return { total, active, payable, overdue }
  }, [suppliers])

  const addSupplier = (data) => {
    const newSupplier = {
      ...data, id: Math.max(0, ...suppliers.map((s) => s.id)) + 1,
      totalPurchases: 0, paid: 0, due: 0, status: 'Active', createdAt: new Date().toISOString().slice(0, 10), transactions: [],
    }
    setSuppliers((prev) => [newSupplier, ...prev])
    return newSupplier
  }

  const updateSupplier = (id, data) => setSuppliers((prev) => prev.map((s) => s.id === id ? { ...s, ...data } : s))
  const deleteSupplier = (id) => setSuppliers((prev) => prev.filter((s) => s.id !== id))

  return { suppliers: filtered, all: suppliers, loading, filters, setFilters, kpis, addSupplier, updateSupplier, deleteSupplier }
}