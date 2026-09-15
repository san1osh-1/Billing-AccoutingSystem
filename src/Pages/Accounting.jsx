import { useState } from 'react'
import { Plus, BookOpen, FileText, Users, Truck } from 'lucide-react'
import useAccounting from '../hooks/useAccounting';
import PageHeader from "../Components/ui/PageHeader.jsx";
import Button from '../Components/ui/Button.jsx';
import ChartOfAccounts from '../Components/accounting/ChartOfAccounts'
import JournalEntryDrawer from '../Components/accounting/JournalEntryDrawer'
import LedgerView from '../Components/accounting/LedgerView'
import DataTable from '../Components/ui/DataTable'
import Badge from '../Components/ui/Badge'
import { formatCurrency, formatDate } from '../utils/format'

export default function Accounting() {
  const { accounts, journal, customerLedgerData, supplierLedgerData, loading, addJournalEntry } = useAccounting()
  const [tab, setTab] = useState('chart')
  const [journalDrawerOpen, setJournalDrawerOpen] = useState(false)

  const journalColumns = [
    { key: 'id', label: 'Entry #', render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'description', label: 'Description', render: (r) => <span className="font-medium text-slate-900">{r.description}</span> },
    { key: 'reference', label: 'Reference', render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference || '—'}</span> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (r) => {
        const total = r.lines.reduce((s, l) => s + l.debit, 0)
        return <span className="font-semibold">{formatCurrency(total)}</span>
      },
    },
    {
      key: 'lines', label: 'Lines', align: 'center',
      render: (r) => <Badge tone="info">{r.lines.length} lines</Badge>,
    },
  ]

  const tabs = [
    { key: 'chart', label: 'Chart of Accounts', icon: BookOpen },
    { key: 'journal', label: 'Journal Entries', icon: FileText },
    { key: 'customer', label: 'Customer Ledger', icon: Users },
    { key: 'supplier', label: 'Supplier Ledger', icon: Truck },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting"
        subtitle="Double-entry bookkeeping and financial ledgers"
        action={tab === 'journal' && (
          <Button icon={Plus} onClick={() => setJournalDrawerOpen(true)}>New Journal Entry</Button>
        )}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === t.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {tab === 'chart' && <ChartOfAccounts accounts={accounts} />}
      
      {tab === 'journal' && (
        <DataTable
          columns={journalColumns}
          data={journal}
          loading={loading}
          emptyTitle="No journal entries"
          emptyDescription="Create your first journal entry to record financial transactions."
          emptyAction={<Button onClick={() => setJournalDrawerOpen(true)}>New Journal Entry</Button>}
        />
      )}
      
      {tab === 'customer' && <LedgerView ledger={customerLedgerData} type="customer" />}
      {tab === 'supplier' && <LedgerView ledger={supplierLedgerData} type="supplier" />}

      <JournalEntryDrawer
        open={journalDrawerOpen}
        onClose={() => setJournalDrawerOpen(false)}
        onSubmit={addJournalEntry}
        accounts={accounts}
      />
    </div>
  )
}