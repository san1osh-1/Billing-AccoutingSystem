export default function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          className={`
            w-full h-10 rounded-lg border bg-white text-sm text-slate-900
            placeholder:text-slate-400 transition
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            ${Icon ? 'pl-10 pr-3' : 'px-3'}
            ${error ? 'border-rose-300' : 'border-slate-200'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}