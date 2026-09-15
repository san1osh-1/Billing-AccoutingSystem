import { Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/format'

export default function SupplierDetailsDrawer({ open, onClose, supplier }) {
  if (!supplier) return null
  const s = supplier

  return (
    <Drawer open={open} onClose={onClose} title="Supplier Details" size="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
            {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{s.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge tone={s.status === 'Active' ? 'success' : 'neutral'} dot>{s.status}</Badge>
              <span className="text-xs text-slate-500">Since {formatDate(s.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> {s.phone}</div>
          <div className="flex items-center gap-2 text-slate-600"><Mail className="w-4 h-4 text-slate-400" /> {s.email || '—'}</div>
          <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-slate-400" /> {s.address || '—'}</div>
          <div className="flex items-center gap-2 text-slate-600"><CreditCard className="w-4 h-4 text-slate-400" /> PAN: {s.pan || '—'}</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Total Purchases</div>
            <div className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(s.totalPurchases)}</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-xs text-emerald-700">Paid</div>
            <div className="mt-1 text-lg font-bold text-emerald-700">{formatCurrency(s.paid)}</div>
          </div>
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
            <div className="text-xs text-rose-700">Payable</div>
            <div className="mt-1 text-lg font-bold text-rose-700">{formatCurrency(s.due)}</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Purchase Ledger</h4>
          {s.transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No transactions yet.</p>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase">
                    <th className="text-left px-3 py-2 font-semibold">Date</th>
                    <th className="text-left px-3 py-2 font-semibold">Ref</th>
                    <th className="text-left px-3 py-2 font-semibold">Method</th>
                    <th className="text-right px-3 py-2 font-semibold">Amount</th>
                    <th className="text-right px-3 py-2 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {s.transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="px-3 py-2 text-slate-600">{formatDate(t.date)}</td>
                      <td className="px-3 py-2 font-mono text-xs text-brand-700">{t.id}</td>
                      <td className="px-3 py-2"><Badge tone="info">{t.method}</Badge></td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(t.amount)}</td>
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