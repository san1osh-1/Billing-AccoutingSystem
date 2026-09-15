import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ title, value, change, trend = 'up', icon: Icon, tone = 'brand' }) {
  const toneMap = {
    brand:   { iconBg: 'bg-brand-50',   iconColor: 'text-brand-600' },
    emerald: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    amber:   { iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
    rose:    { iconBg: 'bg-rose-50',    iconColor: 'text-rose-600' },
    sky:     { iconBg: 'bg-sky-50',     iconColor: 'text-sky-600' },
  }
  const t = toneMap[tone]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${t.iconBg} ${t.iconColor} flex items-center justify-center`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  )
}