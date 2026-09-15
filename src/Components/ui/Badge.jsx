const tones = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger:  'bg-rose-50 text-rose-700 ring-rose-600/20',
  info:    'bg-sky-50 text-sky-700 ring-sky-600/20',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-600/20',
  brand:   'bg-brand-50 text-brand-700 ring-brand-600/20',
}

export default function Badge({ children, tone = 'neutral', dot, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset
        ${tones[tone]} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${tones[tone].split(' ')[1].replace('text-', 'bg-')}`} />}
      {children}
    </span>
  )
}