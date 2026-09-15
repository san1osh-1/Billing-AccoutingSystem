import { Minus, Plus, Trash2, User, ShoppingBag } from 'lucide-react'
import { calcCartTotals, paymentMethods } from '../../utils/cart'
import { formatCurrency } from '../../utils/format'
import Button from '../ui/Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function CartPanel({
  cart, customers, selectedCustomerId, setSelectedCustomerId,
  extraDiscount, setExtraDiscount, paymentMethod, setPaymentMethod,
  onUpdateQty, onRemove, onCompleteSale, onClear,
}) {
  const { t } = useTranslation()
  const totals = calcCartTotals(cart, extraDiscount)
  const canComplete = cart.length > 0 && paymentMethod &&
    (paymentMethod !== 'credit' || selectedCustomerId)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            {t('current_sale')}
          </h3>
          {cart.length > 0 && (
            <button onClick={onClear} className="text-xs text-rose-600 hover:text-rose-700 font-medium">
              {t('clear_all')}
            </button>
          )}
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={selectedCustomerId || ''}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          >
            <option value="">{t('walk_in_customer')}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">{t('cart_empty')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('add_products_start_sale')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-40"
                      title={item.quantity >= item.maxStock ? t('max_stock_reached') : ''}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    aria-label={t('remove_item')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals & payment */}
      {cart.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t('subtotal')}</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>{t('discount')}</span>
                <span>−{formatCurrency(totals.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>{t('vat_13')}</span>
              <span>{formatCurrency(totals.vat)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>{t('grand_total')}</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>

          {/* Discount input */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">{t('extra_discount')}</label>
            <input
              type="number"
              min="0"
              value={extraDiscount}
              onChange={(e) => setExtraDiscount(Number(e.target.value) || 0)}
              className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          {/* Payment methods */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">{t('payment_method')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {paymentMethods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key)}
                  className={`h-9 rounded-md text-xs font-medium transition border ${
                    paymentMethod === m.key
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="mr-1">{m.icon}</span>
                  {t('method_' + m.key)}
                </button>
              ))}
            </div>
            {paymentMethod === 'credit' && !selectedCustomerId && (
              <p className="text-xs text-rose-600 mt-2">⚠ {t('credit_customer_warning')}</p>
            )}
          </div>

          <Button
            onClick={onCompleteSale}
            disabled={!canComplete}
            className="w-full"
            size="lg"
          >
            {t('complete_sale')} — {formatCurrency(totals.grandTotal)}
          </Button>
        </div>
      )}
    </div>
  )
}