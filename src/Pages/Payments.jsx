import { useState } from 'react'
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Receipt } from 'lucide-react'
import useCustomers from '../hooks/useCustomers'
import useSuppliers from '../hooks/useSuppliers'
import usePayments from '../hooks/usePayments'
import { formatCurrency, formatDate } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import RecordPaymentDrawer from '../Components/payments/RecordPaymentDrawer'

export default function Payments() {
  const { all: customers } = useCustomers()
  const { all: suppliers } = useSuppliers()
  const { payments, loading, addPayment, kpis } = usePayments()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? payments : payments.filter((p) => p.type === filter)

  const columns = [
    { key: 'id', label: 'Payment #', render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    {
      key: 'type', label: 'Type',
      render: (r) => (
        <Badge tone={r.type === 'received' ? 'success' : 'danger'}>
          {r.type === 'received' ? '↓ Received' : '↑ Made'}
        </Badge>
      ),
    },
    { key: 'partyName', label: 'Party', render: (r) => <span className="font-medium text-slate-900">{r.partyName}</span> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (r) => <span className={`font-semibold ${r.type === 'received' ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(r.amount)}</span>,
    },
    { key: 'method', label: 'Method', render: (r) => <Badge tone="info">{r.method.toUpperCase()}</Badge> },
    { key: 'reference', label: 'Reference', render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference || '—'}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Track customer receipts and supplier payments"
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>Record Payment</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Received" value={formatCurrency(kpis.received)} icon={ArrowDownCircle} tone="emerald" />
        <KpiCard title="Paid Out" value={formatCurrency(kpis.made)} icon={ArrowUpCircle} tone="rose" />
        <KpiCard title="Net Flow" value={formatCurrency(kpis.net)} icon={Wallet} tone="brand" />
        <KpiCard title="Transactions" value={String(kpis.count)} icon={Receipt} tone="sky" />
      </div>

      <div className="flex gap-2">
        {['all', 'received', 'made'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${filter === f ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            {f === 'all' ? 'All' : f === 'received' ? '↓ Received' : '↑ Made'}
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