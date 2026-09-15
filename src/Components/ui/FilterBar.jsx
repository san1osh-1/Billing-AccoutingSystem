import { Search, X } from 'lucide-react'
import Input from './Input'
import { useTranslation } from '../../i18n/LanguageContext'

export default function FilterBar({ children, searchValue, onSearchChange, searchPlaceholder, onClear }) {
  const { t } = useTranslation()
  const hasFilters = Boolean(searchValue) || Boolean(Array.isArray(children) ? children.some(Boolean) : children)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder || `${t('search')}...`}
            icon={Search}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {children}
          {hasFilters && onClear && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <X className="w-3.5 h-3.5" />
              {t('clear')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}