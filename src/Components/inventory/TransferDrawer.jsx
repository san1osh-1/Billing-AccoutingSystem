import { useState } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const emptyForm = {
  productId: '',
  fromLocation: '',
  toLocation: '',
  qty: '',
  reference: '',
  status: 'Completed',
}

export default function TransferDrawer({ open, onClose, onSubmit, products }) {
  const { t, formatCurrency } = useTranslation()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setForm(emptyForm)
    setErrors({})
  }

  const product = products.find((p) => p.id === Number(form.productId))

  const validate = () => {
    const e = {}
    if (!form.productId) e.product = t('required_transfer_fields')
    if (!form.fromLocation.trim() || !form.toLocation.trim()) e.locations = t('required_transfer_fields')
    if (form.fromLocation.trim() && form.fromLocation.trim() === form.toLocation.trim()) e.locations = t('same_location_error')
    if (!form.qty || Number(form.qty) <= 0) e.qty = t('valid_stock')
    else if (product && Number(form.qty) > product.stock) e.qty = t('transfer_qty_exceeds')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      productId: product.id,
      productName: product.name,
      fromLocation: form.fromLocation.trim(),
      toLocation: form.toLocation.trim(),
      qty: Number(form.qty),
      reference: form.reference,
      status: form.status,
      user: 'Ram Shrestha',
    })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t('new_transfer')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('save_transfer')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label={t('product')} value={form.productId} onChange={set('productId')} error={errors.product} required>
          <option value="">{t('select_product')}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.stock} {p.unit}</option>
          ))}
        </Select>

        {product && (
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            {t('current_stock')}: <span className="font-semibold text-slate-900">{product.stock} {product.unit}</span>
            {' · '}
            {t('stock_value')}: <span className="font-semibold text-slate-900">{formatCurrency(product.stock * product.purchasePrice)}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('from_location')}
            value={form.fromLocation}
            onChange={set('fromLocation')}
            placeholder={t('from_location_placeholder')}
            required
          />
          <Input
            label={t('to_location')}
            value={form.toLocation}
            onChange={set('toLocation')}
            placeholder={t('to_location_placeholder')}
            required
          />
        </div>
        {errors.locations && <p className="text-xs text-rose-600 -mt-2">{errors.locations}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label={t('quantity')} type="number" min="1" value={form.qty} onChange={set('qty')} error={errors.qty} required />
          <Input label={t('reference')} value={form.reference} onChange={set('reference')} />
          <Select label={t('status')} value={form.status} onChange={set('status')}>
            <option value="Completed">{t('status_completed')}</option>
            <option value="Pending">{t('status_pending')}</option>
          </Select>
        </div>
      </form>
    </Drawer>
  )
}
