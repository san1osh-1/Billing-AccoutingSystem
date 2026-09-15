import { formatCurrency } from '../../utils/format'
import Badge from '../ui/Badge'

export default function ChartOfAccounts({ accounts }) {
  const grouped = accounts.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type].push(account)
    return acc
  }, {})

  const typeOrder = ['Asset', 'Liability', 'Equity', 'Income', 'COGS', 'Expense']
  const typeColors = {
    Asset: 'brand',
    Liability: 'rose',
    Equity: 'sky',
    Income: 'emerald',
    COGS: 'amber',
    Expense: 'neutral',
  }

  return (
    <div className="space-y-6">
      {typeOrder.map((type) => {
        const items = grouped[type]
        if (!items || items.length === 0) return null
        const total = items.reduce((s, i) => s + i.balance, 0)

        return (
          <div key={type}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Badge tone={typeColors[type]}>{type}</Badge>
              </h3>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(total)}</span>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
                    <th className="text-left px-4 py-2 font-semibold">Code</th>
                    <th className="text-left px-4 py-2 font-semibold">Account Name</th>
                    <th className="text-right px-4 py-2 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono text-xs text-slate-600">{acc.code}</td>
                      <td className="px-4 py-2 font-medium text-slate-900">{acc.name}</td>
                      <td className="px-4 py-2 text-right font-semibold">{formatCurrency(acc.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}