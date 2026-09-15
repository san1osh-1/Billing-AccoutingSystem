import { useState } from 'react'
import { Building2, FileText, CreditCard, Percent } from 'lucide-react'
import PageHeader from '../Components/ui/PageHeader'
import BusinessProfile from '../Components/settings/BusinessProfile'
import InvoiceSettings from '../Components/settings/InvoiceSettings'
import PaymentMethodsSettings from '../Components/settings/PaymentMethodsSettings'
import { useTranslation } from '../i18n/LanguageContext'

const settingsTabs = [
  { key: 'business', labelKey: 'business_profile', icon: Building2 },
  { key: 'invoice', labelKey: 'invoice_settings', icon: FileText },
  { key: 'tax', labelKey: 'pan_vat', icon: Percent },
  { key: 'payments', labelKey: 'payment_methods', icon: CreditCard },
]

export default function Settings() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('business')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_settings')}
        subtitle={t('settings_subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white border border-slate-200 rounded-xl p-2 space-y-1">
            {settingsTabs.map((tabItem) => {
              const Icon = tabItem.icon
              const isActive = tab === tabItem.key
              return (
                <button
                  key={tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {t(tabItem.labelKey)}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            {tab === 'business' && <BusinessProfile />}
            {tab === 'invoice' && <InvoiceSettings />}
            {tab === 'tax' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">{t('pan_vat_config_title')}</h3>
                <p className="text-sm text-slate-600">{t('pan_vat_config_desc')}</p>
                <div className="pt-4">
                  <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
                    <p className="text-sm text-brand-700">
                      ✓ {t('vat_standard_rate')}<br />
                      ✓ {t('pan_configured')}<br />
                      ✓ {t('tax_invoice_note')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {tab === 'payments' && <PaymentMethodsSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}