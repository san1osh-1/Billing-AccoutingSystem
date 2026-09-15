// Inventory is derived from products — this file holds stock history
export const stockHistory = [
  { id: 1, date: '2026-09-15', productId: 1, productName: 'Wai Wai Chicken Noodles 78g', type: 'IN',  qty: 500, reference: 'PUR-0210', user: 'Ram Shrestha', reason: 'Purchase receipt' },
  { id: 2, date: '2026-09-15', productId: 7, productName: 'Coca Cola 1.25L',             type: 'IN',  qty: 120, reference: 'PUR-0215', user: 'Ram Shrestha', reason: 'Purchase receipt' },
  { id: 3, date: '2026-09-15', productId: 1, productName: 'Wai Wai Chicken Noodles 78g', type: 'OUT', qty: 48,  reference: 'INV-1042', user: 'Sita Devi',    reason: 'Sale' },
  { id: 4, date: '2026-09-14', productId: 19,productName: 'Maggi Tomato Ketchup 500g',   type: 'OUT', qty: 5,   reference: 'ADJ-0042', user: 'Ram Shrestha', reason: 'Damaged goods' },
  { id: 5, date: '2026-09-13', productId: 6, productName: 'Everest Tea 500g',            type: 'ADJ', qty: -3,  reference: 'ADJ-0041', user: 'Ram Shrestha', reason: 'Stock count correction' },
  { id: 6, date: '2026-09-12', productId: 10,productName: 'Lifebuoy Soap 100g',          type: 'IN',  qty: 200, reference: 'PUR-0211', user: 'Ram Shrestha', reason: 'Purchase receipt' },
]