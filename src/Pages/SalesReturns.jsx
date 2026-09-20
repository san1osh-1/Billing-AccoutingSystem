import { useState } from 'react'
import { Plus, RotateCcw, Wallet, CheckCircle2, Clock } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useSales from '../hooks/useSales'
import useSalesReturns from '../hooks/useSalesReturns'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import ReturnsDrawer from '../Components/sales/ReturnsDrawer'
import ReturnDetailsModal from '../Components/sales/ReturnDetailsModal'
import { useTranslation } from '../i18n/LanguageContext'

const statusTone = (s) => (s === 'Refunded' ? 'success' : 'warning')
const statusKey = { Refunded: 'status_refunded', Pending: 'status_pending' }

export default function SalesReturns() {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const { all: products, updateProduct } = useProducts()
  const { sales } = useSales()
  const { returns, loading, addReturn, kpis } = useSalesReturns()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewing, setViewing] = useState(null)

  const handleSave = (data) => {
    const saved = addReturn(data)
    data.items.forEach((item) => {
      const p = products.find((x) => x.id === item.productId)
      if (p) updateProduct(p.id, { stock: p.stock + item.qty })
    })
    return saved
  }

  const columns = [
    {
      key: 'id', label: t('return_no'),
      render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span>,
    },
    {
      key: 'saleId', label: t('reference_invoice'),
      render: (r) => <span className="font-mono text-xs text-slate-600">{r.saleId || '—'}</span>,
    },
    {
      key: 'customerName', label: t('customer'),
      render: (r) => <span className="font-medium text-slate-900">{r.customerName}</span>,
    },
    { key: 'date', label: t('date'), render: (r) => formatDate(r.date) },
    {
      key: 'grandTotal', label: t('total'), align: 'right',
      render: (r) => <span className="font-semibold">{formatCurrency(r.grandTotal)}</span>,
    },
    {
      key: 'reason', label: t('reason'),
      render: (r) => <span className="text-slate-600 max-w-xs truncate block">{r.reason || '—'}</span>,
    },
    {
      key: 'status', label: t('status'),
      render: (r) => <Badge tone={statusTone(r.status)} dot>{t(statusKey[r.status] || r.status)}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_sales_returns')}
        subtitle={t('sales_returns_page_subtitle')}
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>{t('new_return')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_return_amount')} value={formatCurrency(kpis.total)} icon={RotateCcw} tone="brand" />
        <KpiCard title={t('refunded')} value={formatCurrency(kpis.refunded)} icon={CheckCircle2} tone="emerald" />
        <KpiCard title={t('pending_refund')} value={formatCurrency(kpis.pending)} icon={Clock} tone="amber" />
        <KpiCard title={t('credit_notes')} value={num(kpis.count)} icon={Wallet} tone="sky" />
      </div>

      <DataTable
        columns={columns}
        data={returns}
        loading={loading}
        onRowClick={setViewing}
        emptyTitle={t('no_returns')}
        emptyDescription={t('no_returns_hint')}
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>{t('new_return')}</Button>}
      />

      <ReturnsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSave}
        sales={sales}
        products={products}
      />

      <ReturnDetailsModal open={Boolean(viewing)} onClose={() => setViewing(null)} ret={viewing} />
    </div>
  )
}
