import { useState } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { calcLineTotal } from '../../utils/cart'

export default function ReturnsDrawer({ open, onClose, onSubmit, sales, products }) {
  const { t, num, formatCurrency } = useTranslation()
  const [saleId, setSaleId] = useState('')
  const [qtys, setQtys] = useState({})
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState('Refunded')
  const [error, setError] = useState('')
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setSaleId(''); setQtys({}); setReason(''); setStatus('Refunded'); setError('')
  }

  const sale = sales.find((s) => s.id === saleId)

  const lines = (sale?.items || []).map((item) => {
    const product = products.find((p) => p.id === item.productId)
    const vatApplicable = product ? product.vatApplicable : true
    const origQty = item.qty
    const qty = Math.min(qtys[item.productId] ?? 0, origQty)
    const { vat, total } = calcLineTotal(item.price, qty, 0, vatApplicable)
    return { ...item, origQty, qty, vatApplicable, vat, total }
  })

  const totals = lines.reduce(
    (acc, l) => ({
      subtotal: acc.subtotal + l.price * l.qty,
      vat: acc.vat + l.vat,
      grandTotal: acc.grandTotal + l.total,
    }),
    { subtotal: 0, vat: 0, grandTotal: 0 }
  )

  const setQty = (productId, value, max) => {
    const n = Math.max(0, Math.min(Number(value) || 0, max))
    setQtys((prev) => ({ ...prev, [productId]: n }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!sale) { setError(t('required_invoice')); return }
    const items = lines
      .filter((l) => l.qty > 0)
      .map((l) => ({ productId: l.productId, name: l.name, qty: l.qty, price: l.price }))
    if (items.length === 0) { setError(t('require_one_product')); return }
    onSubmit({
      saleId: sale.id,
      customerId: sale.customerId,
      customerName: sale.customerName,
      items,
      subtotal: totals.subtotal,
      vat: totals.vat,
      grandTotal: totals.grandTotal,
      reason,
      status,
      cashier: 'Ram Shrestha',
    })
    onClose()
  }

  const inputClass = 'w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none'

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t('new_return')}
      size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('save_return')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('reference_invoice')}
            value={saleId}
            onChange={(e) => { setSaleId(e.target.value); setQtys({}); setError('') }}
            required
          >
            <option value="">{t('select_invoice')}</option>
            {sales.map((s) => (
              <option key={s.id} value={s.id}>{s.id} — {s.customerName}</option>
            ))}
          </Select>
          <Input
            label={t('reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('return_reason_placeholder')}
          />
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}

        {sale && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('items')}</label>
            <div className="space-y-2">
              {lines.map((line) => (
                <div key={line.productId} className="grid grid-cols-12 gap-2 items-center p-3 border border-slate-200 rounded-lg bg-slate-50/40">
                  <div className="col-span-7 text-sm">
                    <div className="font-medium text-slate-900">{line.name}</div>
                    <div className="text-xs text-slate-500">{t('sold_qty')}: {num(line.origQty)} · {formatCurrency(line.price)}</div>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      max={line.origQty}
                      value={qtys[line.productId] ?? 0}
                      onChange={(e) => setQty(line.productId, e.target.value, line.origQty)}
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(line.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label={t('return_status')} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Refunded">{t('status_refunded')}</option>
            <option value="Pending">{t('status_pending')}</option>
          </Select>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-600"><span>{t('subtotal')}</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between text-slate-600"><span>{t('vat')}</span><span>{formatCurrency(totals.vat)}</span></div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>{t('total')}</span><span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </form>
    </Drawer>
  )
}
