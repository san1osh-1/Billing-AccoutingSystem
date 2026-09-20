import { useState, useMemo } from 'react'
import { ShoppingCart, Receipt, Wallet, FileText } from 'lucide-react'
import useSales from '../hooks/useSales'
import PageHeader from '../Components/ui/PageHeader'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import SalesInvoiceFilters from '../Components/sales/SalesInvoiceFilters'
import InvoiceModal from '../Components/pos/InvoiceModal'
import { useTranslation } from '../i18n/LanguageContext'

const statusTone = (s) =>
  s === 'Paid' ? 'success' : s === 'Partial' ? 'warning' : s === 'Due' ? 'danger' : 'neutral'

const statusKey = { Paid: 'status_paid', Partial: 'status_partial', Due: 'status_due' }

export default function SalesInvoices() {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const { sales, loading, kpis } = useSales()
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [viewing, setViewing] = useState(null)

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return sales.filter((s) => {
      const matchSearch = !q ||
        s.id.toLowerCase().includes(q) ||
        (s.customerName || '').toLowerCase().includes(q)
      const matchStatus = !filters.status || s.status === filters.status
      return matchSearch && matchStatus
    })
  }, [sales, filters])

  const columns = [
    {
      key: 'id', label: t('invoice_no'),
      render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span>,
    },
    {
      key: 'customerName', label: t('customer'),
      render: (r) => <span className="font-medium text-slate-900">{r.customerName}</span>,
    },
    { key: 'date', label: t('date'), render: (r) => formatDate(r.date) },
    {
      key: 'items', label: t('items'), align: 'right', sortable: false,
      render: (r) => num((r.items || []).length),
    },
    {
      key: 'grandTotal', label: t('total'), align: 'right',
      render: (r) => <span className="font-semibold">{formatCurrency(r.grandTotal)}</span>,
    },
    {
      key: 'paymentMethod', label: t('payment_method'),
      render: (r) => t(`method_${r.paymentMethod}`),
    },
    {
      key: 'status', label: t('status'),
      render: (r) => <Badge tone={statusTone(r.status)} dot>{t(statusKey[r.status] || r.status)}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav_sales_invoices')} subtitle={t('sales_invoices_page_subtitle')} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t('total_sales_amount')} value={formatCurrency(kpis.total)} icon={ShoppingCart} tone="brand" />
        <KpiCard title={t('paid')} value={formatCurrency(kpis.paid)} icon={Receipt} tone="emerald" />
        <KpiCard title={t('due')} value={formatCurrency(kpis.due)} icon={Wallet} tone="rose" />
        <KpiCard title={t('invoices')} value={num(kpis.count)} icon={FileText} tone="sky" />
      </div>

      <SalesInvoiceFilters filters={filters} setFilters={setFilters} />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        onRowClick={setViewing}
        emptyTitle={t('no_invoices')}
        emptyDescription={t('no_invoices_hint')}
      />

      <InvoiceModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        sale={viewing}
        celebrate={false}
      />
    </div>
  )
}
