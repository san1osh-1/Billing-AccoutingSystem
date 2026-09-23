import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Target,
  ShoppingCart,
  Store,
  Receipt,
  RotateCcw,
  ArrowDownLeft,
  Truck,
  Building2,
  FileSpreadsheet,
  RotateCw,
  ArrowUpRight,
  Boxes,
  Package,
  FolderTree,
  Scale,
  ArrowLeftRight,
  SlidersHorizontal,
  AlertTriangle,
  BookOpen,
  ListTree,
  FileCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  PieChart,
  Activity,
  Calculator,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Settings2,
  X,
} from 'lucide-react'
import { navigation } from '../../data/navigation'
import { useTranslation } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'

const iconMap = {
  LayoutDashboard,
  Users,
  Target,
  ShoppingCart,
  Store,
  Receipt,
  RotateCcw,
  ArrowDownLeft,
  Truck,
  Building2,
  FileSpreadsheet,
  RotateCw,
  ArrowUpRight,
  Boxes,
  Package,
  FolderTree,
  Scale,
  ArrowLeftRight,
  SlidersHorizontal,
  AlertTriangle,
  BookOpen,
  ListTree,
  FileCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  PieChart,
  Activity,
  Calculator,
  Settings2,
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, business, logout, hasPermission } = useAuth()
  const [activeFlyout, setActiveFlyout] = useState(null)
  const flyoutTimerRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Track expanded state for each module
  const [openModules, setOpenModules] = useState(() => {
    const state = {}
    navigation.forEach((entry) => {
      if (entry.type === 'module') {
        const hasActive = entry.items?.some((i) => location.pathname === i.path)
        // Default to active module open, or top modules open initially
        state[entry.key] = hasActive ?? false
      }
    })
    return state
  })

  // Auto-expand module when navigating to one of its subitems
  useEffect(() => {
    navigation.forEach((entry) => {
      if (entry.type === 'module') {
        const hasActive = entry.items?.some(
          (i) => location.pathname === i.path || (i.path !== '/' && location.pathname.startsWith(i.path))
        )
        if (hasActive) {
          setOpenModules((prev) => ({ ...prev, [entry.key]: true }))
        }
      }
    })
  }, [location.pathname])

  const toggleModule = (moduleKey) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }))
  }

  const isItemActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname === path
  }

  const isModuleActive = (entry) => {
    if (entry.type !== 'module') return false
    return entry.items?.some((item) => isItemActive(item.path))
  }

  const handleFlyoutEnter = (key) => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current)
    setActiveFlyout(key)
  }

  const handleFlyoutLeave = () => {
    flyoutTimerRef.current = setTimeout(() => {
      setActiveFlyout(null)
    }, 200)
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200
          transition-all duration-200 ease-in-out select-none
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-base shadow-xs shadow-brand-500/20">
              ह
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-base leading-tight tracking-tight truncate">
                  HisaabKit
                </div>
                <div className="text-[10px] font-medium text-slate-500 truncate">
                  {t('nepal_business_suite')}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Toggle sidebar"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Current Business Card */}
        <div className="px-2.5 pt-2.5 pb-2 border-b border-slate-100 shrink-0">
          {(!collapsed || mobileOpen) ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center gap-2 group cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-xs leading-tight truncate">
                  {business?.name || user?.businessName || 'My Business'}
                </div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5 leading-none">
                  Current Business
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title={`${business?.name || user?.businessName || 'Current Business'} (Current Business)`}
            >
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            </div>
          )}
        </div>

        {/* Navigation Body */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin py-3 px-2.5 space-y-1">
          {navigation.map((entry) => {
            // ── Standalone item (Dashboard, Users, Settings) ──
            if (entry.type === 'standalone') {
              if (entry.key !== 'dashboard' && !hasPermission(entry.key)) return null

              const Icon = iconMap[entry.icon] || LayoutDashboard
              const label = t(entry.labelKey) || entry.label
              const active = isItemActive(entry.path)

              return (
                <div key={entry.key} className="relative">
                  <NavLink
                    to={entry.path}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${
                        active
                          ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                      ${collapsed && !mobileOpen ? 'justify-center px-2' : ''}
                    `}
                    title={collapsed && !mobileOpen ? label : ''}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        active
                          ? 'text-brand-600'
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate">{label}</span>
                    )}
                  </NavLink>
                </div>
              )
            }

            // ── Expandable Module Group (CRM, Sales & POS, Purchase, Inventory, Accounting, Reports) ──
            const allowedItems = (entry.items || []).filter((item) => hasPermission(item.key))
            if (allowedItems.length === 0) return null

            const ModuleIcon = iconMap[entry.icon] || Boxes
            const moduleLabel = t(entry.labelKey) || entry.label
            const isOpen = openModules[entry.key]
            const hasActiveChild = allowedItems.some((item) => isItemActive(item.path))

            return (
              <div
                key={entry.key}
                className="relative"
                onMouseEnter={() => collapsed && !mobileOpen && handleFlyoutEnter(entry.key)}
                onMouseLeave={() => collapsed && !mobileOpen && handleFlyoutLeave()}
              >
                {/* Module Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (collapsed && !mobileOpen) {
                      setCollapsed(false)
                      setOpenModules((prev) => ({ ...prev, [entry.key]: true }))
                    } else {
                      toggleModule(entry.key)
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150 group
                    ${
                      hasActiveChild
                        ? 'text-brand-700 bg-brand-50/60 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${collapsed && !mobileOpen ? 'justify-center px-2' : ''}
                  `}
                  title={collapsed && !mobileOpen ? moduleLabel : ''}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ModuleIcon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        hasActiveChild
                          ? 'text-brand-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate text-left">{moduleLabel}</span>
                    )}
                  </div>

                  {(!collapsed || mobileOpen) && (
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-600' : 'group-hover:text-slate-600'
                      }`}
                    />
                  )}
                </button>

                {/* Collapsed Mode Flyout Menu (when hovering/clicking in collapsed mode) */}
                {collapsed && !mobileOpen && activeFlyout === entry.key && (
                  <div
                    className="absolute left-full top-0 ml-2.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 px-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseEnter={() => handleFlyoutEnter(entry.key)}
                    onMouseLeave={handleFlyoutLeave}
                  >
                    <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      {moduleLabel}
                    </div>
                    <div className="space-y-0.5">
                      {allowedItems.map((subItem) => {
                        const SubIcon = iconMap[subItem.icon] || ModuleIcon
                        const subLabel = t(subItem.labelKey) || subItem.label
                        const active = isItemActive(subItem.path)

                        return (
                          <NavLink
                            key={subItem.key}
                            to={subItem.path}
                            onClick={() => {
                              setActiveFlyout(null)
                              setMobileOpen(false)
                            }}
                            className={`
                              flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                              transition-colors
                              ${
                                active
                                  ? 'bg-brand-50 text-brand-700 font-semibold'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }
                            `}
                          >
                            <SubIcon
                              className={`w-4 h-4 shrink-0 ${
                                active ? 'text-brand-600' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{subLabel}</span>
                          </NavLink>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Expanded Submenu List */}
                {(!collapsed || mobileOpen) && isOpen && (
                  <div className="mt-1 mb-1 pl-3 ml-4 border-l border-slate-200 space-y-0.5 animate-in fade-in duration-150">
                    {allowedItems.map((subItem) => {
                      const SubIcon = iconMap[subItem.icon] || ModuleIcon
                      const subLabel = t(subItem.labelKey) || subItem.label
                      const active = isItemActive(subItem.path)

                      return (
                        <NavLink
                          key={subItem.key}
                          to={subItem.path}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium
                            transition-all duration-150
                            ${
                              active
                                ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                        >
                          <SubIcon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              active
                                ? 'text-brand-600'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span className="truncate">{subLabel}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer (Profile + Logout) */}
        <div className="p-3 border-t border-slate-200 shrink-0 bg-slate-50/50">
          <div
            className={`flex items-center gap-3 p-1.5 rounded-lg ${
              collapsed && !mobileOpen ? 'justify-center flex-col p-1 gap-2' : ''
            }`}
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shadow-2xs uppercase">
              {user?.name ? user.name.slice(0, 2) : 'RS'}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 leading-tight truncate">
                  {user?.name || 'Ram Shrestha'}
                </div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight truncate">
                  {user?.email || t('owner')}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Sign out"
              className={`shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                collapsed && !mobileOpen ? '' : 'ml-auto'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}