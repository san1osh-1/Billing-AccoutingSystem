import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function BusinessProfile() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: 'Shrestha Traders',
    address: 'New Road, Kathmandu',
    phone: '01-4234567',
    email: 'info@shresthatraders.com',
    logo: '',
  })

  const handleSave = () => {
    alert(t('profile_saved'))
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <Input label={t('business_name')} value={form.name} onChange={set('name')} />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('address')}</label>
        <textarea value={form.address} onChange={set('address')} rows={2}
          className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t('phone')} value={form.phone} onChange={set('phone')} />
        <Input label={t('email')} type="email" value={form.email} onChange={set('email')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('business_logo')}</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-brand-600">ह</span>
          </div>
          <Button variant="secondary">{t('upload_logo')}</Button>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-200">
        <Button onClick={handleSave}>{t('save_changes')}</Button>
      </div>
    </div>
  )
}