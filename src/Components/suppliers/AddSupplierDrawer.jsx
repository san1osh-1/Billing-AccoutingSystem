import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useTranslation } from '../../i18n/LanguageContext'

const emptyForm = { name: '', phone: '', email: '', address: '', pan: '' }

export default function AddSupplierDrawer({ open, onClose, onSubmit, initial }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setForm(initial ? { name: initial.name, phone: initial.phone, email: initial.email, address: initial.address || '', pan: initial.pan || '' } : emptyForm)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('required_supplier_name')
    if (!form.phone.trim()) e.phone = t('required_phone')
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('invalid_email')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit(form)
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? t('edit_supplier') : t('add_new_supplier')}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{isEdit ? t('save_changes') : t('add_supplier')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label={t('supplier_name')} value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label={t('phone')} value={form.phone} onChange={set('phone')} error={errors.phone} required />
        <Input label={t('email')} type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Input label={t('pan')} value={form.pan} onChange={set('pan')} placeholder={t('pan_placeholder')} />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('address')}</label>
          <textarea value={form.address} onChange={set('address')} rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder={t('address_placeholder')} />
        </div>
      </form>
    </Drawer>
  )
}