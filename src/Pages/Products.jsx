import { useState } from 'react'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import { formatCurrency } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import ProductFilters from '../Components/products/ProductFilters'
import AddProductDrawer from '../Components/products/AddProductDrawer'
import ConfirmModal from '../Components/ui/ConfirmModal'
import { useTranslation } from '../i18n/LanguageContext'

export default function Products() {
  const { t } = useTranslation()
  const { products, all, loading, filters, setFilters, addProduct, deleteProduct, updateProduct } = useProducts()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const kpis = [
    { title: t('total_products'), value: all.length, icon: Package, tone: 'brand' },
    { title: t('in_stock'), value: all.filter((p) => p.stock > p.minStock).length, tone: 'emerald' },
    { title: t('low_stock'), value: all.filter((p) => p.stock > 0 && p.stock <= p.minStock).length, tone: 'amber' },
    { title: t('out_of_stock'), value: all.filter((p) => p.stock === 0).length, tone: 'rose' },
  ]

  const statusKeys = { Active: 'status_active', 'Low Stock': 'status_low', 'Out of Stock': 'status_out_of_stock' }
  const statusTone = (s) =>
    s === 'Active' ? 'success' : s === 'Low Stock' ? 'warning' : 'danger'

  const columns = [
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
    { key: 'purchasePrice', label: t('purchase'), align: 'right', render: (r) => formatCurrency(r.purchasePrice) },
    { key: 'sellingPrice', label: t('selling'), align: 'right', render: (r) => formatCurrency(r.sellingPrice) },
    {
      key: 'stock', label: t('stock'), align: 'right',
      render: (r) => (
        <span className={`font-semibold ${r.stock === 0 ? 'text-rose-600' : r.stock <= r.minStock ? 'text-amber-600' : 'text-slate-900'}`}>
          {r.stock} <span className="text-xs text-slate-400 font-normal">{r.unit}</span>
        </span>
      ),
    },
    {
      key: 'status', label: t('status'),
      render: (r) => <Badge tone={statusTone(r.status)} dot>{t(statusKeys[r.status] || r.status)}</Badge>,
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditing(r); setDrawerOpen(true) }}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={t('edit')}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleting(r)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            aria-label={t('delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('products')}
        subtitle={t('products_page_subtitle')}
        action={<Button icon={Plus} onClick={() => { setEditing(null); setDrawerOpen(true) }}>{t('add_product')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.title} {...k} value={String(k.value)} />)}
      </div>

      <ProductFilters filters={filters} setFilters={setFilters} />

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        pageSize={10}
        emptyTitle={t('no_products_found')}
        emptyDescription={t('no_products_hint')}
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>{t('add_product')}</Button>}
      />

      <AddProductDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditing(null) }}
        initial={editing}
        onSubmit={(data) => editing ? updateProduct(editing.id, data) : addProduct(data)}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => { deleteProduct(deleting.id); setDeleting(null) }}
        title={t('are_you_sure')}
        description={`${t('delete_product_confirm')} "${deleting?.name}"`}
      />
    </div>
  )
}