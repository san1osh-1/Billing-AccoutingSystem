import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import SourceIcon, { SOURCES, sourceMeta } from './SourceIcon'
import { leadStatuses } from '../../data/leads'
import { useTranslation } from '../../i18n/LanguageContext'

const emptyForm = () => ({
  name: '',
  source: 'facebook',
  accountName: '',
  phone: '',
  interest: '',
  expectedValue: '',
  status: 'new',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

export default function AddLeadDrawer({ open, onClose, onSubmit, initial }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setForm(
      initial
        ? {
            name: initial.name,
            source: initial.source,
            accountName: initial.accountName || '',
            phone: initial.phone || '',
            interest: initial.interest || '',
            expectedValue: initial.expectedValue || '',
            status: initial.status,
            date: initial.date,
            notes: initial.notes || '',
          }
        : emptyForm()
    )
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('required_name')
    if (form.phone && !/^\d{7,15}$/.test(form.phone.replace(/\s|-/g, ''))) e.phone = t('invalid_phone')
    if (form.expectedValue && Number(form.expectedValue) < 0) e.expectedValue = t('invalid_amount')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      accountName: form.accountName.trim(),
      phone: form.phone.trim(),
      interest: form.interest.trim(),
      notes: form.notes.trim(),
      expectedValue: form.expectedValue ? Number(form.expectedValue) : 0,
    })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? t('edit_lead') : t('add_lead')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{isEdit ? t('save_changes') : t('add_lead')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label={t('lead_name')} value={form.name} onChange={set('name')} error={errors.name} required placeholder={t('lead_name_placeholder')} />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t('source')} <span className="text-rose-500 ml-0.5">*</span>
          </label>
          <div className="flex gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: `${sourceMeta(form.source).color}40` }}
            >
              <SourceIcon source={form.source} className="w-5 h-5" />
            </div>
            <Select value={form.source} onChange={set('source')} className="flex-1" required>
              {SOURCES.map((s) => (
                <option key={s.key} value={s.key}>{t(s.labelKey)}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Input
            label={t('source_account')}
            value={form.accountName}
            onChange={set('accountName')}
            placeholder={t('source_name_placeholder')}
          />
          <p className="mt-1 text-xs text-slate-400">{t('source_account_hint')}</p>
        </div>

        <Input label={t('phone')} value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="98XXXXXXXX" />
        <Input label={t('interest')} value={form.interest} onChange={set('interest')} placeholder={t('interest_placeholder')} />
        <Input
          label={t('expected_value')}
          type="number"
          min={0}
          value={form.expectedValue}
          onChange={set('expectedValue')}
          error={errors.expectedValue}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select label={t('status')} value={form.status} onChange={set('status')}>
            {leadStatuses.map((s) => (
              <option key={s.value} value={s.value}>{t(s.labelKey)}</option>
            ))}
          </Select>
          <Input label={t('date')} type="date" value={form.date} onChange={set('date')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('notes')}</label>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder={t('notes_placeholder')}
          />
        </div>
      </form>
    </Drawer>
  )
}