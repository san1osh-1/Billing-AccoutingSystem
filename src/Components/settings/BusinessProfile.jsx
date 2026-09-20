import { useState, useEffect, useRef } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'
import useBusinessSettings from '../../hooks/useBusinessSettings'
import { uploadToCloudinary } from '../../lib/cloudinary'
import LoadingState from '../ui/LoadingState'
import { Upload, Check, AlertCircle } from 'lucide-react'

export default function BusinessProfile() {
  const { t } = useTranslation()
  const { settings, loading, updateSettings } = useBusinessSettings()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    panVat: '',
    logoUrl: '',
  })
  const [uploading, setUploading] = useState(false)
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
        logoUrl: settings.logoUrl || '',
      })
    }
  }, [settings])

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setErrorMsg('')
    try {
      const url = await uploadToCloudinary(file, 'karobar/logos')
      setForm((prev) => ({ ...prev, logoUrl: url }))
    } catch (err) {
      console.error('Logo upload error:', err)
      setErrorMsg(err.message || 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

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

      <Input label={t('pan_vat') || 'PAN / VAT'} value={form.panVat} onChange={set('panVat')} />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('business_logo')}</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-brand-600">ह</span>
            )}
          </div>
          <div className="space-y-1">
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : t('upload_logo')}
            </Button>
            {form.logoUrl && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                className="text-xs text-rose-600 hover:underline block"
              >
                Remove logo
              </button>
            )}
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