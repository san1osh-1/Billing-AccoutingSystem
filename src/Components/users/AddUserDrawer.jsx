import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import PermissionsEditor from './PermissionsEditor'
import { useTranslation } from '../../i18n/LanguageContext'

const emptyForm = { name: '', email: '', phone: '', roleId: '', permissions: [] }

export default function AddUserDrawer({ open, onClose, onSubmit, roles, initial }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (initial) {
      const matchedRole = roles.find((r) => r.id === initial.roleId)
      setForm({
        name: initial.name || '',
        email: initial.email || '',
        phone: initial.phone || '',
        roleId: initial.roleId || '',
        permissions: initial.permissions || matchedRole?.permissions || [],
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }

  const handleRoleChange = (e) => {
    const roleId = Number(e.target.value)
    const selectedRole = roles.find((r) => r.id === roleId)
    setForm((prev) => ({
      ...prev,
      roleId: e.target.value,
      permissions: selectedRole ? [...selectedRole.permissions] : [],
    }))
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
    <Drawer open={open} onClose={onClose} title={isEdit ? t('edit_user') : t('add_new_user')} size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{isEdit ? t('save_changes') : t('add_user')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label={t('full_name')} value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label={t('email')} type="email" value={form.email} onChange={set('email')} error={errors.email} required disabled={isEdit} />
        <Input label={t('phone')} value={form.phone} onChange={set('phone')} error={errors.phone} required placeholder="98XXXXXXXX" />
        <Select label={t('role')} value={form.roleId} onChange={handleRoleChange} error={errors.roleId} required>
          <option value="">{t('select_role')}</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.description}</option>)}
        </Select>

        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t('feature_access_permissions') || 'Feature Access Permissions'}
          </label>
          <p className="text-xs text-slate-500 mb-3">
            {t('permissions_hint') || 'Tick the features this staff member is allowed to view and manage.'}
          </p>
          <PermissionsEditor
            permissions={form.permissions}
            onChange={(newPerms) => setForm((prev) => ({ ...prev, permissions: newPerms }))}
          />
        </div>
      </form>
    </Drawer>
  )
}