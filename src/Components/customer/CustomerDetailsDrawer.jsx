import { Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'
import { useTranslation } from '../../i18n/LanguageContext'

export default function CustomerDetailsDrawer({ open, onClose, customer }) {
  const { t } = useTranslation()
  if (!customer) return null
  const c = customer

  return (
    <Drawer open={open} onClose={onClose} title={t('customer_details')} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
              {c.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{c.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge tone={c.status === 'Active' ? 'success' : c.status === 'Overdue' ? 'danger' : 'neutral'} dot>
                  {t(`status_${c.status.toLowerCase()}`)}
                </Badge>
                <span className="text-xs text-slate-500">{t('since')} {formatDate(c.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" /> {c.phone}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" /> {c.email || '—'}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" /> {c.address || '—'}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <CreditCard className="w-4 h-4 text-slate-400" /> {t('pan')}: {c.pan || '—'}
          </div>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">{t('total_purchases')}</div>
            <div className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(c.totalPurchases)}</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-xs text-emerald-700">{t('paid')}</div>
            <div className="mt-1 text-lg font-bold text-emerald-700">{formatCurrency(c.paid)}</div>
          </div>
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
            <div className="text-xs text-rose-700">{t('due')}</div>
            <div className="mt-1 text-lg font-bold text-rose-700">{formatCurrency(c.due)}</div>
          </div>
        </div>

        {/* Ledger */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">{t('transaction_ledger')}</h4>
          {c.transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">{t('no_transactions_yet')}</p>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
                    <th className="text-left px-3 py-2 font-semibold">{t('date')}</th>
                    <th className="text-left px-3 py-2 font-semibold">{t('reference')}</th>
                    <th className="text-left px-3 py-2 font-semibold">{t('type')}</th>
                    <th className="text-right px-3 py-2 font-semibold">{t('amount')}</th>
                    <th className="text-right px-3 py-2 font-semibold">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {c.transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-3 py-2 text-slate-600">{formatDate(tx.date)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-brand-700">{tx.id}</td>
                      <td className="px-3 py-2">
                        <Badge tone={tx.type === 'Sale' ? 'brand' : 'info'}>{tx.type}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(Math.abs(tx.amount))}</td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">{formatCurrency(tx.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}