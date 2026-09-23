import { Navigate } from 'react-router-dom'
import MainLayout from '../Components/Layout/MainLayout'
import ProtectedRoute from '../Components/auth/ProtectedRoute'
import PublicRoute from '../Components/auth/PublicRoute'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Dashboard from '../Pages/Dashboard'
import Sales from '../Pages/Sales'
import SalesInvoices from '../Pages/SalesInvoices'
import SalesReturns from '../Pages/SalesReturns'
import Customers from '../Pages/Customers'
import Leads from '../Pages/Leads'
import Purchases from '../Pages/Purchases'
import Suppliers from '../Pages/Suppliers'
import Products from '../Pages/Products'
import InventoryCategories from '../Pages/InventoryCategories'
import InventoryUnits from '../Pages/InventoryUnits'
import StockTransfers from '../Pages/StockTransfers'
import StockAdjustments from '../Pages/StockAdjustments'
import LowStock from '../Pages/LowStock'
import Payments from '../Pages/Payments'
import Expenses from '../Pages/Expenses'
import Accounting from '../Pages/Accounting'
import Reports from '../Pages/Reports'
import OperationalReports from '../Pages/OperationalReports'
import Users from '../Pages/Users'
import Settings from '../Pages/Settings'

const routes = [
  // ── Public auth routes (redirect to /dashboard if already logged in) ──
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  // ── Protected app routes (redirect to /login if not logged in) ──
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },

      // CRM
      { path: 'customers', element: <Customers /> },
      { path: 'leads', element: <Leads /> },

      // Sales & POS
      { path: 'sales', element: <Sales /> },
      { path: 'sales/pos', element: <Sales /> },
      { path: 'sales/invoices', element: <SalesInvoices /> },
      { path: 'sales/returns', element: <SalesReturns /> },
      { path: 'payments/received', element: <Payments /> },

      // Purchase
      { path: 'suppliers', element: <Suppliers /> },
      { path: 'purchases', element: <Purchases /> },
      { path: 'purchases/bills', element: <Purchases /> },
      { path: 'purchases/returns', element: <Purchases /> },
      { path: 'payments/made', element: <Payments /> },

      // Inventory
      { path: 'products', element: <Products /> },
      { path: 'inventory/items', element: <Navigate to="/products" replace /> },
      { path: 'inventory/categories', element: <InventoryCategories /> },
      { path: 'inventory/units', element: <InventoryUnits /> },
      { path: 'inventory/transfers', element: <StockTransfers /> },
      { path: 'stock-adjustments', element: <StockAdjustments /> },
      { path: 'inventory/low-stock', element: <LowStock /> },

      // Accounting
      { path: 'accounting', element: <Accounting /> },
      { path: 'accounting/chart', element: <Accounting /> },
      { path: 'accounting/journal', element: <Accounting /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'accounting/receivable', element: <Accounting /> },
      { path: 'accounting/payable', element: <Accounting /> },

      // Reports & Analytics
      { path: 'reports', element: <Reports /> },
      { path: 'reports/profit-loss', element: <Reports /> },
      { path: 'reports/balance-sheet', element: <Reports /> },
      { path: 'reports/cash-flow', element: <Reports /> },
      { path: 'reports/trial-balance', element: <Reports /> },
      { path: 'reports/sales', element: <OperationalReports /> },
      { path: 'reports/purchases', element: <OperationalReports /> },
      { path: 'reports/inventory', element: <OperationalReports /> },
      { path: 'reports/vat', element: <OperationalReports /> },

      // Utility
      { path: 'payments', element: <Payments /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // ── Catch-all: unknown paths go to /dashboard (which will redirect to /login if needed) ──
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]

export default routes