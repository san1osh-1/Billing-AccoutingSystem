import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useAccounting() {
  const { businessId } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [journal, setJournal] = useState([])
  const [customerLedgerData, setCustomerLedgerData] = useState([])
  const [supplierLedgerData, setSupplierLedgerData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const queries = [
      supabase.from('chart_of_accounts').select('*').order('code'),
    ]
    if (businessId) {
      queries.push(
        supabase.from('journal_entries').select('*, journal_lines(*)').eq('business_id', businessId).order('date', { ascending: false }),
        supabase.from('customer_transactions').select('*, customers(id, name)').eq('business_id', businessId).order('date', { ascending: false }),
        supabase.from('supplier_transactions').select('*, suppliers(id, name)').eq('business_id', businessId).order('date', { ascending: false }),
      )
    } else {
      queries.push(
        Promise.resolve({ data: [], error: null }),
        Promise.resolve({ data: [], error: null }),
        Promise.resolve({ data: [], error: null }),
      )
    }
    const [
      { data: accts, error: acctsErr },
      { data: entries, error: entriesErr },
      { data: custTx, error: custErr },
      { data: suppTx, error: suppErr },
    ] = await Promise.all(queries)

    if (acctsErr) console.error('chart_of_accounts error:', acctsErr.message)
    if (entriesErr) console.error('journal_entries error:', entriesErr.message)
    if (custErr) console.error('customer_transactions error:', custErr.message)
    if (suppErr) console.error('supplier_transactions error:', suppErr.message)

    setAccounts(
      (accts || []).map((a) => ({
        id: a.id,
        code: a.code,
        name: a.name,
        type: a.type,
        balance: Number(a.balance),
        parentCode: a.parent_code,
      }))
    )

    setJournal(
      (entries || []).map((e) => ({
        id: e.id,
        date: e.date,
        description: e.description,
        reference: e.reference,
        lines: (e.journal_lines || []).map((l) => ({
          accountId: l.account_id,
          accountName: l.account_name,
          debit: Number(l.debit),
          credit: Number(l.credit),
        })),
      }))
    )

    // Group customer transactions by customer
    const custMap = {}
    ;(custTx || []).forEach((t) => {
      const cid = t.customer_id
      if (!custMap[cid]) {
        custMap[cid] = {
          customerId: cid,
          customerName: t.customers?.name || '',
          transactions: [],
        }
      }
      custMap[cid].transactions.push({
        date: t.date,
        reference: t.reference,
        description: t.type,
        debit: Number(t.amount) > 0 ? Number(t.amount) : 0,
        credit: Number(t.amount) < 0 ? Math.abs(Number(t.amount)) : 0,
        balance: Number(t.balance),
      })
    })
    setCustomerLedgerData(Object.values(custMap))

    // Group supplier transactions by supplier
    const suppMap = {}
    ;(suppTx || []).forEach((t) => {
      const sid = t.supplier_id
      if (!suppMap[sid]) {
        suppMap[sid] = {
          supplierId: sid,
          supplierName: t.suppliers?.name || '',
          transactions: [],
        }
      }
      suppMap[sid].transactions.push({
        date: t.date,
        reference: t.reference,
        description: t.type,
        debit: 0,
        credit: Number(t.amount),
        balance: Number(t.balance),
      })
    })
    setSupplierLedgerData(Object.values(suppMap))

    setLoading(false)
  }, [businessId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addJournalEntry = async (entry) => {
    const { count } = await supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('business_id', businessId)
    const nextNum = String((count || journal.length) + 157).padStart(4, '0')
    const id = `JRN-${nextNum}`

    const { error: entryErr } = await supabase.from('journal_entries').insert([{
      id,
      business_id: businessId,
      date: entry.date || new Date().toISOString().slice(0, 10),
      description: entry.description || '',
      reference: entry.reference || '',
    }])
    if (entryErr) { console.error('addJournalEntry error:', entryErr.message); return null }

    if (entry.lines && entry.lines.length > 0) {
      const lines = entry.lines.map((l) => ({
        entry_id: id,
        account_id: l.accountId,
        account_name: l.accountName,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      }))
      const { error: linesErr } = await supabase.from('journal_lines').insert(lines)
      if (linesErr) console.error('addJournalEntry lines error:', linesErr.message)
    }

    const newEntry = { ...entry, id }
    setJournal((prev) => [newEntry, ...prev])
    return newEntry
  }

  return { accounts, journal, customerLedgerData, supplierLedgerData, loading, addJournalEntry }
}