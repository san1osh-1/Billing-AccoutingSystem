export const navigation = [
  {
    type: 'standalone',
    key: 'dashboard',
    label: 'Dashboard',
    labelKey: 'nav_dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    type: 'module',
    key: 'crm',
    label: 'CRM',
    labelKey: 'nav_crm',
    icon: 'Users',
    items: [
      { key: 'customers', label: 'Customers', labelKey: 'nav_customers', path: '/customers', icon: 'Users' },
      { key: 'leads', label: 'Leads', labelKey: 'nav_leads', path: '/leads', icon: 'Target' },
    ],
  },
  {
    type: 'module',
    key: 'sales_pos',
    label: 'Sales & POS',
    labelKey: 'nav_sales_pos',
    icon: 'ShoppingCart',
    items: [
      { key: 'pos_new_sale', label: 'POS / New Sale', labelKey: 'nav_pos_new_sale', path: '/sales', icon: 'Store' },
      { key: 'sales_invoices', label: 'Sales Invoices', labelKey: 'nav_sales_invoices', path: '/sales/invoices', icon: 'Receipt' },
      { key: 'sales_returns', label: 'Sales Returns / Credit Notes', labelKey: 'nav_sales_returns', path: '/sales/returns', icon: 'RotateCcw' },
      { key: 'payments_received', label: 'Payments Received', labelKey: 'nav_payments_received', path: '/payments/received', icon: 'ArrowDownLeft' },
    ],
  },
  {
    type: 'module',
    key: 'purchase',
    label: 'Purchase',
    labelKey: 'nav_purchase',
    icon: 'Truck',
    items: [
      { key: 'suppliers', label: 'Suppliers', labelKey: 'nav_suppliers', path: '/suppliers', icon: 'Building2' },
      { key: 'purchase_bills', label: 'Purchase Bills', labelKey: 'nav_purchase_bills', path: '/purchases', icon: 'FileSpreadsheet' },
      { key: 'purchase_returns', label: 'Purchase Returns / Debit Notes', labelKey: 'nav_purchase_returns', path: '/purchases/returns', icon: 'RotateCw' },
      { key: 'payments_made', label: 'Payments Made', labelKey: 'nav_payments_made', path: '/payments/made', icon: 'ArrowUpRight' },
    ],
  },
  {
    type: 'module',
    key: 'inventory',
    label: 'Inventory',
    labelKey: 'nav_inventory',
    icon: 'Boxes',
    items: [
      { key: 'items', label: 'Items', labelKey: 'nav_items', path: '/products', icon: 'Package' },
      { key: 'categories', label: 'Categories', labelKey: 'nav_categories', path: '/inventory/categories', icon: 'FolderTree' },
      { key: 'units_of_measure', label: 'Units of Measure', labelKey: 'nav_units_of_measure', path: '/inventory/units', icon: 'Scale' },
      { key: 'stock_transfer', label: 'Stock Transfer', labelKey: 'nav_stock_transfer', path: '/inventory/transfers', icon: 'ArrowLeftRight' },
      { key: 'stock_adjustments', label: 'Stock Adjustments', labelKey: 'nav_stock_adjustments', path: '/stock-adjustments', icon: 'SlidersHorizontal' },
      { key: 'low_stock', label: 'Low Stock', labelKey: 'nav_low_stock', path: '/inventory/low-stock', icon: 'AlertTriangle' },
    ],
  },
  {
    type: 'module',
    key: 'accounting',
    label: 'Accounting',
    labelKey: 'nav_accounting',
    icon: 'BookOpen',
    items: [
      { key: 'chart_of_accounts', label: 'Chart of Accounts', labelKey: 'nav_chart_of_accounts', path: '/accounting', icon: 'ListTree' },
      { key: 'journal_vouchers', label: 'Journal Vouchers', labelKey: 'nav_journal_vouchers', path: '/accounting/journal', icon: 'FileCheck' },
      { key: 'expenses', label: 'Expenses', labelKey: 'nav_expenses', path: '/expenses', icon: 'Receipt' },
      { key: 'accounts_receivable', label: 'Accounts Receivable', labelKey: 'nav_accounts_receivable', path: '/accounting/receivable', icon: 'ArrowDownCircle' },
      { key: 'accounts_payable', label: 'Accounts Payable', labelKey: 'nav_accounts_payable', path: '/accounting/payable', icon: 'ArrowUpCircle' },
    ],
  },
  {
    type: 'module',
    key: 'reports_analytics',
    label: 'Reports & Analytics',
    labelKey: 'nav_reports_analytics',
    icon: 'BarChart3',
    items: [
      { key: 'sales_reports', label: 'Sales Reports', labelKey: 'nav_sales_reports', path: '/reports/sales', icon: 'TrendingUp' },
      { key: 'purchase_reports', label: 'Purchase Reports', labelKey: 'nav_purchase_reports', path: '/reports/purchases', icon: 'ShoppingBag' },
      { key: 'inventory_reports', label: 'Inventory Reports', labelKey: 'nav_inventory_reports', path: '/reports/inventory', icon: 'Boxes' },
      { key: 'profit_loss', label: 'Profit & Loss', labelKey: 'nav_profit_loss', path: '/reports/profit-loss', icon: 'DollarSign' },
      { key: 'balance_sheet', label: 'Balance Sheet', labelKey: 'nav_balance_sheet', path: '/reports/balance-sheet', icon: 'PieChart' },
      { key: 'cash_flow', label: 'Cash Flow', labelKey: 'nav_cash_flow', path: '/reports/cash-flow', icon: 'Activity' },
      { key: 'trial_balance', label: 'Trial Balance', labelKey: 'nav_trial_balance', path: '/reports/trial-balance', icon: 'Scale' },
      { key: 'tax_vat_reports', label: 'Tax / VAT Reports', labelKey: 'nav_tax_vat_reports', path: '/reports/vat', icon: 'Calculator' },
    ],
  },
  {
    type: 'standalone',
    key: 'users',
    label: 'Users & Roles',
    labelKey: 'nav_users',
    path: '/users',
    icon: 'Users',
  },
  {
    type: 'standalone',
    key: 'configuration',
    label: 'Configuration',
    labelKey: 'nav_configuration',
    path: '/settings',
    icon: 'Settings2',
  },
]

// Flattened items for lookups
export const allNavItems = navigation.flatMap((entry) =>
  entry.type === 'standalone' ? [entry] : entry.items || []
)

// Helper to determine the header title based on current pathname
export function getNavigationTitle(pathname, t) {
  if (!pathname || pathname === '/' || pathname === '/dashboard') {
    return t ? t('nav_dashboard') : 'Dashboard'
  }

  if (pathname === '/settings') {
    return t ? t('nav_configuration') : 'Configuration'
  }

  // Exact match first
  const exact = allNavItems.find((item) => item.path === pathname)
  if (exact) {
    return t ? t(exact.labelKey) : exact.label
  }

  // Prefix match
  const prefix = allNavItems.find(
    (item) => item.path !== '/dashboard' && pathname.startsWith(item.path)
  )
  if (prefix) {
    return t ? t(prefix.labelKey) : prefix.label
  }

  return t ? t('dashboard') : 'Dashboard'
}