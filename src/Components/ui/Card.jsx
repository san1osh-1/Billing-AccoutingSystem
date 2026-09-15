export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-soft ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, children }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action || children}
    </div>
  )
}