import { useState } from 'react'
import {
  ShoppingCart, Wallet, TrendingUp,
  AlertTriangle, ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import Card, { CardHeader } from '../Components/ui/Card'
import KpiCard from '../Components/ui/KpiCard'
import Badge from '../Components/ui/Badge'
import Button from '../Components/ui/Button'
import PageHeader from '../Components/ui/PageHeader'
import { initialSales } from '../data/sales'
import { initialPurchases } from '../data/purchases'
import { initialExpenses } from '../data/expenses'
import { initialProducts } from '../data/products'
import { useTranslation } from '../i18n/LanguageContext'
import { adToBsParts } from '../utils/bs'

const dateRanges = [
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'this_year', label: 'This Year' },
  { key: 'custom', label: 'Custom' },
]

const statusKeys = {
  Critical: 'status_critical',
  Low: 'status_low',
  'Out of Stock': 'status_out_of_stock',
  Paid: 'status_paid',
  Due: 'status_due',
  Partial: 'status_partial',
}

const CHART_YEAR = new Date().getFullYear()
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_KEYS = MONTH_NAMES.map((_, i) =>
  `${CHART_YEAR}-${String(i + 1).padStart(2, '0')}`
)
const BS_MONTH_NAMES = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
]
const BS_MONTH_KEYS = BS_MONTH_NAMES.map((_, i) => String(i + 1).padStart(2, '0'))

const DAY_MS = 86400000

function periodBounds(range, now) {
  if (range === 'custom') return [null, null]
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let start
  if (range === 'today') start = today
  else if (range === 'this_week') start = new Date(today.getTime() - 6 * DAY_MS)
  else if (range === 'this_month') start = new Date(now.getFullYear(), now.getMonth(), 1)
  else start = new Date(now.getFullYear(), 0, 1)
  return [start, today]
}

function prevBounds(range, now) {
  const [start, end] = periodBounds(range, now)
  if (!start || !end) return [null, null]
  const length = Math.round((end - start) / DAY_MS) + 1
  return [new Date(start.getTime() - length * DAY_MS), new Date(start.getTime() - DAY_MS)]
}

const inRange = (dateStr, [start, end]) => {
  if (!start || !end) return true
  const ts = new Date(`${dateStr}T00:00:00`).getTime()
  return ts >= start.getTime() && ts <= end.getTime()
}

const sum = (arr, getter) => arr.reduce((acc, x) => acc + (getter(x) || 0), 0)

export default function Dashboard() {
  const { t, num, formatCurrency, formatDate, dateSys } = useTranslation()
  const [range, setRange] = useState('this_month')
  const now = new Date()

  const cur = periodBounds(range, now)
  const prev = prevBounds(range, now)

  const curSales = initialSales.filter((x) => inRange(x.date, cur))
  const prevSales = initialSales.filter((x) => inRange(x.date, prev))
  const curPurchases = initialPurchases.filter((x) => inRange(x.date, cur))
  const prevPurchases = initialPurchases.filter((x) => inRange(x.date, prev))
  const curExpenses = initialExpenses.filter((x) => inRange(x.date, cur))
  const prevExpenses = initialExpenses.filter((x) => inRange(x.date, prev))

  const curSalesTotal = sum(curSales, (x) => x.grandTotal)
  const prevSalesTotal = sum(prevSales, (x) => x.grandTotal)
  const curPurchasesTotal = sum(curPurchases, (x) => x.grandTotal)
  const prevPurchasesTotal = sum(prevPurchases, (x) => x.grandTotal)
  const curExpensesTotal = sum(curExpenses, (x) => x.amount)
  const prevExpensesTotal = sum(prevExpenses, (x) => x.amount)

  const buildKpi = (curV, prevV, title, tone, icon) => {
    const change = prevV ? Math.round(((curV - prevV) / prevV) * 1000) / 10 : undefined
    return {
      title,
      value: curV,
      change: change === undefined ? undefined : Math.abs(change),
      trend: change !== undefined && change < 0 ? 'down' : 'up',
      tone,
      icon,
    }
  }

  const kpis = [
    buildKpi(curSalesTotal, prevSalesTotal, t('total_sales'), 'brand', ShoppingCart),
    buildKpi(curPurchasesTotal, prevPurchasesTotal, t('total_purchases'), 'sky', ArrowDownRight),
    buildKpi(curExpensesTotal, prevExpensesTotal, t('total_expenses'), 'amber', Wallet),
    buildKpi(
      curSalesTotal - curPurchasesTotal - curExpensesTotal,
      prevSalesTotal - prevPurchasesTotal - prevExpensesTotal,
      t('net_profit'),
      'emerald',
      TrendingUp
    ),
  ]

  const buildChart = (names, keys, toKey) =>
    names.map((name, i) => {
      const key = keys[i]
      const sales = sum(initialSales.filter((x) => toKey(x) === key), (x) => x.grandTotal)
      const purchases = sum(initialPurchases.filter((x) => toKey(x) === key), (x) => x.grandTotal)
      const expenses = sum(initialExpenses.filter((x) => toKey(x) === key), (x) => x.amount)
      return { name, sales, profit: sales - purchases - expenses }
    })

  const bsToday = adToBsParts(new Date().toISOString().slice(0, 10))
  const bsKeyOf = (rec) => {
    const p = adToBsParts(rec.date)
    return p ? `${p.year}-${String(p.month).padStart(2, '0')}` : ''
  }
  const currentBsYear = bsToday ? `${bsToday.year}-` : ''
  const bsKeys = BS_MONTH_KEYS.map((k) => `${currentBsYear}${k}`)

  const chart = dateSys === 'bs' && bsToday
    ? buildChart(BS_MONTH_NAMES, bsKeys, bsKeyOf)
    : buildChart(MONTH_NAMES, MONTH_KEYS, (x) => x.date.slice(0, 7))

  const lowStock = initialProducts
    .filter((p) => p.stock <= p.minStock)
    .sort((a, b) => a.stock / a.minStock - b.stock / b.minStock)
    .slice(0, 5)
    .map((p) => ({
      ...p,
      status: p.stock === 0 ? 'Out of Stock' : p.stock < p.minStock * 0.5 ? 'Critical' : 'Low',
    }))

  const perProduct = {}
  initialSales.forEach((s) =>
    (s.items || []).forEach((it) => {
      const rec = perProduct[it.name] || (perProduct[it.name] = { units: 0, revenue: 0 })
      rec.units += it.qty
      rec.revenue += it.qty * it.price
    })
  )
  const topSelling = Object.entries(perProduct)
    .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const recentTransactions = curSales
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard')}
        subtitle={t('dashboard_subtitle')}
        action={
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
            {dateRanges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  range === r.key ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t(r.key)}
              </button>
            ))}
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.title}
            title={k.title}
            value={formatCurrency(k.value)}
            change={k.change !== undefined ? num(k.change) : undefined}
            trend={k.trend}
            tone={k.tone}
            icon={k.icon}
          />
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader
          title={t('sales_profit')}
          subtitle={t('fiscal_months_note')}
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500"></span>
                <span className="text-slate-600">{t('sales_legend')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300"></span>
                <span className="text-slate-600">{t('profit_legend')}</span>
              </span>
            </div>
          }
        />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} minTickGap={14} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => num(`Rs.${(v / 1000).toFixed(0)}k`)} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ display: 'none' }} />
              <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} fill="url(#salesGrad)" />
              <Area type="monotone" dataKey="profit" stroke="#6ee7b7" strokeWidth={2} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two-col */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Low Stock */}
        <Card>
          <CardHeader
            title={t('low_stock_products')}
            subtitle={t('items_below_threshold')}
            action={<Button variant="secondary" size="sm">{t('view_all')}</Button>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase">
                  <th className="text-left py-2 font-semibold">{t('product')}</th>
                  <th className="text-left py-2 font-semibold">{t('sku')}</th>
                  <th className="text-right py-2 font-semibold">{t('stock')}</th>
                  <th className="text-right py-2 font-semibold">{t('min')}</th>
                  <th className="text-right py-2 font-semibold">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStock.map((p) => (
                  <tr key={p.id} className="text-slate-700">
                    <td className="py-2.5 flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${p.status === 'Critical' || p.status === 'Out of Stock' ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span className="font-medium text-slate-900 truncate">{p.name}</span>
                    </td>
                    <td className="py-2.5 text-slate-500 font-mono text-xs">{p.sku}</td>
                    <td className="py-2.5 text-right font-semibold">{num(p.stock)}</td>
                    <td className="py-2.5 text-right text-slate-500">{num(p.minStock)}</td>
                    <td className="py-2.5 text-right">
                      <Badge tone={p.status === 'Out of Stock' ? 'danger' : p.status === 'Critical' ? 'danger' : 'warning'}>{t(statusKeys[p.status] || p.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Selling */}
        <Card>
          <CardHeader
            title={t('top_selling_products')}
            subtitle={t('by_revenue')}
            action={<Button variant="secondary" size="sm">{t('view_all')}</Button>}
          />
          <div className="space-y-3">
            {topSelling.map((p, i) => {
              const max = Math.max(...topSelling.map((x) => x.revenue))
              const pct = (p.revenue / max) * 100
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-semibold text-slate-400 w-5">{num(i + 1)}</span>
                      <span className="text-sm font-medium text-slate-900 truncate">{p.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-sm font-semibold text-slate-900">{formatCurrency(p.revenue)}</div>
                      <div className="text-xs text-slate-500">{num(p.units)} {t('units_label')}</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card padding={false}>
        <div className="p-5 flex items-start justify-between border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t('recent_transactions')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('latest_sales')}</p>
          </div>
          <Button variant="secondary" size="sm">{t('view_all')}</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-xs text-slate-600 uppercase">
                <th className="text-left px-5 py-3 font-semibold">{t('invoice')}</th>
                <th className="text-left px-5 py-3 font-semibold">{t('customer')}</th>
                <th className="text-left px-5 py-3 font-semibold">{t('date')}</th>
                <th className="text-left px-5 py-3 font-semibold">{t('method')}</th>
                <th className="text-right px-5 py-3 font-semibold">{t('amount')}</th>
                <th className="text-right px-5 py-3 font-semibold">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-700">{tx.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{tx.customerName}</td>
                  <td className="px-5 py-3 text-slate-500">{formatDate(tx.date)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(tx.grandTotal)}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge
                      tone={tx.status === 'Paid' ? 'success' : tx.status === 'Due' ? 'danger' : 'warning'}
                    >
                      {t(statusKeys[tx.status] || tx.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}