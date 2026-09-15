import { useState } from 'react'
import { generateProfitLoss, generateBalanceSheet, generateCashFlow, generateTrialBalance } from '../data/reports'

export default function useReports() {
  const [currentReport, setCurrentReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateReport = (type, startDate, endDate) => {
    setLoading(true)
    setTimeout(() => {
      let report
      switch (type) {
        case 'profit-loss':
          report = generateProfitLoss(startDate, endDate)
          break
        case 'balance-sheet':
          report = generateBalanceSheet(endDate)
          break
        case 'cash-flow':
          report = generateCashFlow(startDate, endDate)
          break
        case 'trial-balance':
          report = generateTrialBalance(endDate)
          break
        default:
          report = null
      }
      setCurrentReport(report)
      setLoading(false)
    }, 500)
  }

  return { currentReport, loading, generateReport }
}