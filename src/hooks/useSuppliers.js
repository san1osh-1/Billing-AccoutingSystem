import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('suppliers')
      .select('*, supplier_transactions(*)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('useSuppliers fetch error:', error.message)
    } else {
      setSuppliers(
        (data || []).map((s) => ({
          id: s.id,
          name: s.name,
          phone: s.phone,
          email: s.email,
          address: s.address,
          pan: s.pan,
          totalPurchases: Number(s.total_purchases),
          paid: Number(s.paid),
          due: Number(s.due),
          status: s.status,
          createdAt: s.created_at,
          transactions: (s.supplier_transactions || []).map((t) => ({
            id: t.reference,
            date: t.date,
            type: t.type,
            amount: Number(t.amount),
            paid: Number(t.paid),
            balance: Number(t.balance),
            method: t.method,
          })),
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

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

  const addSupplier = async (data) => {
    const payload = {
      name: data.name,
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      pan: data.pan || '',
      total_purchases: 0,
      paid: 0,
      due: 0,
      status: 'Active',
    }
    const { data: inserted, error } = await supabase
      .from('suppliers')
      .insert([payload])
      .select()
      .single()
    if (error) { console.error('addSupplier error:', error.message); return null }
    const newSupplier = {
      id: inserted.id,
      name: inserted.name,
      phone: inserted.phone,
      email: inserted.email,
      address: inserted.address,
      pan: inserted.pan,
      totalPurchases: 0,
      paid: 0,
      due: 0,
      status: 'Active',
      createdAt: inserted.created_at,
      transactions: [],
    }
    setSuppliers((prev) => [newSupplier, ...prev])
    return newSupplier
  }

  const updateSupplier = async (id, data) => {
    const payload = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.phone !== undefined) payload.phone = data.phone
    if (data.email !== undefined) payload.email = data.email
    if (data.address !== undefined) payload.address = data.address
    if (data.pan !== undefined) payload.pan = data.pan
    if (data.status !== undefined) payload.status = data.status
    if (data.totalPurchases !== undefined) payload.total_purchases = data.totalPurchases
    if (data.paid !== undefined) payload.paid = data.paid
    if (data.due !== undefined) payload.due = data.due

    const { error } = await supabase.from('suppliers').update(payload).eq('id', id)
    if (error) { console.error('updateSupplier error:', error.message); return }
    setSuppliers((prev) => prev.map((s) => s.id === id ? { ...s, ...data } : s))
  }

  const deleteSupplier = async (id) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id)
    if (error) { console.error('deleteSupplier error:', error.message); return }
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  return { suppliers: filtered, all: suppliers, loading, filters, setFilters, kpis, addSupplier, updateSupplier, deleteSupplier }
}