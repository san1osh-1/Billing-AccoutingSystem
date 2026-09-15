import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { formatCurrency } from '../../utils/format'
import { useTranslation } from '../../i18n/LanguageContext'

const emptyLine = { accountId: '', accountName: '', debit: 0, credit: 0 }

export default function JournalEntryDrawer({ open, onClose, onSubmit, accounts }) {
  const { t } = useTranslation()
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [reference, setReference] = useState('')
  const [lines, setLines] = useState([{ ...emptyLine }, { ...emptyLine }])
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    setDate(new Date().toISOString().slice(0, 10))
    setDescription(''); setReference('')
    setLines([{ ...emptyLine }, { ...emptyLine }])
    setErrors({})
  }

  const updateLine = (idx, field, value) => {
    setLines((prev) => prev.map((l, i) => {
      if (i !== idx) return l
      if (field === 'accountId') {
        const acc = accounts.find((a) => a.id === value)
        return acc ? { ...l, accountId: acc.id, accountName: acc.name } : l
      }
      return { ...l, [field]: Number(value) || 0 }
    }))
  }

  const addLine = () => setLines((prev) => [...prev, { ...emptyLine }])
  const removeLine = (idx) => setLines((prev) => prev.filter((_, i) => i !== idx))

  const totals = lines.reduce(
    (acc, l) => ({ debit: acc.debit + l.debit, credit: acc.credit + l.credit }),
    { debit: 0, credit: 0 }
  )

  const validate = () => {
    const e = {}
    if (!description.trim()) e.description = t('required_description')
    if (lines.filter((l) => l.accountId).length < 2) e.lines = t('two_lines_required')
    if (totals.debit !== totals.credit) e.balanced = t('balanced_required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({
      date,
      description,
      reference,
      lines: lines.filter((l) => l.accountId),
    })
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title={t('new_journal_entry')} size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('post_entry')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label={t('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input label={t('description')} value={description} onChange={(e) => setDescription(e.target.value)} error={errors.description} required />
          <Input label={t('reference')} value={reference} onChange={(e) => setReference(e.target.value)} placeholder={t('invoice_placeholder')} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">{t('entry_lines')}</label>
            <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={addLine}>{t('add_line')}</Button>
          </div>

          {errors.lines && <p className="text-xs text-rose-600 mb-2">{errors.lines}</p>}
          {errors.balanced && <p className="text-xs text-rose-600 mb-2">{errors.balanced}</p>}

          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50/40">
                <div className="col-span-12 md:col-span-6">
                  <select
                    value={line.accountId}
                    onChange={(e) => updateLine(idx, 'accountId', e.target.value)}
                    className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">{t('select_account')}</option>
                    {accounts.map((a) => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
                  </select>
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input type="number" min="0" step="0.01" value={line.debit || ''} onChange={(e) => updateLine(idx, 'debit', e.target.value)}
                    placeholder={t('debit')} className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <input type="number" min="0" step="0.01" value={line.credit || ''} onChange={(e) => updateLine(idx, 'credit', e.target.value)}
                    placeholder={t('credit')} className="w-full h-9 px-2 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                  <button type="button" onClick={() => removeLine(idx)} disabled={lines.length <= 2}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between text-sm">
            <div>
              <span className="text-slate-600">{t('total_debit')}: </span>
              <span className="font-semibold">{formatCurrency(totals.debit)}</span>
            </div>
            <div>
              <span className="text-slate-600">{t('total_credit')}: </span>
              <span className="font-semibold">{formatCurrency(totals.credit)}</span>
            </div>
            <div className={totals.debit === totals.credit ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
              {totals.debit === totals.credit ? `✓ ${t('balanced')}` : `✗ ${t('unbalanced')}`}
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  )
}