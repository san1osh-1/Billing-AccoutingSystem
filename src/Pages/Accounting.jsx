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
import { useTranslation } from '../i18n/LanguageContext'

export default function Accounting() {
  const { t } = useTranslation()
  const { accounts, journal, customerLedgerData, supplierLedgerData, loading, addJournalEntry } = useAccounting()
  const [tab, setTab] = useState('chart')
  const [journalDrawerOpen, setJournalDrawerOpen] = useState(false)

  const journalColumns = [
    { key: 'id', label: t('entry_no'), render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: t('date'), render: (r) => formatDate(r.date) },
    { key: 'description', label: t('description'), render: (r) => <span className="font-medium text-slate-900">{r.description}</span> },
    { key: 'reference', label: t('reference'), render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference || '—'}</span> },
    {
      key: 'amount', label: t('amount'), align: 'right',
      render: (r) => {
        const total = r.lines.reduce((s, l) => s + l.debit, 0)
        return <span className="font-semibold">{formatCurrency(total)}</span>
      },
    },
    {
      key: 'lines', label: t('lines'), align: 'center',
      render: (r) => <Badge tone="info">{r.lines.length} {t('lines')}</Badge>,
    },
  ]

  const tabs = [
    { key: 'chart', label: t('chart_of_accounts'), icon: BookOpen },
    { key: 'journal', label: t('journal_entries'), icon: FileText },
    { key: 'customer', label: t('customer_ledger'), icon: Users },
    { key: 'supplier', label: t('supplier_ledger'), icon: Truck },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_accounting')}
        subtitle={t('accounting_subtitle')}
        action={tab === 'journal' && (
          <Button icon={Plus} onClick={() => setJournalDrawerOpen(true)}>{t('new_journal_entry')}</Button>
        )}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon
          return (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === tabItem.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tabItem.label}
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
          emptyTitle={t('no_journal_entries')}
          emptyDescription={t('create_journal_hint')}
          emptyAction={<Button onClick={() => setJournalDrawerOpen(true)}>{t('new_journal_entry')}</Button>}
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