import { Navigate } from 'react-router-dom'
import MainLayout from '../Components/Layout/MainLayout'
import Dashboard from '../Pages/Dashboard'
import Sales from '../Pages/Sales'
import Customers from '../Pages/Customers'
import Purchases from '../Pages/Purchases'
import Suppliers from '../Pages/Suppliers'
import Products from '../Pages/Products'
import Inventory from '../Pages/Inventory'
import StockAdjustments from '../Pages/StockAdjustments'
import Payments from '../Pages/Payments'
import Expenses from '../Pages/Expenses'
import Accounting from '../Pages/Accounting'
import Reports from '../Pages/Reports'
import Users from '../Pages/Users'
import Settings from '../Pages/Settings'

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'sales', element: <Sales /> },
      { path: 'customers', element: <Customers /> },
      { path: 'purchases', element: <Purchases /> },
      { path: 'suppliers', element: <Suppliers /> },
      { path: 'products', element: <Products /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'stock-adjustments', element: <StockAdjustments /> },
      { path: 'payments', element: <Payments /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'accounting', element: <Accounting /> },
      { path: 'reports', element: <Reports /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]

export default routes