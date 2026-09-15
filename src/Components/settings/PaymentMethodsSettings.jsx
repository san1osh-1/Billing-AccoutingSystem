import { useState } from 'react'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function PaymentMethodsSettings() {
  const { t } = useTranslation()

  const methods = [
    { key: 'cash', label: t('method_cash'), icon: '💵' },
    { key: 'bank', label: t('bank_transfer'), icon: '🏦' },
    { key: 'qr', label: t('qr_code'), icon: '📱' },
    { key: 'esewa', label: t('method_esewa'), icon: '🟣' },
    { key: 'khalti', label: t('method_khalti'), icon: '🟪' },
    { key: 'credit', label: t('method_credit'), icon: '📝' },
  ]
  const [enabled, setEnabled] = useState(['cash', 'bank', 'qr', 'esewa', 'khalti', 'credit'])

  const toggle = (key) => {
    setEnabled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSave = () => {
    alert(t('payment_methods_saved'))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{t('enable_disable_payment_methods')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {methods.map((m) => {
          const isOn = enabled.includes(m.key)
          return (
            <label key={m.key} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              isOn ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="checkbox"
                checked={isOn}
                onChange={() => toggle(m.key)}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-2xl">{m.icon}</span>
              <span className="text-sm font-medium text-slate-700">{m.label}</span>
            </label>
          )
        })}
      </div>
      <div className="pt-4 border-t border-slate-200">
        <Button onClick={handleSave}>{t('save_changes')}</Button>
      </div>
    </div>
  )
}