import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Boxes, Calculator, FileText, Package, Wallet, AlertTriangle } from 'lucide-react'
import useSales from '../hooks/useSales'
import usePurchases from '../hooks/usePurchases'
import useProducts from '../hooks/useProducts'
import PageHeader from '../Components/ui/PageHeader'
import KpiCard from '../Components/ui/KpiCard'
import Badge from '../Components/ui/Badge'
import Card from '../Components/ui/Card'
import DataTable from '../Components/ui/DataTable'
import { useTranslation } from '../i18n/LanguageContext'

const tabs = [
  { key: 'sales', labelKey: 'sales', subtitleKey: 'sales_reports_subtitle', icon: TrendingUp },
  { key: 'purchases', labelKey: 'purchases', subtitleKey: 'purchase_reports_subtitle', icon: ShoppingBag },
  { key: 'inventory', labelKey: 'inventory', subtitleKey: 'inventory_reports_subtitle', icon: Boxes },
  { key: 'vat', labelKey: 'vat', subtitleKey: 'vat_reports_subtitle', icon: Calculator },
]

const getTabFromPath = (pathname) => {
  if (pathname.includes('purchases')) return 'purchases'
  if (pathname.includes('inventory')) return 'inventory'
  if (pathname.includes('vat')) return 'vat'
  return 'sales'
}

export default function OperationalReports() {
  const location = useLocation()
  const { t, num, formatCurrency, formatDate } = useTranslation()
  const { sales, loading: salesLoading } = useSales()
  const { purchases, loading: purchasesLoading } = usePurchases()
  const { all: products, loading: productsLoading } = useProducts()

  const [tab, setTab] = useState(() => getTabFromPath(location.pathname))

  useEffect(() => {
    setTab(getTabFromPath(location.pathname))
  }, [location.pathname])

  const salesAgg = useMemo(() => {
    const revenue = sales.reduce((s, x) => s + x.grandTotal, 0)
    const vat = sales.reduce((s, x) => s + x.vat, 0)
    const itemsSold = sales.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0)
    const byProduct = {}
    sales.forEach((x) => x.items.forEach((i) => {
      byProduct[i.name] = byProduct[i.name] || { name: i.name, qty: 0, revenue: 0 }
      byProduct[i.name].qty += i.qty
      byProduct[i.name].revenue += i.qty * i.price
    }))
    const topProducts = Object.values(byProduct).sort((a, b) => b.qty - a.qty)
    return { revenue, vat, itemsSold, topProducts }
  }, [sales])

  const purchaseAgg = useMemo(() => {
    const total = purchases.reduce((s, x) => s + x.grandTotal, 0)
    const vat = purchases.reduce((s, x) => s + x.vat, 0)
    const itemsBought = purchases.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0)
    const byProduct = {}
    purchases.forEach((x) => x.items.forEach((i) => {
      byProduct[i.name] = byProduct[i.name] || { name: i.name, qty: 0, amount: 0 }
      byProduct[i.name].qty += i.qty
      byProduct[i.name].amount += i.qty * i.price
    }))
    const topProducts = Object.values(byProduct).sort((a, b) => b.qty - a.qty)
    return { total, vat, itemsBought, topProducts }
  }, [purchases])

  const inventoryAgg = useMemo(() => {
    const units = products.reduce((s, p) => s + p.stock, 0)
    const value = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0)
    const low = products.filter((p) => p.stock <= p.minStock)
    return { units, value, low }
  }, [products])

  const statusOf = (p) => {
    if (p.stock === 0) return { key: 'status_out_of_stock', tone: 'danger' }
    if (p.stock <= p.minStock) return { key: 'status_low', tone: 'warning' }
    return { key: 'status_active', tone: 'success' }
  }

  const salesColumns = [
    { key: 'name', label: t('product'), render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'qty', label: t('qty'), align: 'right', render: (r) => num(r.qty) },
    { key: 'revenue', label: t('revenue'), align: 'right', render: (r) => formatCurrency(r.revenue) },
  ]

  const purchaseColumns = [
    { key: 'name', label: t('product'), render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'qty', label: t('qty'), align: 'right', render: (r) => num(r.qty) },
    { key: 'amount', label: t('amount'), align: 'right', render: (r) => formatCurrency(r.amount) },
  ]

  const stockColumns = [
    {
      key: 'name', label: t('product'),
      render: (r) => (
        <div>
          <span className="font-medium text-slate-900">{r.name}</span>
          <span className="block text-xs text-slate-500 font-mono">{r.sku}</span>
        </div>
      ),
    },
    { key: 'category', label: t('category') },
    {
      key: 'stock', label: t('stock'), align: 'right',
      render: (r) => <span>{num(r.stock)} <span className="text-xs text-slate-400">{r.unit}</span></span>,
    },
    { key: 'value', label: t('stock_value'), align: 'right', render: (r) => formatCurrency(r.stock * r.purchasePrice) },
    {
      key: 'status', label: t('status'), align: 'center',
      render: (r) => {
        const s = statusOf(r)
        return <Badge tone={s.tone} dot>{t(s.key)}</Badge>
      },
    },
  ]

  const stockRows = useMemo(
    () => [...products].sort((a, b) => a.stock - b.stock),
    [products]
  )

  const vatSaleColumns = [
    { key: 'id', label: t('invoice_no'), render: (r) => <span className="font-mono text-xs text-sky-700">{r.id}</span> },
    { key: 'date', label: t('date'), render: (r) => <span className="whitespace-nowrap">{formatDate(r.date)}</span> },
    { key: 'customerName', label: t('customer_name') },
    { key: 'taxable', label: t('taxable_amount'), align: 'right', render: (r) => formatCurrency(r.taxable) },
    { key: 'vat', label: t('vat'), align: 'right', render: (r) => formatCurrency(r.vat) },
    { key: 'grandTotal', label: t('grand_total'), align: 'right', render: (r) => <span className="font-medium">{formatCurrency(r.grandTotal)}</span> },
  ]

  const vatPurchaseColumns = [
    { key: 'id', label: t('invoice_no'), render: (r) => <span className="font-mono text-xs text-sky-700">{r.id}</span> },
    { key: 'date', label: t('date'), render: (r) => <span className="whitespace-nowrap">{formatDate(r.date)}</span> },
    { key: 'supplierName', label: t('supplier_name') },
    { key: 'taxable', label: t('taxable_amount'), align: 'right', render: (r) => formatCurrency(r.taxable) },
    { key: 'vat', label: t('vat'), align: 'right', render: (r) => formatCurrency(r.vat) },
    { key: 'grandTotal', label: t('grand_total'), align: 'right', render: (r) => <span className="font-medium">{formatCurrency(r.grandTotal)}</span> },
  ]

  const vatSaleRows = useMemo(
    () => sales.map((s) => ({ id: s.id, date: s.date, customerName: s.customerName, taxable: s.subtotal - s.discount, vat: s.vat, grandTotal: s.grandTotal })),
    [sales]
  )

  const vatPurchaseRows = useMemo(
    () => purchases.map((p) => ({ id: p.id, date: p.date, supplierName: p.supplierName, taxable: p.subtotal - p.discount, vat: p.vat, grandTotal: p.grandTotal })),
    [purchases]
  )

  const netVat = salesAgg.vat - purchaseAgg.vat

  const reportMeta = {
    sales: { titleKey: 'nav_sales_reports', subtitleKey: 'sales_reports_subtitle' },
    purchases: { titleKey: 'nav_purchase_reports', subtitleKey: 'purchase_reports_subtitle' },
    inventory: { titleKey: 'nav_inventory_reports', subtitleKey: 'inventory_reports_subtitle' },
    vat: { titleKey: 'nav_tax_vat_reports', subtitleKey: 'vat_reports_subtitle' },
  }

  const currentMeta = reportMeta[tab] || reportMeta.sales

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(currentMeta.titleKey)}
        subtitle={t(currentMeta.subtitleKey)}
      />

      {tab === 'sales' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title={t('total_revenue')} value={formatCurrency(salesAgg.revenue)} icon={TrendingUp} tone="brand" />
            <KpiCard title={t('invoices_issued')} value={num(sales.length)} icon={FileText} tone="sky" />
            <KpiCard title={t('products_sold')} value={num(salesAgg.itemsSold)} icon={Package} tone="emerald" />
            <KpiCard title={t('vat_collected')} value={formatCurrency(salesAgg.vat)} icon={Calculator} tone="amber" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('top_selling_products')}</h3>
            <DataTable columns={salesColumns} data={salesAgg.topProducts} loading={salesLoading} emptyTitle={t('no_records_found')} />
          </Card>
        </>
      )}

      {tab === 'purchases' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title={t('total_purchases')} value={formatCurrency(purchaseAgg.total)} icon={ShoppingBag} tone="brand" />
            <KpiCard title={t('bills_received')} value={num(purchases.length)} icon={FileText} tone="sky" />
            <KpiCard title={t('products_purchased')} value={num(purchaseAgg.itemsBought)} icon={Package} tone="emerald" />
            <KpiCard title={t('vat_paid')} value={formatCurrency(purchaseAgg.vat)} icon={Calculator} tone="amber" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('top_purchased_products')}</h3>
            <DataTable columns={purchaseColumns} data={purchaseAgg.topProducts} loading={purchasesLoading} emptyTitle={t('no_records_found')} />
          </Card>
        </>
      )}

      {tab === 'inventory' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title={t('total_products')} value={num(products.length)} icon={Package} tone="brand" />
            <KpiCard title={t('total_units')} value={num(inventoryAgg.units)} icon={Boxes} tone="sky" />
            <KpiCard title={t('stock_value')} value={formatCurrency(inventoryAgg.value)} icon={Wallet} tone="emerald" />
            <KpiCard title={t('low_stock')} value={num(inventoryAgg.low.length)} icon={AlertTriangle} tone="amber" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('stock_levels')}</h3>
            <DataTable columns={stockColumns} data={stockRows} loading={productsLoading} emptyTitle={t('no_records_found')} />
          </Card>
        </>
      )}

      {tab === 'vat' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title={t('vat_collected')} value={formatCurrency(salesAgg.vat)} icon={Calculator} tone="brand" />
            <KpiCard title={t('vat_paid')} value={formatCurrency(purchaseAgg.vat)} icon={Calculator} tone="sky" />
            <KpiCard title={t('net_vat')} value={formatCurrency(netVat)} icon={Wallet} tone="emerald" />
            <KpiCard title={t('invoices_issued')} value={num(sales.length)} icon={FileText} tone="amber" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('vat_collected')}</h3>
            <DataTable columns={vatSaleColumns} data={vatSaleRows} loading={salesLoading} emptyTitle={t('no_records_found')} />
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">{t('vat_paid')}</h3>
            <DataTable columns={vatPurchaseColumns} data={vatPurchaseRows} loading={purchasesLoading} emptyTitle={t('no_records_found')} />
          </Card>
        </>
      )}
    </div>
  )
}