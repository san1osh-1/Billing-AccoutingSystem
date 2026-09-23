import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import ForcePasswordChangeModal from '../auth/ForcePasswordChangeModal'
import { getNavigationTitle } from '../../data/navigation'
import { useTranslation } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const { mustChangePassword, user } = useAuth()

  const title = getNavigationTitle(location.pathname, t)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <ForcePasswordChangeModal
        open={Boolean(mustChangePassword)}
        email={user?.email}
      />
    </div>
  )
}