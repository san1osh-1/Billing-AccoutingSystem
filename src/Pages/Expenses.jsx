import { useState } from 'react'
import { Plus, Wallet, Calendar, PieChart } from 'lucide-react'
import useExpenses from '../hooks/useExpenses'
import { expenseCategories } from '../data/expenses'
import { formatCurrency, formatDate } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import Card from '../Components/ui/Card'
import DataTable from '../Components/ui/DataTable'
import FilterBar from '../Components/ui/FilterBar'
import Select from '../Components/ui/Select'
import AddExpenseDrawer from '../Components/expenses/AddExpenseDrawer'

export default function Expenses() {
  const { expenses, all, loading, filters, setFilters, addExpense, kpis } = useExpenses()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Top 5 categories for breakdown
  const topCategories = Object.entries(kpis.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxCat = topCategories[0]?.[1] || 1

  const columns = [
    { key: 'id', label: 'Expense #', render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'category', label: 'Category', render: (r) => <Badge tone="brand">{r.category}</Badge> },
    { key: 'description', label: 'Description', render: (r) => <span className="text-slate-700 max-w-xs truncate block">{r.description}</span> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (r) => <span className="font-semibold text-slate-900">{formatCurrency(r.amount)}</span>,
    },
    { key: 'method', label: 'Method', render: (r) => <Badge tone="info">{r.method.toUpperCase()}</Badge> },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge tone={r.status === 'Paid' ? 'success' : 'warning'} dot>{r.status}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Track business expenses and operational costs"
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>Add Expense</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Expenses" value={formatCurrency(kpis.total)} icon={Wallet} tone="brand" />
        <KpiCard title="This Month" value={formatCurrency(kpis.thisMonth)} icon={Calendar} tone="amber" />
        <KpiCard title="Categories" value={String(Object.keys(kpis.byCategory).length)} icon={PieChart} tone="sky" />
        <KpiCard title="Records" value={String(all.length)} icon={Wallet} tone="emerald" />
      </div>

      {/* Category breakdown */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Top Expense Categories</h3>
        <div className="space-y-3">
          {topCategories.map(([cat, amt]) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{cat}</span>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(amt)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style={{ width: `${(amt / maxCat) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <FilterBar
        searchValue={filters.search}
        onSearchChange={(v) => setFilters({ ...filters, search: v })}
        searchPlaceholder="Search expenses..."
        onClear={() => setFilters({ search: '', category: '', method: '' })}
      >
        <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-40">
          <option value="">All Categories</option>
          {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={filters.method} onChange={(e) => setFilters({ ...filters, method: e.target.value })} className="w-40">
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="qr">QR</option>
          <option value="esewa">eSewa</option>
          <option value="khalti">Khalti</option>
        </Select>
      </FilterBar>

      <DataTable columns={columns} data={expenses} loading={loading} />

      <AddExpenseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSubmit={addExpense} />
    </div>
  )
}