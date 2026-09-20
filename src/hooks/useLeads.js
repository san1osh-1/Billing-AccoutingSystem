import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { demoLeads } from '../data/leads'

export default function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', source: '', status: '' })

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.warn('useLeads fetch error, falling back to demo leads:', error.message)
      setLeads(demoLeads)
    } else if (!data || data.length === 0) {
      // If table is empty yet, fallback to demo leads for a seamless preview
      setLeads(demoLeads)
    } else {
      setLeads(
        data.map((l) => ({
          id: l.id,
          name: l.name,
          source: l.source,
          accountName: l.account_name || '',
          phone: l.phone || '',
          interest: l.interest || '',
          expectedValue: Number(l.expected_value || 0),
          status: l.status || 'new',
          date: l.date,
          notes: l.notes || '',
          createdAt: l.created_at,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = (filters.search || '').toLowerCase().trim()
      const matchSearch =
        !q ||
        (l.name || '').toLowerCase().includes(q) ||
        (l.accountName || '').toLowerCase().includes(q) ||
        (l.phone || '').includes(filters.search)
      const matchSource = !filters.source || l.source === filters.source
      const matchStatus = !filters.status || l.status === filters.status
      return matchSearch && matchSource && matchStatus
    })
  }, [leads, filters])

  const kpis = useMemo(() => {
    const total = leads.length
    const countBy = (s) => leads.filter((l) => l.status === s).length
    return {
      total,
      new: countBy('new'),
      followUp: countBy('follow_up'),
      converted: countBy('converted'),
    }
  }, [leads])

  const addLead = async (data) => {
    // Determine the next LD-xxx ID
    let maxNum = 0
    for (const l of leads) {
      const match = l.id && l.id.match(/LD-(\d+)/)
      if (match) {
        const n = parseInt(match[1], 10)
        if (n > maxNum) maxNum = n
      }
    }
    const id = `LD-${String(maxNum + 1).padStart(3, '0')}`
    const date = data.date || new Date().toISOString().slice(0, 10)

    const payload = {
      id,
      name: data.name,
      source: data.source || 'facebook',
      account_name: data.accountName || '',
      phone: data.phone || '',
      interest: data.interest || '',
      expected_value: Number(data.expectedValue || 0),
      status: data.status || 'new',
      date,
      notes: data.notes || '',
    }

    const { data: inserted, error } = await supabase
      .from('leads')
      .insert([payload])
      .select()
      .single()

    const newLead = {
      id: inserted?.id || id,
      name: inserted?.name || data.name,
      source: inserted?.source || data.source,
      accountName: inserted?.account_name ?? data.accountName ?? '',
      phone: inserted?.phone ?? data.phone ?? '',
      interest: inserted?.interest ?? data.interest ?? '',
      expectedValue: Number(inserted?.expected_value ?? data.expectedValue ?? 0),
      status: inserted?.status || data.status || 'new',
      date: inserted?.date || date,
      notes: inserted?.notes ?? data.notes ?? '',
      createdAt: inserted?.created_at || new Date().toISOString(),
    }

    if (error) {
      console.warn('Supabase addLead error, persisted locally:', error.message)
    }

    setLeads((prev) => [newLead, ...prev])
    return newLead
  }

  const updateLead = async (id, data) => {
    const payload = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.source !== undefined) payload.source = data.source
    if (data.accountName !== undefined) payload.account_name = data.accountName
    if (data.phone !== undefined) payload.phone = data.phone
    if (data.interest !== undefined) payload.interest = data.interest
    if (data.expectedValue !== undefined) payload.expected_value = Number(data.expectedValue || 0)
    if (data.status !== undefined) payload.status = data.status
    if (data.date !== undefined) payload.date = data.date
    if (data.notes !== undefined) payload.notes = data.notes

    const { error } = await supabase.from('leads').update(payload).eq('id', id)
    if (error) {
      console.warn('Supabase updateLead error, updated locally:', error.message)
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              ...data,
              expectedValue:
                data.expectedValue !== undefined ? Number(data.expectedValue) : l.expectedValue,
            }
          : l
      )
    )
  }

  const deleteLead = async (id) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) {
      console.warn('Supabase deleteLead error, removed locally:', error.message)
    }
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  return {
    leads: filtered,
    all: leads,
    loading,
    filters,
    setFilters,
    kpis,
    addLead,
    updateLead,
    deleteLead,
    refreshLeads: fetchLeads,
  }
}
