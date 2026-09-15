import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import LoadingState from './LoadingState'
import { useTranslation } from '../../i18n/LanguageContext'

export default function DataTable({
  columns, data, keyField = 'id', onRowClick,
  sortable = true, pageSize: initialPageSize = 10,
  loading = false, emptyTitle, emptyDescription,
  emptyAction,
}) {
  const { t } = useTranslation()
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const handleSort = (key) => {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data || []
    const col = columns.find((c) => c.key === sortKey)
    const accessor = col?.sortAccessor || ((row) => row[sortKey])
    return [...data].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
  }, [data, sortKey, sortDir, columns])

  const paginated = useMemo(() => {
    const start = (page - 1) * initialPageSize
    return sorted.slice(start, start + initialPageSize)
  }, [sorted, page, initialPageSize])

  if (loading) return <LoadingState rows={6} />

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl">
        <EmptyState
          title={emptyTitle || t('no_records_found')}
          description={emptyDescription || t('adjust_filters_hint')}
          action={emptyAction}
        />
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              {columns.map((col) => {
                const isSortable = sortable && col.sortable !== false
                const isSorted = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    } ${isSortable ? 'cursor-pointer select-none hover:bg-slate-100' : ''} ${col.className || ''}`}
                    onClick={() => isSortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {isSortable && (
                        <span className="text-slate-400">
                          {isSorted ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((row) => (
              <tr
                key={row[keyField]}
                onClick={() => onRowClick?.(row)}
                className={`text-slate-700 ${onRowClick ? 'hover:bg-slate-50 cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > initialPageSize && (
        <Pagination page={page} pageSize={initialPageSize} total={data.length} onChange={setPage} />
      )}
    </div>
  )
}