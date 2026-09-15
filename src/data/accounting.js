export const chartOfAccounts = [
  // Assets
  { id: '1000', code: '1000', name: 'Cash', type: 'Asset', balance: 245600, parentCode: null },
  { id: '1010', code: '1010', name: 'Bank - Nabil Bank', type: 'Asset', balance: 1250000, parentCode: null },
  { id: '1020', code: '1020', name: 'Bank - NIC Asia', type: 'Asset', balance: 890000, parentCode: null },
  { id: '1100', code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 384300, parentCode: null },
  { id: '1200', code: '1200', name: 'Inventory', type: 'Asset', balance: 1850000, parentCode: null },
  
  // Liabilities
  { id: '2000', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 370000, parentCode: null },
  { id: '2100', code: '2100', name: 'VAT Payable', type: 'Liability', balance: 125400, parentCode: null },
  
  // Equity
  { id: '3000', code: '3000', name: "Owner's Capital", type: 'Equity', balance: 2000000, parentCode: null },
  { id: '3100', code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 856850, parentCode: null },
  
  // Income
  { id: '4000', code: '4000', name: 'Sales Revenue', type: 'Income', balance: 8456000, parentCode: null },
  
  // Expenses
  { id: '5000', code: '5000', name: 'Cost of Goods Sold', type: 'COGS', balance: 5123000, parentCode: null },
  { id: '6000', code: '6000', name: 'Rent Expense', type: 'Expense', balance: 270000, parentCode: null },
  { id: '6100', code: '6100', name: 'Salary Expense', type: 'Expense', balance: 220000, parentCode: null },
  { id: '6200', code: '6200', name: 'Utilities Expense', type: 'Expense', balance: 84500, parentCode: null },
  { id: '6300', code: '6300', name: 'Marketing Expense', type: 'Expense', balance: 45000, parentCode: null },
  { id: '6900', code: '6900', name: 'Other Expenses', type: 'Expense', balance: 144950, parentCode: null },
]

export const journalEntries = [
  { id: 'JRN-0156', date: '2026-09-15', description: 'Sale to Shrestha Kirana Pasal', reference: 'INV-1042', lines: [
    { accountId: '1010', accountName: 'Bank - Nabil Bank', debit: 45600, credit: 0 },
    { accountId: '4000', accountName: 'Sales Revenue', debit: 0, credit: 39652 },
    { accountId: '2100', accountName: 'VAT Payable', debit: 0, credit: 5948 },
  ]},
  { id: 'JRN-0155', date: '2026-09-15', description: 'Purchase from Coca Cola Bottlers', reference: 'PUR-0215', lines: [
    { accountId: '1200', accountName: 'Inventory', debit: 193800, credit: 0 },
    { accountId: '2000', accountName: 'Accounts Payable', debit: 0, credit: 193800 },
  ]},
  { id: 'JRN-0154', date: '2026-09-15', description: 'Payment to Coca Cola Bottlers', reference: 'PAY-0510', lines: [
    { accountId: '2000', accountName: 'Accounts Payable', debit: 225000, credit: 0 },
    { accountId: '1010', accountName: 'Bank - Nabil Bank', debit: 0, credit: 225000 },
  ]},
  { id: 'JRN-0153', date: '2026-09-14', description: 'Shop rent payment - September', reference: 'EXP-0210', lines: [
    { accountId: '6000', accountName: 'Rent Expense', debit: 45000, credit: 0 },
    { accountId: '1010', accountName: 'Bank - Nabil Bank', debit: 0, credit: 45000 },
  ]},
  { id: 'JRN-0152', date: '2026-09-14', description: 'Staff salary payment', reference: 'EXP-0209', lines: [
    { accountId: '6100', accountName: 'Salary Expense', debit: 22000, credit: 0 },
    { accountId: '1010', accountName: 'Bank - Nabil Bank', debit: 0, credit: 22000 },
  ]},
]

export const customerLedger = [
  { customerId: 1, customerName: 'Shrestha Kirana Pasal', transactions: [
    { date: '2026-09-15', reference: 'INV-1042', description: 'Sale', debit: 45600, credit: 0, balance: 45600 },
    { date: '2026-09-15', reference: 'PAY-0512', description: 'Payment received', debit: 0, credit: 45600, balance: 0 },
  ]},
  { customerId: 2, customerName: 'Maharjan General Store', transactions: [
    { date: '2026-09-15', reference: 'INV-1041', description: 'Sale', debit: 128500, credit: 0, balance: 128500 },
    { date: '2026-09-15', reference: 'PAY-0511', description: 'Payment received', debit: 0, credit: 128500, balance: 0 },
  ]},
  { customerId: 3, customerName: 'Tamang Traders', transactions: [
    { date: '2026-09-14', reference: 'INV-1040', description: 'Sale', debit: 89200, credit: 0, balance: 89200 },
  ]},
  { customerId: 6, customerName: 'Thapa Store', transactions: [
    { date: '2026-09-13', reference: 'INV-1037', description: 'Sale', debit: 56700, credit: 0, balance: 56700 },
    { date: '2026-09-13', reference: 'PAY-0506', description: 'Payment received', debit: 0, credit: 28350, balance: 28350 },
  ]},
]

export const supplierLedger = [
  { supplierId: 1, supplierName: 'Wai Wai Distributors Nepal', transactions: [
    { date: '2026-09-12', reference: 'PUR-0210', description: 'Purchase', debit: 0, credit: 180000, balance: 180000 },
    { date: '2026-09-14', reference: 'PAY-0508', description: 'Payment made', debit: 80000, credit: 0, balance: 100000 },
  ]},
  { supplierId: 3, supplierName: 'Relax Oil Mills', transactions: [
    { date: '2026-09-14', reference: 'PUR-0212', description: 'Purchase', debit: 0, credit: 140000, balance: 140000 },
  ]},
  { supplierId: 5, supplierName: 'Coca Cola Bottlers Nepal', transactions: [
    { date: '2026-09-15', reference: 'PUR-0215', description: 'Purchase', debit: 0, credit: 225000, balance: 225000 },
    { date: '2026-09-15', reference: 'PAY-0510', description: 'Payment made', debit: 225000, credit: 0, balance: 0 },
  ]},
]