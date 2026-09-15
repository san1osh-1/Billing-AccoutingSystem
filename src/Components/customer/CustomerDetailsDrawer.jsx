import { Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'

export default function CustomerDetailsDrawer({ open, onClose, customer }) {
  if (!customer) return null
  const c = customer

  return (
    <Drawer open={open} onClose={onClose} title="Customer Details" size="lg">
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
                  {c.status}
                </Badge>
                <span className="text-xs text-slate-500">Since {formatDate(c.createdAt)}</span>
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
            <CreditCard className="w-4 h-4 text-slate-400" /> PAN: {c.pan || '—'}
          </div>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Total Purchases</div>
            <div className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(c.totalPurchases)}</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-xs text-emerald-700">Paid</div>
            <div className="mt-1 text-lg font-bold text-emerald-700">{formatCurrency(c.paid)}</div>
          </div>
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
            <div className="text-xs text-rose-700">Due</div>
            <div className="mt-1 text-lg font-bold text-rose-700">{formatCurrency(c.due)}</div>
          </div>
        </div>

        {/* Ledger */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Transaction Ledger</h4>
          {c.transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No transactions yet.</p>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
                    <th className="text-left px-3 py-2 font-semibold">Date</th>
                    <th className="text-left px-3 py-2 font-semibold">Ref</th>
                    <th className="text-left px-3 py-2 font-semibold">Type</th>
                    <th className="text-right px-3 py-2 font-semibold">Amount</th>
                    <th className="text-right px-3 py-2 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {c.transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="px-3 py-2 text-slate-600">{formatDate(t.date)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-brand-700">{t.id}</td>
                      <td className="px-3 py-2">
                        <Badge tone={t.type === 'Sale' ? 'brand' : 'info'}>{t.type}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(Math.abs(t.amount))}</td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">{formatCurrency(t.balance)}</td>
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