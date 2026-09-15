import { formatCurrency } from '../../utils/format'

export default function ReportTable({ report }) {
  if (!report) return null

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {report.sections ? (
        // Profit & Loss, Balance Sheet, Cash Flow format
        <div className="divide-y divide-slate-200">
          {report.sections.map((section, idx) => (
            <div key={idx} className={section.isHighlight ? 'bg-slate-50' : ''}>
              <div className="px-6 py-3 bg-slate-100 border-b border-slate-200">
                <h3 className={`text-sm font-bold ${section.isFinal ? 'text-brand-700' : 'text-slate-900'}`}>
                  {section.title}
                </h3>
              </div>
              {section.items && (
                <div className="px-6 py-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 text-sm">
                      <span className="text-slate-700">{item.name}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={`px-6 py-3 border-t border-slate-200 flex justify-between ${section.isFinal ? 'text-base font-bold text-brand-700' : 'text-sm font-semibold text-slate-900'}`}>
                <span>{section.isFinal ? section.title : 'Total'}</span>
                <span>{formatCurrency(section.total)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : report.accounts ? (
        // Trial Balance format
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
              <th className="text-left px-6 py-3 font-semibold">Code</th>
              <th className="text-left px-6 py-3 font-semibold">Account Name</th>
              <th className="text-right px-6 py-3 font-semibold">Debit</th>
              <th className="text-right px-6 py-3 font-semibold">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.accounts.map((acc) => (
              <tr key={acc.code} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-mono text-xs text-slate-600">{acc.code}</td>
                <td className="px-6 py-3 font-medium text-slate-900">{acc.name}</td>
                <td className="px-6 py-3 text-right">{acc.debit > 0 ? formatCurrency(acc.debit) : '—'}</td>
                <td className="px-6 py-3 text-right">{acc.credit > 0 ? formatCurrency(acc.credit) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-300">
              <td colSpan={2} className="px-6 py-3 font-bold text-slate-900">Totals</td>
              <td className="px-6 py-3 text-right font-bold text-slate-900">{formatCurrency(report.totalDebit)}</td>
              <td className="px-6 py-3 text-right font-bold text-slate-900">{formatCurrency(report.totalCredit)}</td>
            </tr>
          </tfoot>
        </table>
      ) : null}
    </div>
  )
}