import { useState } from 'react'
import { Plus, Users, UserCheck, Wallet, AlertTriangle, Eye, Edit2, Trash2 } from 'lucide-react'
import useCustomers from '../hooks/useCustomers'
import { formatCurrency } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import CustomerFilters from '../Components/customer/CustomerFilters'
import AddCustomerDrawer from '../Components/customer/AddCustomerDrawer'
import CustomerDetailsDrawer from '../Components/customer/CustomerDetailsDrawer'
import ConfirmModal from '../Components/ui/ConfirmModal'

export default function Customers() {
  const { customers, loading, filters, setFilters, kpis, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
            {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-slate-900">{r.name}</div>
            <div className="text-xs text-slate-500">{r.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (r) => <span className="text-slate-600">{r.email || '—'}</span>,
    },
    {
      key: 'totalPurchases',
      label: 'Total Purchases',
      align: 'right',
      render: (r) => <span className="font-medium">{formatCurrency(r.totalPurchases)}</span>,
    },
    {
      key: 'paid',
      label: 'Paid',
      align: 'right',
      render: (r) => <span className="text-emerald-600">{formatCurrency(r.paid)}</span>,
    },
    {
      key: 'due',
      label: 'Due',
      align: 'right',
      render: (r) => (
        <span className={`font-semibold ${r.due > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {formatCurrency(r.due)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge
          tone={r.status === 'Active' ? 'success' : r.status === 'Overdue' ? 'danger' : 'neutral'}
          dot
        >
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setViewing(r)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditing(r)
              setDrawerOpen(true)
            }}
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
        title="Customers"
        subtitle="Manage customers, receivables and ledger"
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditing(null)
              setDrawerOpen(true)
            }}
          >
            Add Customer
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Customers"
          value={String(kpis.total)}
          icon={Users}
          tone="brand"
        />
        <KpiCard
          title="Active Customers"
          value={String(kpis.active)}
          icon={UserCheck}
          tone="emerald"
        />
        <KpiCard
          title="Total Receivable"
          value={formatCurrency(kpis.receivable)}
          icon={Wallet}
          tone="amber"
        />
        <KpiCard
          title="Overdue Amount"
          value={formatCurrency(kpis.overdue)}
          icon={AlertTriangle}
          tone="rose"
        />
      </div>

      {/* Filters */}
      <CustomerFilters filters={filters} setFilters={setFilters} />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        onRowClick={(r) => setViewing(r)}
        emptyTitle="No customers yet"
        emptyDescription="Add your first customer to start tracking sales and receivables."
        emptyAction={
          <Button onClick={() => setDrawerOpen(true)}>Add Customer</Button>
        }
      />

      {/* Add / Edit Drawer */}
      <AddCustomerDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditing(null)
        }}
        initial={editing}
        onSubmit={(data) =>
          editing ? updateCustomer(editing.id, data) : addCustomer(data)
        }
      />

      {/* Details Drawer */}
      <CustomerDetailsDrawer
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        customer={viewing}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          deleteCustomer(deleting.id)
          setDeleting(null)
        }}
        title="Delete Customer?"
        description={`Are you sure you want to delete "${deleting?.name}"? All associated records will be removed.`}
      />
    </div>
  )
}