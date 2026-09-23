import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useReports() {
  const { businessId } = useAuth()
  const [currentReport, setCurrentReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateReport = useCallback(async (type, startDate, endDate) => {
    setLoading(true)

    try {
      const scoped = {
        from: (table) => supabase.from(table).eq('business_id', businessId),
      }
      // Fetch sales, purchases, expenses, accounts, customers, suppliers, products in parallel
      const queries = [
        scoped.from('sales')
          .select('*')
          .gte('date', startDate || '2000-01-01')
          .lte('date', endDate || '2099-12-31'),
        scoped.from('purchases')
          .select('*')
          .gte('date', startDate || '2000-01-01')
          .lte('date', endDate || '2099-12-31'),
        scoped.from('expenses')
          .select('*')
          .gte('date', startDate || '2000-01-01')
          .lte('date', endDate || '2099-12-31'),
        supabase.from('chart_of_accounts').select('*'),
        scoped.from('customers').select('*'),
        scoped.from('suppliers').select('*'),
        scoped.from('products').select('*'),
      ]

      const [
        { data: sales },
        { data: purchases },
        { data: expenses },
        { data: accounts },
        { data: customers },
        { data: suppliers },
        { data: products },
      ] = await Promise.all(queries)

      const totalSales = (sales || []).reduce((s, x) => s + Number(x.grand_total || 0), 0)
      const totalPurchases = (purchases || []).reduce((s, x) => s + Number(x.grand_total || 0), 0)
      const grossProfit = totalSales - totalPurchases

      // Group expenses by category
      const expenseByCategory = {}
      ;(expenses || []).forEach((e) => {
        const cat = e.category || 'Other Expenses'
        expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(e.amount || 0)
      })

      const expenseItems = Object.entries(expenseByCategory).map(([name, amount]) => ({
        name: `${name} Expense`,
        amount,
      }))
      if (expenseItems.length === 0) {
        expenseItems.push({ name: 'General Expenses', amount: 0 })
      }

      const totalExpenses = expenseItems.reduce((s, x) => s + x.amount, 0)
      const netProfit = grossProfit - totalExpenses

      const totalReceivable = (customers || []).reduce((s, c) => s + Number(c.due || 0), 0)
      const totalPayable = (suppliers || []).reduce((s, sp) => s + Number(sp.due || 0), 0)
      const inventoryValuation = (products || []).reduce(
        (s, p) => s + (Number(p.stock) || 0) * (Number(p.purchase_price) || 0),
        0
      )

      let report = null

      if (type === 'profit-loss') {
        report = {
          title: 'Profit & Loss Statement',
          period: `${startDate} to ${endDate}`,
          sections: [
            {
              title: 'Revenue',
              items: [{ name: 'Sales Revenue', amount: totalSales }],
              total: totalSales,
            },
            {
              title: 'Cost of Goods Sold',
              items: [{ name: 'Cost of Goods Sold (Purchases)', amount: totalPurchases }],
              total: totalPurchases,
            },
            {
              title: 'Gross Profit',
              total: grossProfit,
              isHighlight: true,
            },
            {
              title: 'Operating Expenses',
              items: expenseItems,
              total: totalExpenses,
            },
            {
              title: 'Net Profit',
              total: netProfit,
              isHighlight: true,
              isFinal: true,
            },
          ],
        }
      } else if (type === 'balance-sheet') {
        const cashBank = (accounts || [])
          .filter((a) => a.type === 'Asset' && (a.name.includes('Cash') || a.name.includes('Bank')))
          .map((a) => ({ name: a.name, amount: Number(a.balance || 0) }))

        const assetItems = [
          ...(cashBank.length ? cashBank : [{ name: 'Cash & Bank', amount: 0 }]),
          { name: 'Accounts Receivable', amount: totalReceivable },
          { name: 'Inventory', amount: inventoryValuation },
        ]
        const totalAssets = assetItems.reduce((s, x) => s + x.amount, 0)

        const liabilityItems = [
          { name: 'Accounts Payable', amount: totalPayable },
          {
            name: 'VAT Payable',
            amount: Math.max(
              0,
              (sales || []).reduce((s, x) => s + Number(x.vat || 0), 0) -
                (purchases || []).reduce((s, x) => s + Number(x.vat || 0), 0)
            ),
          },
        ]
        const totalLiabilities = liabilityItems.reduce((s, x) => s + x.amount, 0)

        const capitalAccount = (accounts || []).find((a) => a.code === '3000')
        const ownerCapital = capitalAccount ? Number(capitalAccount.balance) : 0
        const retainedEarnings = totalAssets - totalLiabilities - netProfit - ownerCapital

        const equityItems = [
          { name: "Owner's Capital", amount: ownerCapital },
          { name: 'Retained Earnings', amount: Math.max(0, retainedEarnings) },
          { name: 'Current Period Profit', amount: netProfit },
        ]
        const totalEquity = equityItems.reduce((s, x) => s + x.amount, 0)

        report = {
          title: 'Balance Sheet',
          asOf: endDate,
          sections: [
            {
              title: 'Assets',
              items: assetItems,
              total: totalAssets,
            },
            {
              title: 'Liabilities',
              items: liabilityItems,
              total: totalLiabilities,
            },
            {
              title: 'Equity',
              items: equityItems,
              total: totalEquity,
            },
            {
              title: 'Total Liabilities & Equity',
              total: totalLiabilities + totalEquity,
              isHighlight: true,
              isFinal: true,
            },
          ],
        }
      } else if (type === 'cash-flow') {
        const operatingItems = [
          { name: 'Net Profit', amount: netProfit },
          { name: 'Change in Receivables', amount: -totalReceivable },
          { name: 'Change in Inventory', amount: -inventoryValuation },
          { name: 'Change in Payables', amount: totalPayable },
        ]
        const operatingTotal = operatingItems.reduce((s, x) => s + x.amount, 0)

        report = {
          title: 'Cash Flow Statement',
          period: `${startDate} to ${endDate}`,
          sections: [
            {
              title: 'Operating Activities',
              items: operatingItems,
              total: operatingTotal,
            },
            {
              title: 'Investing Activities',
              items: [{ name: 'Equipment & Fixed Assets', amount: 0 }],
              total: 0,
            },
            {
              title: 'Financing Activities',
              items: [{ name: 'Owner Drawings / Capital Inflow', amount: 0 }],
              total: 0,
            },
            {
              title: 'Net Cash Flow',
              total: operatingTotal,
              isHighlight: true,
              isFinal: true,
            },
          ],
        }
      } else if (type === 'trial-balance') {
        const tbAccounts = (accounts || []).map((a) => {
          const bal = Number(a.balance || 0)
          let debit = 0
          let credit = 0
          if (['Asset', 'Expense'].includes(a.type)) {
            debit = bal
          } else {
            credit = bal
          }
          // Override revenue/expense with actual values if available
          if (a.code === '4000') credit = totalSales
          if (a.code === '5000') debit = totalPurchases
          return { code: a.code, name: a.name, debit, credit }
        })

        const totalDebit = tbAccounts.reduce((s, a) => s + a.debit, 0)
        const totalCredit = tbAccounts.reduce((s, a) => s + a.credit, 0)

        report = {
          title: 'Trial Balance',
          asOf: endDate,
          accounts: tbAccounts,
          totalDebit,
          totalCredit,
        }
      }

      setCurrentReport(report)
    } catch (err) {
      console.error('generateReport error:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  return { currentReport, loading, generateReport }
}