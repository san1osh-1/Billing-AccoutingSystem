export const initialCustomers = [
  {
    id: 1, name: 'Shrestha Kirana Pasal',     phone: '9841234567', email: 'shrestha.kp@gmail.com',  address: 'New Road, Kathmandu',     pan: '301234567', totalPurchases: 456000, paid: 410400, due: 45600,  status: 'Active',   createdAt: '2025-03-15',
    transactions: [
      { id: 'INV-1042', date: '2026-09-15', type: 'Sale',   amount: 45600,  paid: 45600,  balance: 0,     method: 'eSewa' },
      { id: 'INV-1028', date: '2026-09-08', type: 'Sale',   amount: 78200,  paid: 78200,  balance: 0,     method: 'Bank' },
      { id: 'PAY-0412', date: '2026-09-05', type: 'Payment',amount: -50000, paid: 50000,  balance: 0,     method: 'Cash' },
    ],
  },
  {
    id: 2, name: 'Maharjan General Store',    phone: '9851234567', email: 'maharjan.gs@gmail.com',  address: 'Lalitpur, Bagmati',       pan: '301234568', totalPurchases: 1285000,paid: 1285000,due: 0,      status: 'Active',   createdAt: '2025-01-10',
    transactions: [
      { id: 'INV-1041', date: '2026-09-15', type: 'Sale',   amount: 128500, paid: 128500, balance: 0,     method: 'Bank' },
      { id: 'INV-1015', date: '2026-08-28', type: 'Sale',   amount: 95400,  paid: 95400,  balance: 0,     method: 'QR' },
    ],
  },
  {
    id: 3, name: 'Tamang Traders',            phone: '9861234567', email: 'tamang.traders@gmail.com', address: 'Bhaktapur, Kathmandu',  pan: '301234569', totalPurchases: 892000, paid: 802800, due: 89200,  status: 'Active',   createdAt: '2025-02-20',
    transactions: [
      { id: 'INV-1040', date: '2026-09-14', type: 'Sale',   amount: 89200,  paid: 0,      balance: 89200, method: 'Credit' },
      { id: 'INV-1002', date: '2026-08-15', type: 'Sale',   amount: 112000, paid: 112000, balance: 0,     method: 'Bank' },
    ],
  },
  {
    id: 4, name: 'Gurung Mart',               phone: '9871234567', email: 'gurung.mart@gmail.com',  address: 'Pokhara, Kaski',        pan: '301234570', totalPurchases: 345000, paid: 345000, due: 0,      status: 'Active',   createdAt: '2025-04-05',
    transactions: [
      { id: 'INV-1039', date: '2026-09-14', type: 'Sale',   amount: 34500,  paid: 34500,  balance: 0,     method: 'QR' },
    ],
  },
  {
    id: 5, name: 'Rai Bhandar',               phone: '9881234567', email: 'rai.bhandar@gmail.com',  address: 'Dharan, Sunsari',       pan: '301234571', totalPurchases: 234500, paid: 234500, due: 0,      status: 'Active',   createdAt: '2025-05-12',
    transactions: [
      { id: 'INV-1038', date: '2026-09-13', type: 'Sale',   amount: 18900,  paid: 18900,  balance: 0,     method: 'Cash' },
    ],
  },
  {
    id: 6, name: 'Thapa Store',               phone: '9891234567', email: 'thapa.store@gmail.com',  address: 'Birgunj, Parsa',        pan: '301234572', totalPurchases: 567000, paid: 283500, due: 283500, status: 'Overdue',  createdAt: '2025-03-22',
    transactions: [
      { id: 'INV-1037', date: '2026-09-13', type: 'Sale',   amount: 56700,  paid: 0,      balance: 56700, method: 'Credit' },
    ],
  },
  {
    id: 7, name: 'Adhikari Supermarket',      phone: '9801234567', email: 'adhikari.sm@gmail.com',  address: 'Butwal, Rupandehi',     pan: '301234573', totalPurchases: 1890000,paid: 1890000,due: 0,      status: 'Active',   createdAt: '2024-11-08',
    transactions: [
      { id: 'INV-1035', date: '2026-09-11', type: 'Sale',   amount: 245000, paid: 245000, balance: 0,     method: 'Bank' },
    ],
  },
  {
    id: 8, name: 'KC Mini Mart',              phone: '9811234567', email: 'kc.minimart@gmail.com',  address: 'Nepalgunj, Banke',      pan: '301234574', totalPurchases: 178500, paid: 178500, due: 0,      status: 'Active',   createdAt: '2025-06-18',
    transactions: [],
  },
  {
    id: 9, name: 'Poudel Wholesale',          phone: '9821234567', email: 'poudel.ws@gmail.com',    address: 'Biratchowk, Morang',    pan: '301234575', totalPurchases: 2450000,paid: 2200000,due: 250000, status: 'Overdue',  createdAt: '2024-09-14',
    transactions: [
      { id: 'INV-1030', date: '2026-09-09', type: 'Sale',   amount: 250000, paid: 0,      balance: 250000,method: 'Credit' },
    ],
  },
  {
    id: 10,name: 'Basnet Enterprises',        phone: '9831234567', email: 'basnet.ent@gmail.com',   address: 'Hetauda, Makwanpur',    pan: '301234576', totalPurchases: 412000, paid: 412000, due: 0,      status: 'Inactive', createdAt: '2025-01-30',
    transactions: [],
  },
]