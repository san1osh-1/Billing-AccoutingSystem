import { useState } from 'react'
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Receipt } from 'lucide-react'
import useCustomers from '../hooks/useCustomers'
import useSuppliers from '../hooks/useSuppliers'
import usePayments from '../hooks/usePayments'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import RecordPaymentDrawer from '../Components/payments/RecordPaymentDrawer'
import { useTranslation } from '../i18n/LanguageContext'

export default function Payments() {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const { all: customers } = useCustomers()
  const { all: suppliers } = useSuppliers()
  const { payments, loading, addPayment, kpis } = usePayments()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? payments : payments.filter((p) => p.type === filter)

  const columns = [
    { key: 'id', label: t('payment_no'), render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: t('date'), render: (r) => formatDate(r.date) },
    {
      key: 'type', label: t('type'),
      render: (r) => (
        <Badge tone={r.type === 'received' ? 'success' : 'danger'}>
          {r.type === 'received' ? `↓ ${t('received')}` : `↑ ${t('paid_out')}`}
        </Badge>
      ),
    },
    { key: 'partyName', label: t('party'), render: (r) => <span className="font-medium text-slate-900">{r.partyName}</span> },
    {
      key: 'amount', label: t('amount'), align: 'right',
      render: (r) => <span className={`font-semibold ${r.type === 'received' ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(r.amount)}</span>,
    },
    { key: 'method', label: t('method'), render: (r) => <Badge tone="info">{r.method.toUpperCase()}</Badge> },
    { key: 'reference', label: t('reference'), render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference || '—'}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_payments')}
        subtitle={t('payments_page_subtitle')}
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>{t('record_payment')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('received')} value={formatCurrency(kpis.received)} icon={ArrowDownCircle} tone="emerald" />
        <KpiCard title={t('paid_out')} value={formatCurrency(kpis.made)} icon={ArrowUpCircle} tone="rose" />
        <KpiCard title={t('net_flow')} value={formatCurrency(kpis.net)} icon={Wallet} tone="brand" />
        <KpiCard title={t('transactions')} value={num(kpis.count)} icon={Receipt} tone="sky" />
      </div>

      <div className="flex gap-2">
        {['all', 'received', 'made'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${filter === f ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            {f === 'all' ? t('all') : f === 'received' ? `↓ ${t('received')}` : `↑ ${t('paid_out')}`}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <RecordPaymentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={addPayment}
        customers={customers}
        suppliers={suppliers}
      />
    </div>
  )
}