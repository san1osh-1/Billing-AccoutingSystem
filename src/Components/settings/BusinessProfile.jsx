import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'
import useBusinessSettings from '../../hooks/useBusinessSettings'
import LoadingState from '../ui/LoadingState'
import { Check, AlertCircle } from 'lucide-react'

export default function BusinessProfile() {
  const { t } = useTranslation()
  const { settings, loading, updateSettings } = useBusinessSettings()

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    panVat: '',
    invoicePrefix: '',
    invoiceFooter: '',
  })
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        panVat: settings.panVat || '',
        invoicePrefix: settings.invoicePrefix || 'INV',
        invoiceFooter: settings.invoiceFooter || '',
      })
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    setErrorMsg('')
    const ok = await updateSettings(form)
    setSaving(false)
    if (ok) {
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } else {
      setErrorMsg('Failed to save business settings')
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (loading) {
    return <LoadingState rows={4} />
  }

  return (
    <div className="space-y-4">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{t('profile_saved') || 'Business profile saved successfully!'}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Business Info */}
      <Input label={t('business_name')} value={form.name} onChange={set('name')} />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('address')}</label>
        <textarea
          value={form.address}
          onChange={set('address')}
          rows={2}
          className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t('phone')} value={form.phone} onChange={set('phone')} />
        <Input label={t('email')} type="email" value={form.email} onChange={set('email')} />
      </div>

      <Input label={t('pan_vat') || 'PAN / VAT Number'} value={form.panVat} onChange={set('panVat')} />

      {/* Invoice Settings */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Invoice Settings</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Invoice Prefix" value={form.invoicePrefix} onChange={set('invoicePrefix')} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Invoice Footer Note</label>
            <textarea
              value={form.invoiceFooter}
              onChange={set('invoiceFooter')}
              rows={2}
              placeholder="e.g. Thank you for your business!"
              className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : t('save_changes')}
        </Button>
      </div>
    </div>
  )
}