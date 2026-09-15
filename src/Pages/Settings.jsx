import { useState } from 'react'
import { Building2, FileText, CreditCard, Percent } from 'lucide-react'
import PageHeader from '../Components/ui/PageHeader'
import BusinessProfile from '../Components/settings/BusinessProfile'
import InvoiceSettings from '../Components/settings/InvoiceSettings'
import PaymentMethodsSettings from '../Components/settings/PaymentMethodsSettings'

const settingsTabs = [
  { key: 'business', label: 'Business Profile', icon: Building2 },
  { key: 'invoice', label: 'Invoice Settings', icon: FileText },
  { key: 'tax', label: 'PAN / VAT', icon: Percent },
  { key: 'payments', label: 'Payment Methods', icon: CreditCard },
]

export default function Settings() {
  const [tab, setTab] = useState('business')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your business and application preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="bg-white border border-slate-200 rounded-xl p-2 space-y-1">
            {settingsTabs.map((t) => {
              const Icon = t.icon
              const isActive = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {t.label}
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
                <h3 className="text-lg font-semibold text-slate-900">PAN / VAT Configuration</h3>
                <p className="text-sm text-slate-600">Configure your tax registration and rates for Nepal.</p>
                <div className="pt-4">
                  <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
                    <p className="text-sm text-brand-700">
                      ✓ VAT is set to 13% (Nepal standard rate)<br />
                      ✓ PAN registration is configured<br />
                      ✓ Tax invoices will be generated automatically
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