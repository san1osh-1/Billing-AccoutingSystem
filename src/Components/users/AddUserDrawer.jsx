import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const emptyForm = { name: '', email: '', phone: '', roleId: '' }

export default function AddUserDrawer({ open, onClose, onSubmit, roles, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setForm(initial ? { name: initial.name, email: initial.email, phone: initial.phone, roleId: initial.roleId } : emptyForm)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    if (!form.roleId) e.roleId = 'Select a role'
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
    <Drawer open={open} onClose={onClose} title={isEdit ? 'Edit User' : 'Add New User'} size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add User'}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} required />
        <Input label="Phone" value={form.phone} onChange={set('phone')} error={errors.phone} required placeholder="98XXXXXXXX" />
        <Select label="Role" value={form.roleId} onChange={set('roleId')} error={errors.roleId} required>
          <option value="">Select role</option>
          {roles.map((r) => <option key={r.id} value={r.id}>{r.name} — {r.description}</option>)}
        </Select>
      </form>
    </Drawer>
  )
}