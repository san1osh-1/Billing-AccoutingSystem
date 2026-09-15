import { Inbox } from 'lucide-react'
import { useTranslation } from '../../i18n/LanguageContext'

export default function EmptyState({ title, description, action }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title || t('nothing_here_yet')}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}