import { useTranslation } from '../../i18n/LanguageContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const statusTone = (s) => (s === 'Refunded' ? 'success' : 'warning')
const statusKey = { Refunded: 'status_refunded', Pending: 'status_pending' }

export default function ReturnDetailsModal({ open, onClose, ret }) {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  if (!ret) return null

  const items = ret.items || []

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t('credit_note')}: ${ret.id}`}
      size="lg"
      footer={<div className="flex justify-end"><Button variant="secondary" onClick={onClose}>{t('close')}</Button></div>}
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone={statusTone(ret.status)} dot>{t(statusKey[ret.status] || ret.status)}</Badge>
          <span className="text-slate-500">{formatDate(ret.date)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div>
            <div className="text-xs text-slate-500">{t('customer')}</div>
            <div className="font-medium text-slate-900">{ret.customerName}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{t('reference_invoice')}</div>
            <div className="font-mono text-brand-700">{ret.saleId || '—'}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500">{t('reason')}</div>
            <div className="text-slate-700">{ret.reason || '—'}</div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">{t('items')}</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">{t('qty')}</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">{t('rate')}</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-slate-900">{it.name}</td>
                  <td className="px-3 py-2 text-right">{num(it.qty)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(it.price)}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatCurrency(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-600"><span>{t('subtotal')}</span><span>{formatCurrency(ret.subtotal)}</span></div>
          <div className="flex justify-between text-slate-600"><span>{t('vat')}</span><span>{formatCurrency(ret.vat)}</span></div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>{t('total')}</span><span>{formatCurrency(ret.grandTotal)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
