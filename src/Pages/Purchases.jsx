import { useState } from 'react'
import { Plus, ShoppingCart, Wallet, AlertTriangle, Receipt } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useSuppliers from '../hooks/useSuppliers'
import usePurchases from '../hooks/usePurchases'
import { formatCurrency, formatDate } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import PurchaseEntryDrawer from '../Components/purchases/PurchaseEntryDrawer'

export default function Purchases() {
  const { all: products, updateProduct } = useProducts()
  const { all: suppliers } = useSuppliers()
  const { purchases, loading, addPurchase, kpis } = usePurchases()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSave = (data) => {
    const saved = addPurchase(data)
    // Increase stock
    data.items.forEach((item) => {
      const p = products.find((x) => x.id === item.productId)
      if (p) updateProduct(p.id, { stock: p.stock + item.qty })
    })
    return saved
  }

  const columns = [
    {
      key: 'id', label: 'Purchase #',
      render: (r) => <span className="font-mono text-xs font-semibold text-brand-700">{r.id}</span>,
    },
    { key: 'supplierName', label: 'Supplier', render: (r) => <span className="font-medium text-slate-900">{r.supplierName}</span> },
    { key: 'invoiceNo', label: 'Invoice', render: (r) => <span className="font-mono text-xs text-slate-600">{r.invoiceNo}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'grandTotal', label: 'Total', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.grandTotal)}</span> },
    { key: 'amountPaid', label: 'Paid', align: 'right', render: (r) => <span className="text-emerald-600">{formatCurrency(r.amountPaid)}</span> },
    {
      key: 'paymentStatus', label: 'Status',
      render: (r) => (
        <Badge tone={r.paymentStatus === 'Paid' ? 'success' : r.paymentStatus === 'Partial' ? 'warning' : 'danger'} dot>
          {r.paymentStatus}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        subtitle="Record supplier purchases and manage payables"
        action={<Button icon={Plus} onClick={() => setDrawerOpen(true)}>New Purchase</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Purchases" value={formatCurrency(kpis.total)} icon={ShoppingCart} tone="brand" />
        <KpiCard title="Paid" value={formatCurrency(kpis.paid)} icon={Receipt} tone="emerald" />
        <KpiCard title="Payable" value={formatCurrency(kpis.due)} icon={Wallet} tone="amber" />
        <KpiCard title="Bills" value={String(kpis.count)} icon={AlertTriangle} tone="sky" />
      </div>

      <DataTable
        columns={columns}
        data={purchases}
        loading={loading}
        emptyTitle="No purchases yet"
        emptyDescription="Record your first supplier purchase."
        emptyAction={<Button onClick={() => setDrawerOpen(true)}>New Purchase</Button>}
      />

      <PurchaseEntryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSave}
        suppliers={suppliers}
        products={products}
      />
    </div>
  )
}