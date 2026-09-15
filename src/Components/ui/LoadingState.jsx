export default function LoadingState({ rows = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/5 animate-pulse" />
        </div>
      ))}
    </div>
  )
}