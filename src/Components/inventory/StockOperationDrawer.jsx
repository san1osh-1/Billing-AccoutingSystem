import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const types = [
  { value: 'IN',   label: 'Stock In (Add)' },
  { value: 'OUT',  label: 'Stock Out (Remove)' },
  { value: 'ADJ',  label: 'Adjustment' },
]

export default function StockOperationDrawer({ open, onClose, onSubmit, products, initialProduct }) {
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('IN')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const [reference, setReference] = useState('')
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setProductId(initialProduct?.id || '')
    setType('IN'); setQty(''); setReason(''); setReference(''); setErrors({})
  }

  const selectedProduct = products.find((p) => p.id === Number(productId))

  const validate = () => {
    const e = {}
    if (!productId) e.product = 'Select a product'
    if (!qty || Number(qty) <= 0) e.qty = 'Enter a valid quantity'
    if (!reason.trim()) e.reason = 'Reason is required'
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
    <Drawer open={open} onClose={onClose} title="Stock Operation" size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Apply</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Product" value={productId} onChange={(e) => setProductId(e.target.value)} error={errors.product} required>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
        </Select>

        {selectedProduct && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Current Stock</span>
              <span className="font-semibold">{selectedProduct.stock} {selectedProduct.unit}</span>
            </div>
          </div>
        )}

        <Select label="Operation Type" value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>

        <Input label="Quantity" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} error={errors.qty} required />

        <Input label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} error={errors.reason} required placeholder="e.g. Damaged goods, Stock count correction" />

        <Input label="Reference (optional)" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="PO#, Invoice#, etc." />
      </form>
    </Drawer>
  )
}