import { useState } from 'react'
import { Search, Plus, Package } from 'lucide-react'
import useCategories from '../../hooks/useCategories'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ProductGrid({ products, onAddToCart }) {
  const { t, num, formatCurrency } = useTranslation()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filtered = products.filter((p) => {
    if (p.stock === 0) return false
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !category || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('pos_scan_placeholder')}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
        </div>
        {/* Category pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-thin pb-1">
          <button
            onClick={() => setCategory('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              !category ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.name)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                category === c.name ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">{t('no_products')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('try_different_search')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToCart(p)}
                className="group relative bg-white border border-slate-200 rounded-lg p-3 text-left hover:border-brand-500 hover:shadow-soft transition"
              >
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-md mb-2 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-xs text-slate-500 font-mono truncate">{p.sku}</div>
                <div className="text-sm font-medium text-slate-900 line-clamp-2 min-h-[2.5rem]">{p.name}</div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <div className="text-sm font-bold text-brand-700">{formatCurrency(p.sellingPrice)}</div>
                    <div className="text-[10px] text-slate-500">{t('stock')}: {num(p.stock)}</div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}