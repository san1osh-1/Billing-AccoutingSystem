import { useState } from 'react'
import { Plus, Package, Warehouse, AlertTriangle, ArrowRightLeft } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useInventory from '../hooks/useInventory'
import { formatCurrency, formatDate } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import StockOperationDrawer from '../Components/inventory/StockOperationDrawer'
import { useTranslation } from '../i18n/LanguageContext'

export default function Inventory() {
  const { t } = useTranslation()
  const { all: products, loading: pLoad, updateProduct } = useProducts()
  const { history, loading: hLoad, kpis, addHistoryEntry } = useInventory(products)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [tab, setTab] = useState('stock')

  const handleApply = (data) => {
    const p = products.find((x) => x.id === data.productId)
    if (p) {
      const newStock = Math.max(0, p.stock + data.qty)
      updateProduct(p.id, { stock: newStock })
    }
    addHistoryEntry(data)
  }

  const stockColumns = [
    {
      key: 'name', label: t('product'),
      render: (r) => (
        <div>
          <div className="font-medium text-slate-900">{r.name}</div>
          <div className="text-xs text-slate-500 font-mono">{r.sku}</div>
        </div>
      ),
    },
    { key: 'category', label: t('category') },
    { key: 'stock', label: t('current_stock'), align: 'right',
      render: (r) => (
        <span className={`font-semibold ${r.stock === 0 ? 'text-rose-600' : r.stock <= r.minStock ? 'text-amber-600' : 'text-slate-900'}`}>
          {r.stock} <span className="text-xs text-slate-400 font-normal">{r.unit}</span>
        </span>
      ),
    },
    { key: 'minStock', label: t('min_stock'), align: 'right', render: (r) => <span className="text-slate-500">{r.minStock}</span> },
    { key: 'purchasePrice', label: t('unit_cost'), align: 'right', render: (r) => formatCurrency(r.purchasePrice) },
    {
      key: 'value', label: t('stock_value'), align: 'right',
      render: (r) => <span className="font-semibold">{formatCurrency(r.stock * r.purchasePrice)}</span>,
    },
    {
      key: 'status', label: t('status'),
      render: (r) => {
        const tone = r.stock === 0 ? 'danger' : r.stock <= r.minStock ? 'warning' : 'success'
        const label = r.stock === 0 ? 'status_out_of_stock' : r.stock <= r.minStock ? 'status_low' : 'status_in_stock'
        return <Badge tone={tone} dot>{t(label)}</Badge>
      },
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <Button size="sm" variant="secondary" icon={ArrowRightLeft} onClick={() => { setSelectedProduct(r); setDrawerOpen(true) }}>
          {t('adjust')}
        </Button>
      ),
    },
  ]

  const historyColumns = [
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
    { key: 'reference', label: t('reference'), render: (r) => <span className="font-mono text-xs text-slate-600">{r.reference || '—'}</span> },
    { key: 'user', label: t('user') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_inventory')}
        subtitle={t('inventory_page_subtitle')}
        action={<Button icon={Plus} onClick={() => { setSelectedProduct(null); setDrawerOpen(true) }}>{t('stock_operation')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_products')} value={String(kpis.totalProducts)} icon={Package} tone="brand" />
        <KpiCard title={t('total_stock')} value={String(kpis.totalStock)} icon={Warehouse} tone="sky" />
        <KpiCard title={t('low_stock')} value={String(kpis.lowStock)} icon={AlertTriangle} tone="amber" />
        <KpiCard title={t('stock_value')} value={formatCurrency(kpis.stockValue)} icon={Package} tone="emerald" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <button onClick={() => setTab('stock')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === 'stock' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
          {t('stock_levels')}
        </button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === 'history' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
          {t('stock_history')}
        </button>
      </div>

      {tab === 'stock' ? (
        <DataTable columns={stockColumns} data={products} loading={pLoad} />
      ) : (
        <DataTable columns={historyColumns} data={history} loading={hLoad} />
      )}

      <StockOperationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleApply}
        products={products}
        initialProduct={selectedProduct}
      />
    </div>
  )
}