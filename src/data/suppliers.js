export const initialSuppliers = [
  {
    id: 1, name: 'Wai Wai Distributors Nepal', phone: '01-4234567', email: 'orders@waiwai-np.com',  address: 'Balkhu, Kathmandu',       pan: '601234567', totalPurchases: 1850000, paid: 1750000, due: 100000, status: 'Active',   createdAt: '2024-08-10',
    transactions: [
      { id: 'PUR-0210', date: '2026-09-12', type: 'Purchase', amount: 180000, paid: 80000,  balance: 100000, method: 'Bank' },
      { id: 'PUR-0195', date: '2026-08-25', type: 'Purchase', amount: 245000, paid: 245000, balance: 0,      method: 'Bank' },
    ],
  },
  {
    id: 2, name: 'Gold Peak Industries',       phone: '01-5345678', email: 'sales@goldpeak.com',    address: 'Balaju, Kathmandu',       pan: '601234568', totalPurchases: 980000,  paid: 980000,  due: 0,      status: 'Active',   createdAt: '2024-10-15',
    transactions: [
      { id: 'PUR-0208', date: '2026-09-10', type: 'Purchase', amount: 126000, paid: 126000, balance: 0, method: 'Bank' },
    ],
  },
  {
    id: 3, name: 'Relax Oil Mills',            phone: '056-423456', email: 'info@relaxoil.com',     address: 'Birgunj Industrial Area', pan: '601234569', totalPurchases: 1420000, paid: 1280000, due: 140000, status: 'Active',   createdAt: '2024-09-20',
    transactions: [
      { id: 'PUR-0212', date: '2026-09-14', type: 'Purchase', amount: 140000, paid: 0,      balance: 140000, method: 'Credit' },
    ],
  },
  {
    id: 4, name: 'Everest Tea Company',        phone: '023-456789', email: 'supply@everesttea.com', address: 'Ilam, Province 1',        pan: '601234570', totalPurchases: 780000,  paid: 780000,  due: 0,      status: 'Active',   createdAt: '2025-01-05',
    transactions: [],
  },
  {
    id: 5, name: 'Coca Cola Bottlers Nepal',   phone: '01-4456789', email: 'orders@ccbn.com',       address: 'Balkumari, Lalitpur',     pan: '601234571', totalPurchases: 2150000, paid: 2150000, due: 0,      status: 'Active',   createdAt: '2024-07-22',
    transactions: [
      { id: 'PUR-0215', date: '2026-09-15', type: 'Purchase', amount: 225000, paid: 225000, balance: 0, method: 'Bank' },
    ],
  },
  {
    id: 6, name: 'Colgate Palmolive Nepal',    phone: '01-5567890', email: 'b2b@colgate-np.com',    address: 'Lagankhel, Lalitpur',     pan: '601234572', totalPurchases: 620000,  paid: 620000,  due: 0,      status: 'Active',   createdAt: '2025-02-14',
    transactions: [],
  },
  {
    id: 7, name: 'Hindustan Unilever Nepal',   phone: '01-4678901', email: 'supply@hunilever.com',  address: 'Patan, Lalitpur',         pan: '601234573', totalPurchases: 1180000, paid: 1050000, due: 130000, status: 'Active',   createdAt: '2024-11-30',
    transactions: [
      { id: 'PUR-0211', date: '2026-09-11', type: 'Purchase', amount: 130000, paid: 0,      balance: 130000, method: 'Credit' },
    ],
  },
  {
    id: 8, name: 'Philips Lighting Nepal',     phone: '01-5789012', email: 'orders@philips-np.com', address: 'Teku, Kathmandu',         pan: '601234574', totalPurchases: 445000,  paid: 445000,  due: 0,      status: 'Inactive', createdAt: '2025-03-18',
    transactions: [],
  },
]