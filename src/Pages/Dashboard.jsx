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

const dateRanges = ['Today', 'This Week', 'This Month', 'This Year', 'Custom']

export default function Dashboard() {
  const [range, setRange] = useState('This Month')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your business performance"
        action={
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  range === r ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r}
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
          title="Sales & Profit"
          subtitle="Nepali fiscal months (Bikram Sambat)"
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500"></span>
                <span className="text-slate-600">Sales</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300"></span>
                <span className="text-slate-600">Profit</span>
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
            title="Low Stock Products"
            subtitle="Items below minimum threshold"
            action={<Button variant="secondary" size="sm">View all</Button>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase">
                  <th className="text-left py-2 font-semibold">Product</th>
                  <th className="text-left py-2 font-semibold">SKU</th>
                  <th className="text-right py-2 font-semibold">Stock</th>
                  <th className="text-right py-2 font-semibold">Min</th>
                  <th className="text-right py-2 font-semibold">Status</th>
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
                      <Badge tone={p.status === 'Critical' ? 'danger' : 'warning'}>{p.status}</Badge>
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
            title="Top Selling Products"
            subtitle="By revenue"
            action={<Button variant="secondary" size="sm">View all</Button>}
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
                      <div className="text-xs text-slate-500">{p.units} units</div>
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
            <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest sales across all payment methods</p>
          </div>
          <Button variant="secondary" size="sm">View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-xs text-slate-600 uppercase">
                <th className="text-left px-5 py-3 font-semibold">Invoice</th>
                <th className="text-left px-5 py-3 font-semibold">Customer</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-left px-5 py-3 font-semibold">Method</th>
                <th className="text-right px-5 py-3 font-semibold">Amount</th>
                <th className="text-right px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-700">{t.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{t.customer}</td>
                  <td className="px-5 py-3 text-slate-500">{t.date}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      {t.method}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(t.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <Badge
                      tone={t.status === 'Paid' ? 'success' : t.status === 'Due' ? 'danger' : 'warning'}
                    >
                      {t.status}
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