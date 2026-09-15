import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function InvoiceSettings() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    prefix: 'INV',
    startNumber: '1000',
    footer: 'Thank you for your business!',
    taxDisplay: 'inclusive',
  })

  const handleSave = () => {
    alert(t('invoice_settings_saved'))
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t('invoice_prefix')} value={form.prefix} onChange={set('prefix')} placeholder="INV" />
        <Input label={t('starting_number')} value={form.startNumber} onChange={set('startNumber')} placeholder="1000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('invoice_footer_text')}</label>
        <textarea value={form.footer} onChange={set('footer')} rows={2}
          className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
      </div>
      <Select label={t('tax_display')} value={form.taxDisplay} onChange={set('taxDisplay')}>
        <option value="inclusive">{t('tax_inclusive')}</option>
        <option value="exclusive">{t('tax_exclusive')}</option>
      </Select>
      <div className="pt-4 border-t border-slate-200">
        <Button onClick={handleSave}>{t('save_changes')}</Button>
      </div>
    </div>
  )
}