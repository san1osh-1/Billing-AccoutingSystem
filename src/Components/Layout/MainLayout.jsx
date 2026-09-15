import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { navigation } from '../../data/navigation'
import { useTranslation } from '../../i18n/LanguageContext'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()

  const current = navigation.find((n) => `/${n.key}` === location.pathname)
  const title = current ? t(`nav_${current.key}`) : t('dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'}`}>
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}