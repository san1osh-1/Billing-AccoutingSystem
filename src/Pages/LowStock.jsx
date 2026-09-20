import { useMemo } from 'react'
import { AlertTriangle, AlertCircle, TrendingDown, Wallet } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import PageHeader from '../Components/ui/PageHeader'
import KpiCard from '../Components/ui/KpiCard'
import Badge from '../Components/ui/Badge'
import DataTable from '../Components/ui/DataTable'
import { useTranslation } from '../i18n/LanguageContext'

export default function LowStock() {
  const { t, num, formatCurrency } = useTranslation()
  const { all: products, loading } = useProducts()

  const rows = useMemo(
    () =>
      products
        .filter((p) => p.stock <= p.minStock)
        .sort((a, b) => a.stock - b.stock),
    [products]
  )

  const outOfStock = rows.filter((p) => p.stock === 0)
  const critical = rows.filter((p) => p.stock > 0 && p.stock < p.minStock * 0.5)

  const restockValue = useMemo(
    () => rows.reduce((s, p) => s + Math.max(p.minStock - p.stock, 0) * p.purchasePrice, 0),
    [rows]
  )

  const columns = [
    {
      key: 'name',
      label: t('product'),
      render: (r) => (
        <div>
          <span className="font-medium text-slate-900">{r.name}</span>
          <span className="block text-xs text-slate-500 font-mono">{r.sku}</span>
        </div>
      ),
    },
    { key: 'category', label: t('category') },
    {
      key: 'stock',
      label: t('stock'),
      align: 'right',
      render: (r) => {
        const out = r.stock === 0
        return (
          <span className={out ? 'font-bold text-rose-600' : ''}>
            {num(r.stock)} <span className="text-xs text-slate-400">{r.unit}</span>
          </span>
        )
      },
    },
    {
      key: 'minStock',
      label: t('min_stock'),
      align: 'right',
      render: (r) => <span>{num(r.minStock)} <span className="text-xs text-slate-400">{r.unit}</span></span>,
    },
    {
      key: 'restock',
      label: t('quantity'),
      align: 'right',
      render: (r) => {
        const qty = Math.max(r.minStock - r.stock, 0)
        return <span className="font-medium text-sky-600">+{num(qty)}</span>
      },
    },
    {
      key: 'status',
      label: t('status'),
      align: 'center',
      render: (r) => {
        if (r.stock === 0) return <Badge tone="danger" dot>{t('status_out_of_stock')}</Badge>
        if (r.stock < r.minStock * 0.5) return <Badge tone="danger" dot>{t('critical_stock')}</Badge>
        return <Badge tone="warning" dot>{t('low_stock')}</Badge>
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav_low_stock')} subtitle={t('low_stock_page_subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('out_of_stock')} value={num(outOfStock.length)} icon={AlertCircle} tone="rose" />
        <KpiCard title={t('critical_stock')} value={num(critical.length)} icon={AlertTriangle} tone="amber" />
        <KpiCard title={t('low_stock')} value={num(rows.length)} icon={TrendingDown} tone="amber" />
        <KpiCard title={t('stock_value')} value={formatCurrency(restockValue)} icon={Wallet} tone="sky" />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        emptyTitle={t('no_records_found')}
        emptyDescription={t('all_products_stocked')}
      />
    </div>
  )
}
