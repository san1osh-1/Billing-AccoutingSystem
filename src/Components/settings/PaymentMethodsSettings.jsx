import { useState } from 'react'
import Button from '../ui/Button'

const methods = [
  { key: 'cash', label: 'Cash', icon: '💵' },
  { key: 'bank', label: 'Bank Transfer', icon: '🏦' },
  { key: 'qr', label: 'QR Code', icon: '📱' },
  { key: 'esewa', label: 'eSewa', icon: '🟣' },
  { key: 'khalti', label: 'Khalti', icon: '🟪' },
  { key: 'credit', label: 'Credit', icon: '📝' },
]

export default function PaymentMethodsSettings() {
  const [enabled, setEnabled] = useState(['cash', 'bank', 'qr', 'esewa', 'khalti', 'credit'])

  const toggle = (key) => {
    setEnabled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSave = () => {
    alert('Payment methods saved!')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Enable or disable payment methods for sales and purchases.</p>
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
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}