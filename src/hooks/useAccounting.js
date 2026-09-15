import { useState, useEffect } from 'react'
import { chartOfAccounts, journalEntries, customerLedger, supplierLedger } from '../data/accounting'

export default function useAccounting() {
  const [accounts, setAccounts] = useState([])
  const [journal, setJournal] = useState([])
  const [customerLedgerData, setCustomerLedgerData] = useState([])
  const [supplierLedgerData, setSupplierLedgerData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setAccounts(chartOfAccounts)
      setJournal(journalEntries)
      setCustomerLedgerData(customerLedger)
      setSupplierLedgerData(supplierLedger)
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [])

  const addJournalEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: `JRN-${String(157 + journal.length).padStart(4, '0')}`,
    }
    setJournal((prev) => [newEntry, ...prev])
    return newEntry
  }

  return { accounts, journal, customerLedgerData, supplierLedgerData, loading, addJournalEntry }
}