import { Download, Printer, FileSpreadsheet } from 'lucide-react'
import Button from '../ui/Button'

export default function ReportActions({ onPrint, onExportPDF, onExportExcel }) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" icon={Printer} onClick={onPrint}>Print</Button>
      <Button variant="secondary" icon={Download} onClick={onExportPDF}>PDF</Button>
      <Button variant="secondary" icon={FileSpreadsheet} onClick={onExportExcel}>Excel</Button>
    </div>
  )
}