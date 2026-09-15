import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'

const emptyForm = { name: '', phone: '', email: '', address: '', pan: '' }

export default function AddCustomerDrawer({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setForm(initial ? { name: initial.name, phone: initial.phone, email: initial.email, address: initial.address || '', pan: initial.pan || '' } : emptyForm)
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Customer name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s|-/g, ''))) e.phone = 'Enter a valid phone number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
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
      title={isEdit ? 'Edit Customer' : 'Add New Customer'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Customer'}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Customer Name" value={form.name} onChange={set('name')} error={errors.name} required />
        <Input label="Phone" value={form.phone} onChange={set('phone')} error={errors.phone} required placeholder="98XXXXXXXX" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Input label="PAN Number" value={form.pan} onChange={set('pan')} placeholder="9-digit PAN" />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <textarea value={form.address} onChange={set('address')} rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="Street, City, District" />
        </div>
      </form>
    </Drawer>
  )
}