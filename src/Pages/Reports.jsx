import { useState } from 'react'
import { FileText, TrendingUp, PieChart, DollarSign, Calculator } from 'lucide-react'
import useReports from '../hooks/useReports'
import PageHeader from '../Components/ui/PageHeader'
import Card from '../Components/ui/Card'
import ReportHeader from '../Components/reports/ReportHeader'
import ReportFilters from '../Components/reports/ReportFilters'
import ReportTable from '../Components/reports/ReportTable'
import ReportActions from '../Components/reports/ReportActions'
import LoadingState from '../Components/ui/LoadingState'

const reportTypes = [
  { key: 'profit-loss', label: 'Profit & Loss', icon: TrendingUp, description: 'Revenue, expenses, and net profit' },
  { key: 'balance-sheet', label: 'Balance Sheet', icon: PieChart, description: 'Assets, liabilities, and equity' },
  { key: 'cash-flow', label: 'Cash Flow', icon: DollarSign, description: 'Cash inflows and outflows' },
  { key: 'trial-balance', label: 'Trial Balance', icon: Calculator, description: 'All account balances' },
]

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('profit-loss')
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-09-15')
  const { currentReport, loading, generateReport } = useReports()

  const handleGenerate = () => {
    generateReport(selectedReport, startDate, endDate)
  }

  const handlePrint = () => window.print()
  const handleExportPDF = () => alert('PDF export coming soon!')
  const handleExportExcel = () => alert('Excel export coming soon!')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate financial reports and analytics"
      />

      {/* Report type selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((r) => {
          const Icon = r.icon
          const isSelected = selectedReport === r.key
          return (
            <button
              key={r.key}
              onClick={() => setSelectedReport(r.key)}
              className={`p-4 rounded-xl border text-left transition ${
                isSelected
                  ? 'bg-brand-50 border-brand-300 ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{r.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{r.description}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <ReportFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGenerate={handleGenerate}
        loading={loading}
      />

      {/* Report output */}
      {loading ? (
        <Card>
          <LoadingState rows={10} />
        </Card>
      ) : currentReport ? (
        <>
          <ReportHeader
            title={currentReport.title}
            subtitle={currentReport.period || currentReport.asOf}
            period={currentReport.period}
          />
          <ReportTable report={currentReport} />
          <div className="flex justify-end">
            <ReportActions
              onPrint={handlePrint}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
            />
          </div>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Select a report type and click "Generate Report"</p>
          </div>
        </Card>
      )}
    </div>
  )
}