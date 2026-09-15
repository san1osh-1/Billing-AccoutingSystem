import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { expenseCategories } from '../../data/expenses'

export default function AddExpenseDrawer({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ category: '', description: '', amount: '', method: 'cash', paidBy: 'Ram Shrestha' })
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setForm({ category: '', description: '', amount: '', method: 'cash', paidBy: 'Ram Shrestha' })
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.category) e.category = 'Select a category'
    if (!form.description.trim()) e.description = 'Description required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, amount: Number(form.amount) })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer open={open} onClose={onClose} title="Add Expense" size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Expense</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Category" value={form.category} onChange={set('category')} error={errors.category} required>
          <option value="">Select category</option>
          {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-rose-500">*</span></label>
          <textarea value={form.description} onChange={set('description')} rows={2}
            className={`w-full rounded-lg border bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${errors.description ? 'border-rose-300' : 'border-slate-200'}`}
            placeholder="What was this expense for?" />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
        </div>
        <Input label="Amount (Rs.)" type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} error={errors.amount} required />
        <Select label="Payment Method" value={form.method} onChange={set('method')}>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="qr">QR</option>
          <option value="esewa">eSewa</option>
          <option value="khalti">Khalti</option>
        </Select>
        <Input label="Paid By" value={form.paidBy} onChange={set('paidBy')} />
      </form>
    </Drawer>
  )
}