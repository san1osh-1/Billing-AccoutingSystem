import { Search, Bell, Menu, Settings, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import DateSystemSwitcher from '../ui/DateSystemSwitcher'
import { useTranslation } from '../../i18n/LanguageContext'

export default function Header({ onMenuClick, title }) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600"
            aria-label={t('open_menu')}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xs mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder={t('search_placeholder')}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link
            to="/sales"
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors whitespace-nowrap"
            aria-label={t('quick_pos')}
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">{t('quick_pos')}</span>
          </Link>

          <DateSystemSwitcher />
          <LanguageSwitcher />

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600" aria-label={t('notifications')}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Settings Icon — replaces user name display */}
          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-brand-600 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}