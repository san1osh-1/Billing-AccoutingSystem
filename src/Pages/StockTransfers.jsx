import { useState, useMemo } from 'react'
import { ArrowRightLeft, Repeat, CheckCircle, Clock, Plus } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useStockTransfers from '../hooks/useStockTransfers'
import PageHeader from '../Components/ui/PageHeader'
import KpiCard from '../Components/ui/KpiCard'
import Badge from '../Components/ui/Badge'
import DataTable from '../Components/ui/DataTable'
import FilterBar from '../Components/ui/FilterBar'
import Button from '../Components/ui/Button'
import TransferDrawer from '../Components/inventory/TransferDrawer'
import { useTranslation } from '../i18n/LanguageContext'

export default function StockTransfers() {
  const { t, num, formatDate } = useTranslation()
  const { all: products } = useProducts()
  const { transfers, loading, addTransfer, kpis } = useStockTransfers()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const rows = useMemo(
    () =>
      transfers.filter((x) => {
        const matchSearch = !search
          || x.id.toLowerCase().includes(search.toLowerCase())
          || x.productName.toLowerCase().includes(search.toLowerCase())
          || x.fromLocation.toLowerCase().includes(search.toLowerCase())
          || x.toLocation.toLowerCase().includes(search.toLowerCase())
        const matchStatus = !statusFilter || x.status === statusFilter
        return matchSearch && matchStatus
      }),
    [transfers, search, statusFilter]
  )

  const columns = [
    {
      key: 'id', label: t('transfer_no'),
      render: (r) => <span className="font-medium text-sky-700 font-mono text-xs">{r.id}</span>,
    },
    {
      key: 'date', label: t('date'),
      render: (r) => <span className="whitespace-nowrap">{formatDate(r.date)}</span>,
    },
    {
      key: 'productName', label: t('product'),
      render: (r) => <span className="font-medium text-slate-900">{r.productName}</span>,
    },
    {
      key: 'route', label: t('from_location') + ' → ' + t('to_location'),
      sortable: false,
      render: (r) => (
        <span className="flex items-center gap-1.5 text-sm text-slate-700">
          <span>{r.fromLocation}</span>
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>{r.toLocation}</span>
        </span>
      ),
    },
    {
      key: 'qty', label: t('quantity'),
      align: 'right',
      render: (r) => <span className="font-medium">{num(r.qty)}</span>,
    },
    { key: 'reference', label: t('reference'), render: (r) => <span className="font-mono text-xs text-slate-500">{r.reference || '—'}</span> },
    {
      key: 'status', label: t('status'),
      render: (r) => (
        <Badge tone={r.status === 'Completed' ? 'success' : 'warning'} dot>
          {r.status === 'Completed' ? t('completed_transfers') : t('pending_transfers')}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_stock_transfer')}
        subtitle={t('transfers_page_subtitle')}
        action={
          <Button icon={Plus} onClick={() => setDrawerOpen(true)}>
            {t('new_transfer')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_transfers')} value={num(kpis.count)} icon={Repeat} tone="brand" />
        <KpiCard title={t('units_moved')} value={num(kpis.unitsMoved)} icon={ArrowRightLeft} tone="sky" />
        <KpiCard title={t('completed_transfers')} value={num(kpis.completed)} icon={CheckCircle} tone="emerald" />
        <KpiCard title={t('pending_transfers')} value={num(kpis.pending)} icon={Clock} tone="amber" />
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search') + '...'}
        onClear={() => { setSearch(''); setStatusFilter('') }}
      >
        <select
          className="h-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 px-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t('status')}: All</option>
          <option value="Completed">{t('completed_transfers')}</option>
          <option value="Pending">{t('pending_transfers')}</option>
        </select>
      </FilterBar>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        emptyTitle={t('no_transfers')}
        emptyDescription={t('no_transfers_hint')}
      />

      <TransferDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={addTransfer}
        products={products}
      />
    </div>
  )
}
