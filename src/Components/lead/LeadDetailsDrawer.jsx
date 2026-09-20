import { Phone, CalendarDays, Banknote, PackageSearch, StickyNote } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import SourceIcon, { SOURCES } from './SourceIcon'
import { leadStatuses } from '../../data/leads'
import { useTranslation } from '../../i18n/LanguageContext'

export default function LeadDetailsDrawer({ open, onClose, lead }) {
  const { t, formatCurrency, formatDate } = useTranslation()
  if (!lead) return null
  const l = lead
  const source = SOURCES.find((s) => s.key === l.source) || SOURCES[0]
  const status = leadStatuses.find((s) => s.value === l.status) || leadStatuses[0]

  const chipClass = 'flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600'

  return (
    <Drawer open={open} onClose={onClose} title={t('lead_details')} size="md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
            {l.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">{l.name}</h3>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Badge tone={status.tone} dot>{t(status.labelKey)}</Badge>
              <span className="text-xs text-slate-400">{t('since')} {formatDate(l.date)}</span>
            </div>
          </div>
        </div>

        {/* Source */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('source')}</h4>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-md"
                style={{ backgroundColor: `${source.color}1A`, color: source.color }}
              >
                <SourceIcon source={l.source} className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm font-medium text-slate-900">{t(source.labelKey)}</div>
                {l.accountName && (
                  <div className="text-xs text-slate-500">{l.accountName}</div>
                )}
              </div>
            </div>
            <SourceIcon source={l.source} className="w-6 h-6" />
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={chipClass}>
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{l.phone || '—'}</span>
          </div>
          <div className={chipClass}>
            <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{formatDate(l.date)}</span>
          </div>
        </div>

        {/* Expected value */}
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
          <div className="flex items-center gap-2 text-xs font-medium text-brand-700 mb-1">
            <Banknote className="w-3.5 h-3.5" />
            {t('expected_value')}
          </div>
          <div className="text-xl font-bold text-brand-800">{formatCurrency(l.expectedValue)}</div>
        </div>

        {/* Interest */}
        {l.interest && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PackageSearch className="w-3.5 h-3.5" />
              {t('interest')}
            </h4>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-100 px-3 py-2.5">{l.interest}</p>
          </div>
        )}

        {/* Notes */}
        {l.notes && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5" />
              {t('notes')}
            </h4>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl border border-slate-100 px-3 py-2.5">{l.notes}</p>
          </div>
        )}
      </div>
    </Drawer>
  )
}