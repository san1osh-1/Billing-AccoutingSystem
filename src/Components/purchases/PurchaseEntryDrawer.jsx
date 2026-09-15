import { useState } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'
import { Plus, Trash2 } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { formatCurrency } from '../../utils/format'
import { calcLineTotal, VAT_RATE } from '../../utils/cart'

const emptyLine = { productId: '', name: '', qty: 1, price: 0, discount: 0, vatApplicable: true }

export default function PurchaseEntryDrawer({ open, onClose, onSubmit, suppliers, products }) {
  const { t } = useTranslation()
  const [supplierId, setSupplierId] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [lines, setLines] = useState([{ ...emptyLine }])
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [paymentStatus, setPaymentStatus] = useState('Paid')
  const [amountPaid, setAmountPaid] = useState('')
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setSupplierId(''); setInvoiceNo(''); setLines([{ ...emptyLine }])
    setPaymentMethod('bank'); setPaymentStatus('Paid'); setAmountPaid(''); setErrors({})
  }

  const updateLine = (idx, field, value) => {
    setLines((prev) => prev.map((l, i) => {
      if (i !== idx) return l
      if (field === 'productId') {
        const p = products.find((x) => x.id === Number(value))
        return p ? { ...l, productId: p.id, name: p.name, price: p.purchasePrice, vatApplicable: p.vatApplicable } : l
      }
      return { ...l, [field]: field === 'qty' || field === 'price' || field === 'discount' ? Number(value) || 0 : value }
    }))
  }

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }])
  const removeLine = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx))

  const totals = lines.reduce(
    (acc, l) => {
      const { vat, total } = calcLineTotal(l.price, l.qty, l.discount, l.vatApplicable)
      return {
        subtotal: acc.subtotal + l.price * l.qty,
        discount: acc.discount + l.discount,
        vat: acc.vat + vat,
        grandTotal: acc.grandTotal + total,
      }
    },
    { subtotal: 0, discount: 0, vat: 0, grandTotal: 0 }
  )

  const validate = () => {
    const e = {}
    if (!supplierId) e.supplier = t('required_supplier')
    if (!invoiceNo.trim()) e.invoice = t('required_invoice_no')
    if (lines.every((l) => !l.productId)) e.lines = t('require_one_product')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const supplier = suppliers.find((s) => s.id === Number(supplierId))
    const paid = paymentStatus === 'Paid' ? totals.grandTotal : Number(amountPaid) || 0
    onSubmit({
      supplierId: Number(supplierId),
      supplierName: supplier?.name || '',
      invoiceNo,
      items: lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, name: l.name, qty: l.qty, price: l.price, discount: l.discount })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      vat: totals.vat,
      grandTotal: totals.grandTotal,
      paymentMethod,
      paymentStatus: paid >= totals.grandTotal ? 'Paid' : paid > 0 ? 'Partial' : 'Due',
      amountPaid: paid,
    })
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title={t('new_purchase_entry')} size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('save_purchase')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Supplier info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label={t('supplier')} value={supplierId} onChange={(e) => setSupplierId(e.target.value)} error={errors.supplier} required>
            <option value="">{t('select_supplier')}</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label={t('supplier_invoice_no')} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} error={errors.invoice} required placeholder={t('enter_supplier_invoice')} />
        </div>

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">{t('products')}</label>
            <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={addLine}>{t('add_line')}</Button>
          </div>
          {errors.lines && <p className="text-xs text-rose-600 mb-2">{errors.lines}</p>}

          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50/40">
                <div className="col-span-12 md:col-span-4">
                  <select
                    value={line.productId}
                    onChange={(e) => updateLine(idx, 'productId', e.target.value)}
                    className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">{t('select_product')}</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input type="number" min="1" value={line.qty} onChange={(e) => updateLine(idx, 'qty', e.target.value)}
                    placeholder={t('qty')} className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input type="number" min="0" step="0.01" value={line.price} onChange={(e) => updateLine(idx, 'price', e.target.value)}
                    placeholder={t('price')} className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <input type="number" min="0" value={line.discount} onChange={(e) => updateLine(idx, 'discount', e.target.value)}
                    placeholder={t('discount_short')} className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="col-span-1 md:col-span-1 flex items-center justify-center text-sm font-semibold text-slate-900">
                  {formatCurrency(calcLineTotal(line.price, line.qty, line.discount, line.vatApplicable).total)}
                </div>
                <div className="col-span-12 md:col-span-1 flex items-center justify-end">
                  <button type="button" onClick={() => removeLine(idx)} disabled={lines.length === 1}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-600"><span>{t('subtotal')}</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="flex justify-between text-rose-600"><span>{t('discount')}</span><span>−{formatCurrency(totals.discount)}</span></div>
          <div className="flex justify-between text-slate-600"><span>{t('vat')} ({VAT_RATE}%)</span><span>{formatCurrency(totals.vat)}</span></div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>{t('grand_total')}</span><span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label={t('payment_method')} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">{t('method_cash')}</option>
            <option value="bank">{t('method_bank')}</option>
            <option value="qr">{t('method_qr')}</option>
            <option value="credit">{t('method_credit')}</option>
          </Select>
          <Select label={t('payment_status')} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="Paid">{t('status_paid')}</option>
            <option value="Partial">{t('status_partial')}</option>
            <option value="Due">{t('status_due')}</option>
          </Select>
          {paymentStatus !== 'Paid' && (
            <Input label={t('amount_paid_rs')} type="number" min="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
          )}
        </div>
      </form>
    </Drawer>
  )
}