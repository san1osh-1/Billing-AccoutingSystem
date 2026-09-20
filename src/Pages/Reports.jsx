import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FileText, TrendingUp, PieChart, DollarSign, Calculator } from 'lucide-react'
import useReports from '../hooks/useReports'
import PageHeader from '../Components/ui/PageHeader'
import Card from '../Components/ui/Card'
import ReportHeader from '../Components/reports/ReportHeader'
import ReportFilters from '../Components/reports/ReportFilters'
import ReportTable from '../Components/reports/ReportTable'
import ReportActions from '../Components/reports/ReportActions'
import LoadingState from '../Components/ui/LoadingState'
import { useTranslation } from '../i18n/LanguageContext'

const reportTypes = [
  { key: 'profit-loss', labelKey: 'profit_loss', icon: TrendingUp, descKey: 'profit_loss_desc' },
  { key: 'balance-sheet', labelKey: 'balance_sheet', icon: PieChart, descKey: 'balance_sheet_desc' },
  { key: 'cash-flow', labelKey: 'cash_flow', icon: DollarSign, descKey: 'cash_flow_desc' },
  { key: 'trial-balance', labelKey: 'trial_balance', icon: Calculator, descKey: 'trial_balance_desc' },
]

export default function Reports() {
  const location = useLocation()
  const { t } = useTranslation()

  const getReportFromPath = (pathname) => {
    if (pathname.includes('balance-sheet')) return 'balance-sheet'
    if (pathname.includes('cash-flow')) return 'cash-flow'
    if (pathname.includes('trial-balance')) return 'trial-balance'
    return 'profit-loss'
  }

  const [selectedReport, setSelectedReport] = useState(() => getReportFromPath(location.pathname))
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-09-15')
  const { currentReport, loading, generateReport } = useReports()

  useEffect(() => {
    setSelectedReport(getReportFromPath(location.pathname))
  }, [location.pathname])

  const handleGenerate = () => {
    generateReport(selectedReport, startDate, endDate)
  }

  const handlePrint = () => window.print()
  const handleExportPDF = () => alert(t('coming_soon'))
  const handleExportExcel = () => alert(t('coming_soon'))

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav_reports')}
        subtitle={t('reports_page_subtitle')}
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
              <h3 className="text-sm font-semibold text-slate-900">{t(r.labelKey)}</h3>
              <p className="text-xs text-slate-500 mt-1">{t(r.descKey)}</p>
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
            <p className="text-sm font-medium text-slate-600">{t('select_report_hint')}</p>
          </div>
        </Card>
      )}
    </div>
  )
}