import { useState } from 'react'
import { Plus, FileText, ArrowDown, ArrowUp, Shuffle } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useStockAdjustments from '../hooks/useStockAdjustments'
import useInventory from '../hooks/useInventory'
import { formatDate } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import StockOperationDrawer from '../Components/inventory/StockOperationDrawer'
import { useTranslation } from '../i18n/LanguageContext'

export default function StockAdjustments() {
  const { t } = useTranslation()
  const { all: products, updateProduct } = useProducts()
  const { adjustments, loading, addAdjustment } = useStockAdjustments()
  const { addHistoryEntry } = useInventory(products)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const counts = {
    total: adjustments.length,
    in: adjustments.filter((a) => a.type === 'IN').length,
    out: adjustments.filter((a) => a.type === 'OUT').length,
    adj: adjustments.filter((a) => a.type === 'ADJUSTMENT').length,
  }

  const handleApply = (data) => {
    const p = products.find((x) => x.id === data.productId)
    if (p) updateProduct(p.id, { stock: Math.max(0, p.stock + data.qty) })
    addAdjustment(data)
    addHistoryEntry({ ...data, type: data.type === 'ADJUSTMENT' ? 'ADJ' : data.type })
  }

  const columns = [
    { key: 'id', label: t('adj_no'), render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: t('date'), render: (r) => formatDate(r.date) },
    { key: 'productName', label: t('product'), render: (r) => <span className="font-medium text-slate-900">{r.productName}</span> },
    {
      key: 'type', label: t('type'),
      render: (r) => (
        <Badge tone={r.type === 'IN' ? 'success' : r.type === 'OUT' ? 'danger' : 'warning'}>
          {r.type === 'IN' ? t('stock_in') : r.type === 'OUT' ? t('stock_out') : t('adjustment')}
        </Badge>
      ),
    },
    {
      key: 'qty', label: t('quantity'), align: 'right',
      render: (r) => <span className={`font-semibold ${r.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{r.qty > 0 ? '+' : ''}{r.qty}</span>,
    },
    { key: 'reason', label: t('reason'), render: (r) => <span className="text-slate-600 max-w-xs truncate block">{r.reason}</span> },
    { key: 'reference', label: t('reference'), render: (r) => <span className="font-mono text-xs text-slate-500">{r.reference || '—'}</span> },
    { key: 'user', label: t('user') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('stock_adjustments')}
        subtitle={t('stock_adjustments_subtitle')}
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>{t('new_adjustment')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_adjustments')} value={String(counts.total)} icon={FileText} tone="brand" />
        <KpiCard title={t('stock_in')} value={String(counts.in)} icon={ArrowDown} tone="emerald" />
        <KpiCard title={t('stock_out')} value={String(counts.out)} icon={ArrowUp} tone="rose" />
        <KpiCard title={t('corrections')} value={String(counts.adj)} icon={Shuffle} tone="amber" />
      </div>

      <DataTable columns={columns} data={adjustments} loading={loading} />

      <StockOperationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleApply}
        products={products}
      />
    </div>
  )
}