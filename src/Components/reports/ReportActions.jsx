import { Download, Printer, FileSpreadsheet } from 'lucide-react'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ReportActions({ onPrint, onExportPDF, onExportExcel }) {
  const { t } = useTranslation()
  return (
    <div className="flex gap-2">
      <Button variant="secondary" icon={Printer} onClick={onPrint}>{t('print')}</Button>
      <Button variant="secondary" icon={Download} onClick={onExportPDF}>{t('pdf')}</Button>
      <Button variant="secondary" icon={FileSpreadsheet} onClick={onExportExcel}>{t('excel')}</Button>
    </div>
  )
}