import { Mail, Phone, MapPin, CreditCard, ShoppingCart } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import { useTranslation } from '../../i18n/LanguageContext'

export default function SupplierDetailsDrawer({ open, onClose, supplier }) {
  const { t, formatCurrency, formatDate } = useTranslation()
  if (!supplier) return null
  const s = supplier

  return (
    <Drawer open={open} onClose={onClose} title={t('supplier_details')} size="full">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
            {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">{s.name}</h3>
            <div className="flex items-center gap-2.5 mt-1.5">
              <Badge tone={s.status === 'Active' ? 'success' : 'neutral'} dot>
                {t(`status_${s.status.toLowerCase()}`)}
              </Badge>
              <span className="text-xs text-slate-400">{t('since')} {formatDate(s.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{s.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{s.email || '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{s.address || '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
            <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{t('pan')}: {s.pan || '—'}</span>
          </div>
        </div>

        {/* Balance cards */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('balance_summary')}</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">{t('total_purchases')}</div>
              <div className="text-lg font-bold text-slate-900">{formatCurrency(s.totalPurchases)}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-xs text-emerald-700 mb-1">{t('paid')}</div>
              <div className="text-lg font-bold text-emerald-700">{formatCurrency(s.paid)}</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="text-xs text-rose-700 mb-1">{t('payable')}</div>
              <div className="text-lg font-bold text-rose-700">{formatCurrency(s.due)}</div>
            </div>
          </div>
        </div>

        {/* Purchase ledger */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" />
              {t('purchase_ledger')}
            </h4>
            {s.transactions.length > 0 && (
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {s.transactions.length} {s.transactions.length === 1 ? t('transaction') : t('transactions')}
              </span>
            )}
          </div>
          {s.transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {t('no_transactions_yet')}
            </p>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                    <th className="text-left px-4 py-2.5 font-semibold">{t('date')}</th>
                    <th className="text-left px-4 py-2.5 font-semibold">{t('reference')}</th>
                    <th className="text-left px-4 py-2.5 font-semibold">{t('method')}</th>
                    <th className="text-right px-4 py-2.5 font-semibold">{t('amount')}</th>
                    <th className="text-right px-4 py-2.5 font-semibold">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {s.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-600">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-700 font-medium">{tx.id}</td>
                      <td className="px-4 py-3"><Badge tone="info">{tx.method}</Badge></td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(tx.amount)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(tx.balance)}</td>
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