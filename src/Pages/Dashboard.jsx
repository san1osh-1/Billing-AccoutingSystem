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
import {
  kpis, salesProfitChart, lowStockProducts, topSelling, recentTransactions,
} from '../data/dashboard'
import { formatCurrency } from '../utils/format'
import { useTranslation } from '../i18n/LanguageContext'

const dateRanges = [
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'this_year', label: 'This Year' },
  { key: 'custom', label: 'Custom' },
]

const kpiTitleMap = {
  'Total Sales': 'total_sales',
  'Total Purchases': 'total_purchases',
  'Total Expenses': 'total_expenses',
  'Net Profit': 'net_profit',
}

const statusKeys = {
  Critical: 'status_critical',
  Low: 'status_low',
  Paid: 'status_paid',
  Due: 'status_due',
  Partial: 'status_partial',
}

export default function Dashboard() {
  const { t } = useTranslation()
  const [range, setRange] = useState('this_month')

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
            title={t(kpiTitleMap[k.title] || k.title)}
            value={k.value}
            change={k.change}
            trend={k.trend}
            tone={k.tone}
            icon={k.title.includes('Sales') ? ShoppingCart :
                  k.title.includes('Purchases') ? ArrowDownRight :
                  k.title.includes('Expenses') ? Wallet :
                  TrendingUp}
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
            <AreaChart data={salesProfitChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
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
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="text-slate-700">
                    <td className="py-2.5 flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${p.status === 'Critical' ? 'text-rose-500' : 'text-amber-500'}`} />
                      <span className="font-medium text-slate-900 truncate">{p.name}</span>
                    </td>
                    <td className="py-2.5 text-slate-500 font-mono text-xs">{p.sku}</td>
                    <td className="py-2.5 text-right font-semibold">{p.current}</td>
                    <td className="py-2.5 text-right text-slate-500">{p.minimum}</td>
                    <td className="py-2.5 text-right">
                      <Badge tone={p.status === 'Critical' ? 'danger' : 'warning'}>{t(statusKeys[p.status] || p.status)}</Badge>
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
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-semibold text-slate-400 w-5">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-900 truncate">{p.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-sm font-semibold text-slate-900">{formatCurrency(p.revenue)}</div>
                      <div className="text-xs text-slate-500">{p.units} {t('units_label')}</div>
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
                  <td className="px-5 py-3 font-medium text-slate-900">{tx.customer}</td>
                  <td className="px-5 py-3 text-slate-500">{tx.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {tx.method}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(tx.amount)}</td>
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