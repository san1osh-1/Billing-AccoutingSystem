export default function ReportHeader({ title, subtitle, period }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      {period && <p className="text-xs text-slate-400 mt-2">Period: {period}</p>}
    </div>
  )
}