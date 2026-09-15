import { Printer, CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { formatCurrency, formatDate } from '../../utils/format'
import { useTranslation } from '../../i18n/LanguageContext'

export default function InvoiceModal({ open, onClose, sale }) {
  const { t } = useTranslation()
  if (!sale) return null

  const handlePrint = () => window.print()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('close')}</Button>
          <Button icon={Printer} onClick={handlePrint}>{t('print_invoice')}</Button>
        </div>
      }
    >
      <div className="text-center mb-4">
        <div className="inline-flex w-12 h-12 rounded-full bg-emerald-50 items-center justify-center mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t('sale_completed')}</h3>
        <p className="text-sm text-slate-500">{t('invoice_recorded').replace('{id}', sale.id)}</p>
      </div>

      <div className="border border-slate-200 rounded-lg p-4 space-y-3 text-sm">
        <div className="flex justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500">{t('invoice_no')}</div>
            <div className="font-mono font-semibold text-brand-700">{sale.id}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">{t('date')}</div>
            <div className="font-medium">{formatDate(sale.date)}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-1">{t('customer')}</div>
          <div className="font-medium text-slate-900">{sale.customerName}</div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">{t('items')}</div>
          <div className="space-y-1.5">
            {sale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-slate-700 flex-1">
                  {item.name} <span className="text-slate-400">×{item.qty}</span>
                </span>
                <span className="font-medium text-slate-900">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1">
          <div className="flex justify-between text-xs text-slate-600">
            <span>{t('subtotal')}</span><span>{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-xs text-rose-600">
              <span>{t('discount')}</span><span>−{formatCurrency(sale.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-slate-600">
            <span>{t('vat_13')}</span><span>{formatCurrency(sale.vat)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
            <span>{t('total')}</span><span>{formatCurrency(sale.grandTotal)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
          <span className="text-slate-500">{t('payment')}</span>
          <span className="font-medium text-slate-900 uppercase">{sale.paymentMethod}</span>
        </div>
      </div>
    </Modal>
  )
}