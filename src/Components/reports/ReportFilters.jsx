import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ReportFilters({ startDate, endDate, onStartDateChange, onEndDateChange, onGenerate, loading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="flex-1"
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onGenerate} loading={loading} className="sm:w-auto w-full">
          Generate Report
        </Button>
      </div>
    </div>
  )
}