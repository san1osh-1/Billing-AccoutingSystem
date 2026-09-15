export const kpis = [
  { title: 'Total Sales',     value: 'Rs. 8,45,600', change: 12.4, trend: 'up',   tone: 'brand' },
  { title: 'Total Purchases', value: 'Rs. 5,12,300', change: 8.2,  trend: 'up',   tone: 'sky' },
  { title: 'Total Expenses',  value: 'Rs. 96,450',   change: 3.1,  trend: 'down', tone: 'amber' },
  { title: 'Net Profit',      value: 'Rs. 2,36,850', change: 18.6, trend: 'up',   tone: 'emerald' },
]

export const salesProfitChart = [
  { name: 'Baisakh',   sales: 420000, profit: 110000 },
  { name: 'Jestha',    sales: 510000, profit: 145000 },
  { name: 'Ashadh',    sales: 480000, profit: 128000 },
  { name: 'Shrawan',   sales: 620000, profit: 180000 },
  { name: 'Bhadra',    sales: 710000, profit: 205000 },
  { name: 'Ashwin',    sales: 845600, profit: 236850 },
]

export const lowStockProducts = [
  { id: 1, name: 'Wai Wai Chicken Noodles', sku: 'WW-CHI-78G', current: 12, minimum: 50, status: 'Critical' },
  { id: 2, name: 'Gold Peak Sugar 1kg',     sku: 'GP-SUG-1KG', current: 24, minimum: 40, status: 'Low' },
  { id: 3, name: 'Wai Wai Masala Noodles',  sku: 'WW-MAS-78G', current: 8,  minimum: 50, status: 'Critical' },
  { id: 4, name: 'Relax Mustard Oil 1L',    sku: 'RL-MUS-1L',  current: 15, minimum: 30, status: 'Low' },
  { id: 5, name: 'Himalayan Salt 500g',     sku: 'HM-SLT-500', current: 18, minimum: 40, status: 'Low' },
]

export const topSelling = [
  { id: 1, name: 'Wai Wai Chicken Noodles', units: 1240, revenue: 62000 },
  { id: 2, name: 'Gold Peak Sugar 1kg',     units: 420,  revenue: 126000 },
  { id: 3, name: 'Relax Mustard Oil 1L',    units: 310,  revenue: 139500 },
  { id: 4, name: 'Everest Tea 500g',        units: 285,  revenue: 114000 },
  { id: 5, name: 'Coca Cola 1.25L',         units: 560,  revenue: 84000 },
]

export const recentTransactions = [
  { id: 'INV-1042', customer: 'Shrestha Kirana Pasal', date: '2026-09-15', method: 'eSewa',    amount: 45600, status: 'Paid' },
  { id: 'INV-1041', customer: 'Maharjan General Store', date: '2026-09-15', method: 'Bank',     amount: 128500, status: 'Paid' },
  { id: 'INV-1040', customer: 'Tamang Traders',         date: '2026-09-14', method: 'Credit',   amount: 89200, status: 'Due' },
  { id: 'INV-1039', customer: 'Gurung Mart',            date: '2026-09-14', method: 'QR',       amount: 34500, status: 'Paid' },
  { id: 'INV-1038', customer: 'Rai Bhandar',            date: '2026-09-13', method: 'Cash',     amount: 18900, status: 'Paid' },
  { id: 'INV-1037', customer: 'Thapa Store',            date: '2026-09-13', method: 'Khalti',   amount: 56700, status: 'Partial' },
]