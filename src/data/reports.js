// Report data generators
export const generateProfitLoss = (startDate, endDate) => ({
  title: 'Profit & Loss Statement',
  period: `${startDate} to ${endDate}`,
  sections: [
    {
      title: 'Revenue',
      items: [
        { name: 'Sales Revenue', amount: 8456000 },
      ],
      total: 8456000,
    },
    {
      title: 'Cost of Goods Sold',
      items: [
        { name: 'Cost of Goods Sold', amount: 5123000 },
      ],
      total: 5123000,
    },
    {
      title: 'Gross Profit',
      total: 3333000,
      isHighlight: true,
    },
    {
      title: 'Operating Expenses',
      items: [
        { name: 'Rent Expense', amount: 270000 },
        { name: 'Salary Expense', amount: 220000 },
        { name: 'Utilities Expense', amount: 84500 },
        { name: 'Marketing Expense', amount: 45000 },
        { name: 'Other Expenses', amount: 144950 },
      ],
      total: 764450,
    },
    {
      title: 'Net Profit',
      total: 2568550,
      isHighlight: true,
      isFinal: true,
    },
  ],
})

export const generateBalanceSheet = (asOfDate) => ({
  title: 'Balance Sheet',
  asOf: asOfDate,
  sections: [
    {
      title: 'Assets',
      items: [
        { name: 'Cash', amount: 245600 },
        { name: 'Bank - Nabil Bank', amount: 1250000 },
        { name: 'Bank - NIC Asia', amount: 890000 },
        { name: 'Accounts Receivable', amount: 384300 },
        { name: 'Inventory', amount: 1850000 },
      ],
      total: 4619900,
    },
    {
      title: 'Liabilities',
      items: [
        { name: 'Accounts Payable', amount: 370000 },
        { name: 'VAT Payable', amount: 125400 },
      ],
      total: 495400,
    },
    {
      title: 'Equity',
      items: [
        { name: "Owner's Capital", amount: 2000000 },
        { name: 'Retained Earnings', amount: 856850 },
        { name: 'Current Period Profit', amount: 2568550 },
      ],
      total: 5424500,
    },
    {
      title: 'Total Liabilities & Equity',
      total: 5919900,
      isHighlight: true,
      isFinal: true,
    },
  ],
})

export const generateCashFlow = (startDate, endDate) => ({
  title: 'Cash Flow Statement',
  period: `${startDate} to ${endDate}`,
  sections: [
    {
      title: 'Operating Activities',
      items: [
        { name: 'Net Profit', amount: 2568550 },
        { name: 'Depreciation', amount: 45000 },
        { name: 'Increase in Receivables', amount: -125000 },
        { name: 'Increase in Inventory', amount: -350000 },
        { name: 'Increase in Payables', amount: 85000 },
      ],
      total: 2223550,
    },
    {
      title: 'Investing Activities',
      items: [
        { name: 'Equipment Purchase', amount: -180000 },
      ],
      total: -180000,
    },
    {
      title: 'Financing Activities',
      items: [
        { name: 'Owner Drawings', amount: -200000 },
      ],
      total: -200000,
    },
    {
      title: 'Net Cash Flow',
      total: 1843550,
      isHighlight: true,
      isFinal: true,
    },
  ],
})

export const generateTrialBalance = (asOfDate) => ({
  title: 'Trial Balance',
  asOf: asOfDate,
  accounts: [
    { code: '1000', name: 'Cash', debit: 245600, credit: 0 },
    { code: '1010', name: 'Bank - Nabil Bank', debit: 1250000, credit: 0 },
    { code: '1020', name: 'Bank - NIC Asia', debit: 890000, credit: 0 },
    { code: '1100', name: 'Accounts Receivable', debit: 384300, credit: 0 },
    { code: '1200', name: 'Inventory', debit: 1850000, credit: 0 },
    { code: '2000', name: 'Accounts Payable', debit: 0, credit: 370000 },
    { code: '2100', name: 'VAT Payable', debit: 0, credit: 125400 },
    { code: '3000', name: "Owner's Capital", debit: 0, credit: 2000000 },
    { code: '3100', name: 'Retained Earnings', debit: 0, credit: 856850 },
    { code: '4000', name: 'Sales Revenue', debit: 0, credit: 8456000 },
    { code: '5000', name: 'Cost of Goods Sold', debit: 5123000, credit: 0 },
    { code: '6000', name: 'Rent Expense', debit: 270000, credit: 0 },
    { code: '6100', name: 'Salary Expense', debit: 220000, credit: 0 },
    { code: '6200', name: 'Utilities Expense', debit: 84500, credit: 0 },
    { code: '6300', name: 'Marketing Expense', debit: 45000, credit: 0 },
    { code: '6900', name: 'Other Expenses', debit: 144950, credit: 0 },
  ],
  totalDebit: 10507350,
  totalCredit: 11808250,
})