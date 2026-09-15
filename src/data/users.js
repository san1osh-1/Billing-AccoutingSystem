export const roles = [
  { id: 1, name: 'Owner', description: 'Full access to all features', permissions: ['all'] },
  { id: 2, name: 'Admin', description: 'Administrative access', permissions: ['sales', 'purchases', 'products', 'inventory', 'customers', 'suppliers', 'expenses', 'payments', 'reports', 'users'] },
  { id: 3, name: 'Manager', description: 'Operational management', permissions: ['sales', 'purchases', 'products', 'inventory', 'customers', 'suppliers', 'expenses', 'payments', 'reports'] },
  { id: 4, name: 'Sales Staff', description: 'Sales and POS operations', permissions: ['sales', 'customers', 'products'] },
  { id: 5, name: 'Accountant', description: 'Financial management', permissions: ['accounting', 'reports', 'expenses', 'payments', 'purchases'] },
]

export const initialUsers = [
  { id: 1, name: 'Ram Shrestha', email: 'ram@hisaabkit.com', phone: '9841234567', roleId: 1, roleName: 'Owner', status: 'Active', lastLogin: '2026-09-15 09:30', createdAt: '2024-01-01' },
  { id: 2, name: 'Sita Devi', email: 'sita@hisaabkit.com', phone: '9851234567', roleId: 4, roleName: 'Sales Staff', status: 'Active', lastLogin: '2026-09-15 10:15', createdAt: '2025-03-15' },
  { id: 3, name: 'Hari Bahadur', email: 'hari@hisaabkit.com', phone: '9861234567', roleId: 5, roleName: 'Accountant', status: 'Active', lastLogin: '2026-09-14 16:45', createdAt: '2025-05-20' },
  { id: 4, name: 'Gita Maharjan', email: 'gita@hisaabkit.com', phone: '9871234567', roleId: 3, roleName: 'Manager', status: 'Active', lastLogin: '2026-09-15 08:00', createdAt: '2025-06-10' },
  { id: 5, name: 'Krishna Tamang', email: 'krishna@hisaabkit.com', phone: '9881234567', roleId: 4, roleName: 'Sales Staff', status: 'Inactive', lastLogin: '2026-08-20 14:30', createdAt: '2025-07-01' },
]

export const allPermissions = [
  { key: 'sales', label: 'Sales / POS' },
  { key: 'customers', label: 'Customers' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'suppliers', label: 'Suppliers' },
  { key: 'products', label: 'Products' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'payments', label: 'Payments' },
  { key: 'accounting', label: 'Accounting' },
  { key: 'reports', label: 'Reports' },
  { key: 'users', label: 'Users & Roles' },
  { key: 'settings', label: 'Settings' },
]