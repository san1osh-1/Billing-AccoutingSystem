import { useState } from 'react'
import { Plus, Truck, CheckCircle, Wallet, AlertTriangle, Eye, Edit2, Trash2 } from 'lucide-react'
import useSuppliers from '../hooks/useSuppliers'
import { formatCurrency } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import SupplierFilters from '../Components/suppliers/SupplierFilters'
import AddSupplierDrawer from '../Components/suppliers/AddSupplierDrawer'
import SupplierDetailsDrawer from '../Components/suppliers/SupplierDetailsDrawer'
import ConfirmModal from '../Components/ui/ConfirmModal'
import { useTranslation } from '../i18n/LanguageContext'

export default function Suppliers() {
  const { t } = useTranslation()
  const { suppliers, loading, filters, setFilters, kpis, addSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    {
      key: 'name', label: t('supplier'),
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">
            {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-slate-900">{r.name}</div>
            <div className="text-xs text-slate-500">{r.phone}</div>
          </div>
        </div>
      ),
    },
    { key: 'email', label: t('email'), render: (r) => <span className="text-slate-600">{r.email || '—'}</span> },
    { key: 'totalPurchases', label: t('total_purchases'), align: 'right', render: (r) => <span className="font-medium">{formatCurrency(r.totalPurchases)}</span> },
    { key: 'paid', label: t('paid'), align: 'right', render: (r) => <span className="text-emerald-600">{formatCurrency(r.paid)}</span> },
    { key: 'due', label: t('payable'), align: 'right', render: (r) => <span className={`font-semibold ${r.due > 0 ? 'text-rose-600' : 'text-slate-500'}`}>{formatCurrency(r.due)}</span> },
    {
      key: 'status', label: t('status'),
      render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'} dot>{t(r.status === 'Active' ? 'status_active' : 'status_inactive')}</Badge>,
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setViewing(r)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label={t('view')}><Eye className="w-4 h-4" /></button>
          <button onClick={() => { setEditing(r); setDrawerOpen(true) }} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label={t('edit')}><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => setDeleting(r)} className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={t('delete')}><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('suppliers')}
        subtitle={t('suppliers_page_subtitle')}
        action={<Button icon={Plus} onClick={() => { setEditing(null); setDrawerOpen(true) }}>{t('add_supplier')}</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_suppliers')} value={String(kpis.total)} icon={Truck} tone="brand" />
        <KpiCard title={t('active_suppliers')} value={String(kpis.active)} icon={CheckCircle} tone="emerald" />
        <KpiCard title={t('total_payable')} value={formatCurrency(kpis.payable)} icon={Wallet} tone="amber" />
        <KpiCard title={t('overdue_payable')} value={formatCurrency(kpis.overdue)} icon={AlertTriangle} tone="rose" />
      </div>

      <SupplierFilters filters={filters} setFilters={setFilters} />

      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        onRowClick={(r) => setViewing(r)}
        emptyTitle={t('no_suppliers')}
        emptyDescription={t('no_suppliers_hint')}
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>{t('add_supplier')}</Button>}
      />

      <AddSupplierDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditing(null) }}
        initial={editing}
        onSubmit={(data) => editing ? updateSupplier(editing.id, data) : addSupplier(data)}
      />

      <SupplierDetailsDrawer open={Boolean(viewing)} onClose={() => setViewing(null)} supplier={viewing} />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => { deleteSupplier(deleting.id); setDeleting(null) }}
        title={t('are_you_sure')}
        description={`${t('delete_supplier_confirm')} "${deleting?.name}"`}
      />
    </div>
  )
}