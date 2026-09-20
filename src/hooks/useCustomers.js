import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '' })

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('customers')
      .select('*, customer_transactions(*)')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('useCustomers fetch error:', error.message)
    } else {
      setCustomers(
        (data || []).map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          address: c.address,
          pan: c.pan,
          totalPurchases: Number(c.total_purchases),
          paid: Number(c.paid),
          due: Number(c.due),
          status: c.status,
          createdAt: c.created_at,
          transactions: (c.customer_transactions || []).map((t) => ({
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

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

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

  const addCustomer = async (data) => {
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
      .from('customers')
      .insert([payload])
      .select()
      .single()
    if (error) { console.error('addCustomer error:', error.message); return null }
    const newCustomer = {
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
    setCustomers((prev) => [newCustomer, ...prev])
    return newCustomer
  }

  const updateCustomer = async (id, data) => {
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

    const { error } = await supabase.from('customers').update(payload).eq('id', id)
    if (error) { console.error('updateCustomer error:', error.message); return }
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c))
  }

  const deleteCustomer = async (id) => {
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) { console.error('deleteCustomer error:', error.message); return }
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  return { customers: filtered, all: customers, loading, filters, setFilters, kpis, addCustomer, updateCustomer, deleteCustomer }
}