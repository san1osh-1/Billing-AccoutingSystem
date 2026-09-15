import { useState } from 'react'
import { ShoppingCart, Receipt } from 'lucide-react'
import useProducts from '../hooks/useProducts'
import useCustomers from '../hooks/useCustomers'
import useSales from '../hooks/useSales'
import { calcCartTotals } from '../utils/cart'
import { formatCurrency } from '../utils/format'
import PageHeader from '../Components/ui/PageHeader'
import KpiCard from '../Components/ui/KpiCard'
import ProductGrid from '../Components/pos/ProductGrid'
import CartPanel from '../Components/pos/CartPanel'
import InvoiceModal from '../Components/pos/InvoiceModal'
import { useTranslation } from '../i18n/LanguageContext'

export default function Sales() {
  const { t } = useTranslation()
  const { all: products, updateProduct } = useProducts()
  const { all: customers } = useCustomers()
  const { addSale, kpis } = useSales()

  const [cart, setCart] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [extraDiscount, setExtraDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [completedSale, setCompletedSale] = useState(null)
  const [cartTab, setCartTab] = useState(false) // mobile toggle

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.sellingPrice,
        quantity: 1,
        discount: 0,
        maxStock: product.stock,
        vatApplicable: product.vatApplicable,
      }]
    })
    setCartTab(false)
  }

  const updateQty = (id, qty) => {
    setCart((prev) => prev.map((i) => {
      if (i.id !== id) return i
      if (qty < 1) return i
      if (qty > i.maxStock) return i
      return { ...i, quantity: qty }
    }))
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => {
    setCart([]); setSelectedCustomerId(''); setExtraDiscount(0); setPaymentMethod('')
  }

  const completeSale = () => {
    const totals = calcCartTotals(cart, extraDiscount)
    const customer = customers.find((c) => c.id === Number(selectedCustomerId))
    const sale = {
      customerId: customer?.id || 0,
      customerName: customer?.name || 'Walk-in Customer',
      items: cart.map((i) => ({ productId: i.productId, name: i.name, qty: i.quantity, price: i.price, discount: i.discount || 0 })),
      subtotal: totals.subtotal,
      discount: totals.totalDiscount,
      vat: totals.vat,
      grandTotal: totals.grandTotal,
      paymentMethod,
      status: paymentMethod === 'credit' ? 'Due' : 'Paid',
      cashier: 'Ram Shrestha',
    }
    const saved = addSale(sale)

    // Decrement stock
    cart.forEach((item) => {
      const p = products.find((x) => x.id === item.productId)
      if (p) updateProduct(p.id, { stock: p.stock - item.quantity })
    })

    setCompletedSale(saved)
    clearCart()
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('sales_pos')}
        subtitle={t('sales_pos_subtitle')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard title={t('todays_sales')} value={formatCurrency(kpis.total)} icon={ShoppingCart} tone="brand" />
        <KpiCard title={t('paid')} value={formatCurrency(kpis.paid)} icon={Receipt} tone="emerald" />
        <KpiCard title={t('due')} value={formatCurrency(kpis.due)} icon={Receipt} tone="rose" />
        <KpiCard title={t('invoices')} value={String(kpis.count)} icon={Receipt} tone="sky" />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden flex gap-2 bg-white border border-slate-200 rounded-lg p-1">
        <button
          onClick={() => setCartTab(false)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition ${!cartTab ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}
        >
          {t('products')}
        </button>
        <button
          onClick={() => setCartTab(true)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition relative ${cartTab ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}
        >
          {t('cart')} {cart.length > 0 && (
            <span className="ml-1.5 inline-flex w-5 h-5 rounded-full bg-brand-600 text-white text-xs items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* POS layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: '70vh' }}>
        <div className={`lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden ${cartTab ? 'hidden lg:block' : ''}`}>
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>
        <div className={`lg:col-span-2 border border-slate-200 rounded-xl overflow-hidden ${!cartTab ? 'hidden lg:block' : ''}`} style={{ maxHeight: '75vh' }}>
          <CartPanel
            cart={cart}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
            extraDiscount={extraDiscount}
            setExtraDiscount={setExtraDiscount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCompleteSale={completeSale}
          />
        </div>
      </div>

      <InvoiceModal open={Boolean(completedSale)} onClose={() => setCompletedSale(null)} sale={completedSale} />
    </div>
  )
}