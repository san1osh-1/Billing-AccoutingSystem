import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Users, Truck, Package,
  Warehouse, ArrowLeftRight, CreditCard, Receipt,
  BookOpen, FileBarChart, Shield, Settings, ChevronLeft, X,
} from 'lucide-react'
import { navigation } from '../../data/navigation'
import { useTranslation } from '../../i18n/LanguageContext'

const iconMap = {
  dashboard: LayoutDashboard, sales: ShoppingCart, customers: Users,
  purchases: Truck, suppliers: Truck, products: Package,
  inventory: Warehouse, 'stock-adjustments': ArrowLeftRight,
  payments: CreditCard, expenses: Receipt, accounting: BookOpen,
  reports: FileBarChart, users: Shield, settings: Settings,
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200
          transition-all duration-200 ease-in-out
          ${collapsed ? 'lg:w-20' : 'lg:w-60'}
          ${mobileOpen ? 'translate-x-0 w-60' : '-translate-x-full w-60'}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
              ह
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate">HisaabKit</div>
                <div className="text-[10px] text-slate-500 truncate">{t('nepal_business_suite')}</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          <ul className="space-y-0.5">
            {navigation.map((item) => {
              const Icon = iconMap[item.key] || LayoutDashboard
              const label = t(`nav_${item.key}`)
              const isActive = location.pathname === `/${item.key}` ||
                (item.key === 'dashboard' && location.pathname === '/')

              return (
                <li key={item.key}>
                  <NavLink
                    to={`/${item.key}`}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors
                      ${isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                    title={collapsed && !mobileOpen ? label : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    {(!collapsed || mobileOpen) && <span className="truncate">{label}</span>}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200">
          <div className={`flex items-center gap-3 p-2 rounded-lg ${collapsed && !mobileOpen ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
              RS
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900 truncate">Ram Shrestha</div>
                <div className="text-xs text-slate-500 truncate">{t('owner')}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}