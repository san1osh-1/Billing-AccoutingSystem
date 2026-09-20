import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { useTranslation } from '../../i18n/LanguageContext'

export default function RecordPaymentDrawer({ open, onClose, onSubmit, customers, suppliers }) {
  const { t } = useTranslation()
  const [type, setType] = useState('received')
  const [partyId, setPartyId] = useState('')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    setType('received'); setPartyId(''); setAmount(''); setMethod('bank'); setReference(''); setNotes(''); setErrors({})
  }

  const parties = type === 'received' ? customers : suppliers

  const validate = () => {
    const e = {}
    if (!partyId) e.party = t('required_party')
    if (!amount || Number(amount) <= 0) e.amount = t('valid_amount')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const party = parties.find((p) => p.id === Number(partyId))
    onSubmit({
      type,
      partyType: type === 'received' ? 'customer' : 'supplier',
      partyId: Number(partyId),
      partyName: party?.name || '',
      amount: Number(amount),
      method,
      reference,
      notes,
    })
    onClose()
  }

  return (
    <Drawer open={open} onClose={onClose} title={t('record_payment')} size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('record_payment')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { setType('received'); setPartyId('') }}
            className={`h-10 rounded-lg text-sm font-medium transition border ${type === 'received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-700 border-slate-200'}`}>
            {t('received')}
          </button>
          <button type="button" onClick={() => { setType('made'); setPartyId('') }}
            className={`h-10 rounded-lg text-sm font-medium transition border ${type === 'made' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200'}`}>
            {t('made')}
          </button>
        </div>

        <Select label={type === 'received' ? 'Customer' : 'Supplier'} value={partyId} onChange={(e) => setPartyId(e.target.value)} error={errors.party} required>
          <option value="">Select {type === 'received' ? 'customer' : 'supplier'}</option>
          {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>

        <Input label="Amount (Rs.)" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} error={errors.amount} required />

        <Select label="Payment Method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="qr">QR</option>
          <option value="esewa">eSewa</option>
          <option value="khalti">Khalti</option>
        </Select>

        <Input label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Invoice #, voucher, etc." />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
        </div>
      </form>
    </Drawer>
  )
}