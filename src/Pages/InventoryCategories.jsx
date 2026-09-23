import { useState, useMemo } from 'react'
import { FolderTree, Package, Boxes, Wallet, Plus, Trash2 } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useCategories from '../hooks/useCategories'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import KpiCard from '../Components/ui/KpiCard'
import Badge from '../Components/ui/Badge'
import DataTable from '../Components/ui/DataTable'
import FilterBar from '../Components/ui/FilterBar'
import ConfirmModal from '../Components/ui/ConfirmModal'
import GroupedProductsDrawer from '../Components/inventory/GroupedProductsDrawer'
import AddCategoryModal from '../Components/inventory/AddCategoryModal'
import { useTranslation } from '../i18n/LanguageContext'

export default function InventoryCategories() {
  const { t, num, formatCurrency } = useTranslation()
  const { all: products, loading } = useProducts()
  const { categories, addCategory, deleteCategory } = useCategories()
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const rows = useMemo(() => {
    const names = new Set([...categories.map((c) => c.name), ...products.map((p) => p.category).filter(Boolean)])
    return [...names]
      .map((name) => {
        const items = products.filter((p) => p.category === name)
        return {
          id: name,
          name,
          productCount: items.length,
          units: items.reduce((s, p) => s + p.stock, 0),
          value: items.reduce((s, p) => s + p.stock * p.purchasePrice, 0),
          lowCount: items.filter((p) => p.stock <= p.minStock).length,
          dbId: categories.find((c) => c.name === name)?.id,
          items,
        }
      })
      .filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name))
  }, [products, categories, search])

  const totals = useMemo(
    () => rows.reduce((acc, r) => ({ units: acc.units + r.units, value: acc.value + r.value }), { units: 0, value: 0 }),
    [rows]
  )

  const handleAdd = (name) => {
    addCategory(name)
  }

  const columns = [
    { key: 'name', label: t('category'), render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'productCount', label: t('products'), align: 'right', render: (r) => num(r.productCount) },
    { key: 'units', label: t('total_units'), align: 'right', render: (r) => num(r.units) },
    { key: 'value', label: t('stock_value'), align: 'right', render: (r) => formatCurrency(r.value) },
    {
      key: 'lowCount', label: t('low_stock'), align: 'right',
      render: (r) => (r.lowCount ? <Badge tone="warning">{num(r.lowCount)}</Badge> : <span className="text-slate-300">—</span>),
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          {r.dbId && (
            <button
              onClick={() => setDeleting(r)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              aria-label={t('delete_category')}
              title={t('delete_category')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_categories')}
        subtitle={t('categories_page_subtitle')}
        action={<Button icon={Plus} onClick={() => setAddOpen(true)}>{t('add_category')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_categories')} value={num(rows.length)} icon={FolderTree} tone="brand" />
        <KpiCard title={t('total_products')} value={num(products.length)} icon={Package} tone="sky" />
        <KpiCard title={t('total_units')} value={num(totals.units)} icon={Boxes} tone="emerald" />
        <KpiCard title={t('stock_value')} value={formatCurrency(totals.value)} icon={Wallet} tone="amber" />
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search') + '...'}
        onClear={() => setSearch('')}
      />

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        onRowClick={setViewing}
        emptyTitle={t('no_records_found')}
      />

      <GroupedProductsDrawer
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`${t('products_in_category')}: ${viewing?.name || ''}`}
        products={viewing?.items || []}
      />

      <AddCategoryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => { deleteCategory(deleting?.dbId); setDeleting(null) }}
        title={t('delete_category')}
        description={`${t('delete_category_confirm')}\n"${deleting?.name || ''}"`}
      />
    </div>
  )
}