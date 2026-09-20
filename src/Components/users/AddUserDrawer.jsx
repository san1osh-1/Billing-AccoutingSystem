import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { useTranslation } from '../../i18n/LanguageContext'

const emptyForm = { name: '', email: '', phone: '', roleId: '' }

export default function AddUserDrawer({ open, onClose, onSubmit, roles, initial }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setForm(initial ? { name: initial.name, email: initial.email, phone: initial.phone, roleId: initial.roleId } : emptyForm)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('required_name')
    if (!form.email.trim()) e.email = t('required_email')
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('invalid_email')
    if (!form.phone.trim()) e.phone = t('required_phone')
    if (!form.roleId) e.roleId = t('required_role')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, roleId: Number(form.roleId) })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer open={open} onClose={onClose} title={isEdit ? t('edit_user') : t('add_new_user')} size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{isEdit ? t('save_changes') : t('add_user')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label={t('full_name')} value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label={t('email')} type="email" value={form.email} onChange={set('email')} error={errors.email} required />
        <Input label={t('phone')} value={form.phone} onChange={set('phone')} error={errors.phone} required placeholder="98XXXXXXXX" />
        <Select label={t('role')} value={form.roleId} onChange={set('roleId')} error={errors.roleId} required>
          <option value="">{t('select_role')}</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.description}</option>)}
        </Select>
      </form>
    </Drawer>
  )
}