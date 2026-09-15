import Input from '../ui/Input'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ReportFilters({ startDate, endDate, onStartDateChange, onEndDateChange, onGenerate, loading }) {
  const { t } = useTranslation()
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <Input
          label={t('start_date')}
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="flex-1"
        />
        <Input
          label={t('end_date')}
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onGenerate} loading={loading} className="sm:w-auto w-full">
          {t('generate_report')}
        </Button>
      </div>
    </div>
  )
}