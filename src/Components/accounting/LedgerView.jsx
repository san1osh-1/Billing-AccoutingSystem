import Badge from '../ui/Badge'
import { useTranslation } from '../../i18n/LanguageContext'

export default function LedgerView({ ledger, type = 'customer' }) {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  if (!ledger || ledger.length === 0) {
    return <p className="text-sm text-slate-500 py-8 text-center">{t('no_ledger_entries')}</p>
  }

  return (
    <div className="space-y-6">
      {ledger.map((party) => {
        const finalBalance = party.transactions[party.transactions.length - 1]?.balance || 0
        const hasBalance = finalBalance !== 0

        return (
          <div key={party[`${type}Id`]} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{party[`${type}Name`]}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {num(party.transactions.length)} {party.transactions.length !== 1 ? t('transactions') : t('transaction')}
                </p>
              </div>
              {hasBalance && (
                <Badge tone={finalBalance > 0 ? 'warning' : 'success'}>
                  {t('balance')}: {formatCurrency(Math.abs(finalBalance))}
                </Badge>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs text-slate-600 uppercase">
                  <th className="text-left px-4 py-2 font-semibold">{t('date')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('reference')}</th>
                  <th className="text-left px-4 py-2 font-semibold">{t('description')}</th>
                  <th className="text-right px-4 py-2 font-semibold">{t('debit')}</th>
                  <th className="text-right px-4 py-2 font-semibold">{t('credit')}</th>
                  <th className="text-right px-4 py-2 font-semibold">{t('balance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {party.transactions.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-600">{formatDate(t.date)}</td>
                    <td className="px-4 py-2 font-mono text-xs text-brand-700">{t.reference}</td>
                    <td className="px-4 py-2 text-slate-700">{t.description}</td>
                    <td className="px-4 py-2 text-right">{t.debit > 0 ? formatCurrency(t.debit) : '—'}</td>
                    <td className="px-4 py-2 text-right">{t.credit > 0 ? formatCurrency(t.credit) : '—'}</td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900">{formatCurrency(t.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}