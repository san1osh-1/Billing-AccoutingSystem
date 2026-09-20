import { useState } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

export default function StockOperationDrawer({ open, onClose, onSubmit, products, initialProduct }) {
  const { t } = useTranslation()
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('IN')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const [reference, setReference] = useState('')
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setProductId(initialProduct?.id || '')
    setType('IN'); setQty(''); setReason(''); setReference(''); setErrors({})
  }

  const selectedProduct = products.find((p) => p.id === Number(productId))

  const validate = () => {
    const e = {}
    if (!productId) e.product = t('required_product')
    if (!qty || Number(qty) <= 0) e.qty = t('valid_qty')
    if (!reason.trim()) e.reason = t('required_reason')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const signedQty = type === 'OUT' ? -Number(qty) : type === 'ADJ' ? (Number(qty) * (reason.toLowerCase().includes('decrease') ? -1 : 1)) : Number(qty)
    onSubmit({
      productId: Number(productId),
      productName: selectedProduct?.name || '',
      type,
      qty: signedQty,
      reason,
      reference,
      user: 'Ram Shrestha',
    })
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title={t('stock_operation')} size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('apply')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label={t('product')} value={productId} onChange={(e) => setProductId(e.target.value)} error={errors.product} required>
          <option value="">{t('select_product')}</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({t('stock')}: {p.stock})</option>)}
        </Select>

        {selectedProduct && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('current_stock')}</span>
              <span className="font-semibold">{selectedProduct.stock} {selectedProduct.unit}</span>
            </div>
          </div>
        )}

        <Select label={t('operation_type')} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="IN">{t('stock_in')}</option>
          <option value="OUT">{t('stock_out')}</option>
          <option value="ADJ">{t('adjustment')}</option>
        </Select>

        <Input label={t('quantity')} type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} error={errors.qty} required />

        <Input label={t('reason')} value={reason} onChange={(e) => setReason(e.target.value)} error={errors.reason} required placeholder={t('reason_placeholder')} />

        <Input label={t('reference_optional')} value={reference} onChange={(e) => setReference(e.target.value)} placeholder={t('reference_placeholder')} />
      </form>
    </Drawer>
  )
}