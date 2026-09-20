import { useTranslation } from '../../i18n/LanguageContext'
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'

const statusOf = (p) => {
  if (p.stock === 0) return { key: 'status_out_of_stock', tone: 'danger' }
  if (p.stock <= p.minStock) return { key: 'status_low', tone: 'warning' }
  return { key: 'status_active', tone: 'success' }
}

export default function GroupedProductsDrawer({ open, onClose, title, products }) {
  const { t, num, formatCurrency } = useTranslation()

  return (
    <Drawer open={open} onClose={onClose} title={title} size="xl">
      {products.length === 0 ? (
        <p className="text-sm text-slate-500">{t('no_products')}</p>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">{t('product')}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">{t('sku')}</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">{t('stock')}</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase">{t('stock_value')}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const s = statusOf(p)
                return (
                  <tr key={p.id}>
                    <td className="px-3 py-2 font-medium text-slate-900">{p.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{num(p.stock)} <span className="text-xs text-slate-400">{p.unit}</span></td>
                    <td className="px-3 py-2 text-right">{formatCurrency(p.stock * p.purchasePrice)}</td>
                    <td className="px-3 py-2"><Badge tone={s.tone} dot>{t(s.key)}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Drawer>
  )
}
