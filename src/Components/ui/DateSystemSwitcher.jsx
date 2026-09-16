import { CalendarDays } from 'lucide-react'
import { useTranslation } from '../../i18n/LanguageContext'

const SYSTEMS = [
  { code: 'ad', label: 'AD' },
  { code: 'bs', label: 'BS' },
]

export default function DateSystemSwitcher() {
  const { dateSys, setDateSys, t } = useTranslation()

  return (
    <div
      className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5"
      role="group"
      aria-label={t('date_system')}
    >
      {SYSTEMS.map((s) => (
        <button
          key={s.code}
          onClick={() => setDateSys(s.code)}
          title={s.code === 'ad' ? t('date_system_ad') : t('date_system_bs')}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition ${
            dateSys === s.code
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {dateSys === s.code && <CalendarDays className="w-3.5 h-3.5" />}
          {s.label}
        </button>
      ))}
    </div>
  )
}