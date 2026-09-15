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

export default function Products() {
  const { products, all, loading, filters, setFilters, addProduct, deleteProduct, updateProduct } = useProducts()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const kpis = [
    { title: 'Total Products', value: all.length, icon: Package, tone: 'brand' },
    { title: 'In Stock', value: all.filter((p) => p.stock > p.minStock).length, tone: 'emerald' },
    { title: 'Low Stock', value: all.filter((p) => p.stock > 0 && p.stock <= p.minStock).length, tone: 'amber' },
    { title: 'Out of Stock', value: all.filter((p) => p.stock === 0).length, tone: 'rose' },
  ]

  const statusTone = (s) =>
    s === 'Active' ? 'success' : s === 'Low Stock' ? 'warning' : 'danger'

  const columns = [
    {
      key: 'name', label: 'Product',
      render: (r) => (
        <div>
          <div className="font-medium text-slate-900">{r.name}</div>
          <div className="text-xs text-slate-500 font-mono">{r.sku}</div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'purchasePrice', label: 'Purchase', align: 'right', render: (r) => formatCurrency(r.purchasePrice) },
    { key: 'sellingPrice', label: 'Selling', align: 'right', render: (r) => formatCurrency(r.sellingPrice) },
    {
      key: 'stock', label: 'Stock', align: 'right',
      render: (r) => (
        <span className={`font-semibold ${r.stock === 0 ? 'text-rose-600' : r.stock <= r.minStock ? 'text-amber-600' : 'text-slate-900'}`}>
          {r.stock} <span className="text-xs text-slate-400 font-normal">{r.unit}</span>
        </span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge tone={statusTone(r.status)} dot>{r.status}</Badge>,
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditing(r); setDrawerOpen(true) }}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleting(r)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete"
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
        title="Products"
        subtitle="Manage your product catalog, pricing and stock levels"
        action={<Button icon={Plus} onClick={() => { setEditing(null); setDrawerOpen(true) }}>Add Product</Button>}
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
        emptyTitle="No products found"
        emptyDescription="Add your first product to get started."
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>Add Product</Button>}
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
        title="Delete Product?"
        description={`Are you sure you want to delete "${deleting?.name}"? This will remove it from inventory and cannot be undone.`}
      />
    </div>
  )
}