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

export default function Suppliers() {
  const { suppliers, loading, filters, setFilters, kpis, addSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    {
      key: 'name', label: 'Supplier',
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
    { key: 'email', label: 'Email', render: (r) => <span className="text-slate-600">{r.email || '—'}</span> },
    { key: 'totalPurchases', label: 'Total Purchases', align: 'right', render: (r) => <span className="font-medium">{formatCurrency(r.totalPurchases)}</span> },
    { key: 'paid', label: 'Paid', align: 'right', render: (r) => <span className="text-emerald-600">{formatCurrency(r.paid)}</span> },
    { key: 'due', label: 'Payable', align: 'right', render: (r) => <span className={`font-semibold ${r.due > 0 ? 'text-rose-600' : 'text-slate-500'}`}>{formatCurrency(r.due)}</span> },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'} dot>{r.status}</Badge>,
    },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setViewing(r)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="View"><Eye className="w-4 h-4" /></button>
          <button onClick={() => { setEditing(r); setDrawerOpen(true) }} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Edit"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => setDeleting(r)} className="p-1.5 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle="Manage suppliers, payables and purchase ledger"
        action={<Button icon={Plus} onClick={() => { setEditing(null); setDrawerOpen(true) }}>Add Supplier</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Suppliers" value={String(kpis.total)} icon={Truck} tone="brand" />
        <KpiCard title="Active Suppliers" value={String(kpis.active)} icon={CheckCircle} tone="emerald" />
        <KpiCard title="Total Payable" value={formatCurrency(kpis.payable)} icon={Wallet} tone="amber" />
        <KpiCard title="Overdue Payable" value={formatCurrency(kpis.overdue)} icon={AlertTriangle} tone="rose" />
      </div>

      <SupplierFilters filters={filters} setFilters={setFilters} />

      <DataTable
        columns={columns}
        data={suppliers}
        loading={loading}
        onRowClick={(r) => setViewing(r)}
        emptyTitle="No suppliers yet"
        emptyDescription="Add your first supplier to start tracking purchases."
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>Add Supplier</Button>}
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
        title="Delete Supplier?"
        description={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}