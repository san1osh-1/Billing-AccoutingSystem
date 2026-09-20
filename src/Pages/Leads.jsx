import { useState } from 'react'
import { Plus, Target, SquareMenu, Clock, UserCheck, Eye, Edit2, Trash2 } from 'lucide-react'
import useLeads from '../hooks/useLeads'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import ConfirmModal from '../Components/ui/ConfirmModal'
import LeadFilters from '../Components/lead/LeadFilters'
import AddLeadDrawer from '../Components/lead/AddLeadDrawer'
import LeadDetailsDrawer from '../Components/lead/LeadDetailsDrawer'
import SourceIcon, { sourceMeta } from '../Components/lead/SourceIcon'
import { leadStatuses } from '../data/leads'
import { useTranslation } from '../i18n/LanguageContext'

export default function Leads() {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const {
    leads,
    all,
    loading,
    filters,
    setFilters,
    kpis,
    addLead,
    updateLead,
    deleteLead,
  } = useLeads()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    {
      key: 'name',
      label: t('lead_name'),
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-slate-900 truncate">{r.name}</div>
            {r.accountName && <div className="text-xs text-slate-500 truncate">{r.accountName}</div>}
          </div>
        </div>
      ),
    },
    {
      key: 'source',
      label: t('source'),
      render: (r) => {
        const meta = sourceMeta(r.source)
        return (
          <span className="inline-flex items-center gap-2 text-slate-600">
            <SourceIcon source={r.source} className="w-4 h-4" />
            <span>{t(meta.labelKey)}</span>
          </span>
        )
      },
    },
    {
      key: 'interest',
      label: t('interest'),
      render: (r) => <span className="text-slate-600 truncate max-w-[180px] block">{r.interest || '—'}</span>,
    },
    {
      key: 'expectedValue',
      label: t('expected_value'),
      align: 'right',
      sortAccessor: (r) => r.expectedValue,
      render: (r) => <span className="font-medium text-slate-900">{formatCurrency(r.expectedValue)}</span>,
    },
    {
      key: 'date',
      label: t('date'),
      render: (r) => <span className="text-slate-600">{formatDate(r.date)}</span>,
    },
    {
      key: 'status',
      label: t('status'),
      render: (r) => {
        const status = leadStatuses.find((s) => s.value === r.status) || leadStatuses[0]
        return <Badge tone={status.tone} dot>{t(status.labelKey)}</Badge>
      },
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
        title={t('leads')}
        subtitle={t('leads_page_subtitle')}
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditing(null)
              setDrawerOpen(true)
            }}
          >
            {t('add_lead')}
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_leads')} value={num(kpis.total)} icon={Target} tone="brand" />
        <KpiCard title={t('new_leads')} value={num(kpis.new)} icon={SquareMenu} tone="sky" />
        <KpiCard title={t('follow_up_leads')} value={num(kpis.followUp)} icon={Clock} tone="amber" />
        <KpiCard title={t('converted_leads')} value={num(kpis.converted)} icon={UserCheck} tone="emerald" />
      </div>

      {/* Filters */}
      <LeadFilters leads={all} filters={filters} setFilters={setFilters} />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={leads}
        loading={loading}
        onRowClick={(r) => setViewing(r)}
        emptyTitle={t('no_leads')}
        emptyDescription={t('no_leads_hint')}
        emptyAction={
          <Button
            onClick={() => {
              setEditing(null)
              setDrawerOpen(true)
            }}
          >
            {t('add_lead')}
          </Button>
        }
      />

      {/* Add / Edit Drawer */}
      <AddLeadDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditing(null)
        }}
        initial={editing}
        onSubmit={(data) => (editing ? updateLead(editing.id, data) : addLead(data))}
      />

      {/* Details Drawer */}
      <LeadDetailsDrawer open={Boolean(viewing)} onClose={() => setViewing(null)} lead={viewing} />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          deleteLead(deleting.id)
          setDeleting(null)
        }}
        title={t('are_you_sure')}
        description={`${t('delete_lead_confirm')} "${deleting?.name}"`}
      />
    </div>
  )
}