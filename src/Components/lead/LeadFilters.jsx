import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'
import SourceIcon, { SOURCES } from './SourceIcon'
import { leadStatuses } from '../../data/leads'
import { useTranslation } from '../../i18n/LanguageContext'

export default function LeadFilters({ leads, filters, setFilters }) {
  const { t } = useTranslation()

  const counts = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1
    return acc
  }, {})

  const clear = () => setFilters({ search: '', source: '', status: '' })

  const pillClass = (active) => `
    inline-flex items-center gap-2 pl-2 pr-3 h-10 rounded-lg text-sm font-medium border transition-colors
    ${active
      ? 'bg-brand-50 text-brand-700 border-brand-500 ring-2 ring-brand-500/20'
      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'}
  `

  return (
    <div className="space-y-4">
      {/* Source filter pills with brand icons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          {t('filter_by_source')}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ ...filters, source: '' })}
            className={pillClass(!filters.source)}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </span>
            <span>{t('all_sources')}</span>
            <span className="text-xs font-bold text-slate-400">{leads.length}</span>
          </button>

          {SOURCES.map((source) => {
            const count = counts[source.key] || 0
            const active = filters.source === source.key
            return (
              <button
                key={source.key}
                onClick={() => setFilters({ ...filters, source: active ? '' : source.key })}
                className={pillClass(active)}
              >
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
                  style={{ backgroundColor: `${source.color}1A`, color: source.color }}
                >
                  <SourceIcon source={source.key} className="w-3.5 h-3.5" />
                </span>
                <span>{t(source.labelKey)}</span>
                <span className="text-xs font-bold text-slate-400">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search + status */}
      <FilterBar
        searchValue={filters.search}
        onSearchChange={(v) => setFilters({ ...filters, search: v })}
        searchPlaceholder={t('search_leads_placeholder')}
        onClear={clear}
      >
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-40"
        >
          <option value="">{t('all_status')}</option>
          {leadStatuses.map((s) => (
            <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
          ))}
        </Select>
      </FilterBar>
    </div>
  )
}