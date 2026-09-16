import { useState } from 'react'
import { Plus, Users, UserCheck, Wallet, AlertTriangle, Eye, Edit2, Trash2 } from 'lucide-react'
import useCustomers from '../hooks/useCustomers'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import CustomerFilters from '../Components/customer/CustomerFilters'
import AddCustomerDrawer from '../Components/customer/AddCustomerDrawer'
import CustomerDetailsDrawer from '../Components/customer/CustomerDetailsDrawer'
import ConfirmModal from '../Components/ui/ConfirmModal'
import { useTranslation } from '../i18n/LanguageContext'

export default function Customers() {
  const { t, num, formatCurrency } = useTranslation()
  const { customers, loading, filters, setFilters, kpis, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const statusKeys = { Active: 'status_active', Overdue: 'status_overdue' }

  const columns = [
    {
      key: 'name',
      label: t('customer'),
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
      label: t('email'),
      render: (r) => <span className="text-slate-600">{r.email || '—'}</span>,
    },
    {
      key: 'totalPurchases',
      label: t('total_purchases'),
      align: 'right',
      render: (r) => <span className="font-medium">{formatCurrency(r.totalPurchases)}</span>,
    },
    {
      key: 'paid',
      label: t('paid'),
      align: 'right',
      render: (r) => <span className="text-emerald-600">{formatCurrency(r.paid)}</span>,
    },
    {
      key: 'due',
      label: t('due'),
      align: 'right',
      render: (r) => (
        <span className={`font-semibold ${r.due > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {formatCurrency(r.due)}
        </span>
      ),
    },
    {
      key: 'status',
      label: t('status'),
      render: (r) => (
        <Badge
          tone={r.status === 'Active' ? 'success' : r.status === 'Overdue' ? 'danger' : 'neutral'}
          dot
        >
          {t(statusKeys[r.status] || 'status_inactive')}
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
            aria-label={t('view')}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditing(r)
              setDrawerOpen(true)
            }}
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
        title={t('customers')}
        subtitle={t('customers_page_subtitle')}
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditing(null)
              setDrawerOpen(true)
            }}
          >
            {t('add_customer')}
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('total_customers')}
          value={num(kpis.total)}
          icon={Users}
          tone="brand"
        />
        <KpiCard
          title={t('active_customers')}
          value={num(kpis.active)}
          icon={UserCheck}
          tone="emerald"
        />
        <KpiCard
          title={t('receivable')}
          value={formatCurrency(kpis.receivable)}
          icon={Wallet}
          tone="amber"
        />
        <KpiCard
          title={t('overdue')}
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
        emptyTitle={t('no_customers')}
        emptyDescription={t('no_customers_hint')}
        emptyAction={
          <Button onClick={() => setDrawerOpen(true)}>{t('add_customer')}</Button>
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
        title={t('are_you_sure')}
        description={`${t('delete_customer_confirm')} "${deleting?.name}"`}
      />
    </div>
  )
}