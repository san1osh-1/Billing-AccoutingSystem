import { useRef } from 'react'
import { Printer, Download, CheckCircle2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'
import { business } from '../../data/business'
import { adToBsParts } from '../../utils/bs'

const timeNow = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const fiscalYear = () => {
  const parts = adToBsParts(new Date().toISOString().slice(0, 10))
  return parts ? `${parts.year}/${parts.year + 1}` : ''
}

const Row = ({ label, value }) => (
  <div className="flex justify-between text-[11px] leading-relaxed">
    <span className="text-slate-600">{label}</span>
    <span className="font-medium text-slate-900">{value}</span>
  </div>
)

const Divider = ({ dashed }) => (
  <div className={`border-t my-1.5 ${dashed ? 'border-dashed border-slate-400' : 'border-slate-300'}`} />
)

export default function InvoiceModal({ open, onClose, sale }) {
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const receiptRef = useRef(null)

  const handlePrint = () => window.print()

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
    })
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = 80 // mm — IRD thermal receipt width
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    const pdf = new jsPDF({ unit: 'mm', format: [pdfWidth, pdfHeight] })
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`invoice-${sale.id}.pdf`)
  }

  if (!sale) return null

  const items = sale.items || []
  const taxableAmount = sale.subtotal || 0
  const vatAmount = sale.vat || 0
  const grandTotal = sale.grandTotal || taxableAmount + vatAmount

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('close')}</Button>
          <Button variant="secondary" icon={Download} onClick={handleDownloadPdf}>{t('download_pdf')}</Button>
          <Button icon={Printer} onClick={handlePrint}>{t('print_invoice')}</Button>
        </div>
      }
    >
      <div className="text-center mb-4">
        <div className="inline-flex w-12 h-12 rounded-full bg-emerald-50 items-center justify-center mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t('sale_completed')}</h3>
        <p className="text-sm text-slate-500">{t('invoice_recorded').replace('{id}', sale.id)}</p>
      </div>

      {/* IRD tax invoice / receipt */}
      <div
        ref={receiptRef}
        id="receipt-print-area"
        className="mx-auto w-[320px] font-mono text-[11px] leading-relaxed text-slate-900 bg-white border border-dashed border-slate-300 p-4 rounded-lg select-none"
      >
        <div className="text-center text-sm font-bold uppercase">{business.name}</div>
        <div className="text-center">{business.address}</div>
        <div className="text-center">Tel: {business.phone}</div>
        <div className="text-center">PAN/VAT: {business.panVat}</div>

        <Divider dashed />

        <div className="text-center font-bold tracking-wide uppercase">{t('tax_invoice_title')}</div>

        <Divider />

        <div className="flex justify-between">
          <span>{t('fiscal_year')}: {fiscalYear()}</span>
          <span>{t('invoice_no')}: {sale.id}</span>
        </div>
        <div className="flex justify-between mt-0.5">
          <span>{t('date')}: {formatDate(sale.date)}</span>
          <span>{t('time')}: {timeNow()}</span>
        </div>

        <Divider />

        <div>
          <span className="text-slate-600">{t('customer')}: </span>
          <span className="font-medium">{sale.customerName || t('walk_in_customer')}</span>
        </div>

        <Divider />

        <div className="flex font-bold border-b border-slate-300 pb-0.5 mb-0.5">
          <span className="w-6">SN</span>
          <span className="flex-1">{t('items')}</span>
          <span className="w-10 text-right">{t('qty')}</span>
          <span className="w-16 text-right">{t('rate')}</span>
          <span className="w-20 text-right">{t('amount')}</span>
        </div>

        {items.map((item, i) => (
          <div key={i} className="flex items-start leading-snug">
            <span className="w-6">{num(i + 1)}</span>
            <span className="flex-1 break-words pr-1">{item.name}</span>
            <span className="w-10 text-right">{num(item.qty)}</span>
            <span className="w-16 text-right">{formatCurrency(item.price)}</span>
            <span className="w-20 text-right">{formatCurrency(item.price * item.qty)}</span>
          </div>
        ))}

        <Divider dashed />

        <Row label={t('subtotal')} value={formatCurrency(taxableAmount)} />
        {sale.discount > 0 && (
          <Row label={t('discount')} value={`-${formatCurrency(sale.discount)}`} />
        )}
        <Row label={t('vat_13')} value={formatCurrency(vatAmount)} />

        <Divider />

        <div className="flex justify-between text-sm font-bold">
          <span>{t('total')}</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>

        <Divider />

        <div className="flex justify-between">
          <span className="text-slate-600">{t('payment_method')}</span>
          <span className="font-medium uppercase">{t(`method_${sale.paymentMethod}`)}</span>
        </div>

        <Divider />

        <div className="text-center text-[10px] text-slate-500 space-y-0.5">
          <div>{t('goods_return_note')}</div>
          <div>{t('thank_you_note')}</div>
        </div>
      </div>
    </Modal>
  )
}