import { categories } from '../../data/products'
import { useTranslation } from '../../i18n/LanguageContext'
import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'

export default function ProductFilters({ filters, setFilters }) {
  const { t } = useTranslation()
  const clear = () => setFilters({ search: '', category: '', stockStatus: '' })

  return (
    <FilterBar
      searchValue={filters.search}
      onSearchChange={(v) => setFilters({ ...filters, search: v })}
      searchPlaceholder={t('search_name_sku')}
      onClear={clear}
    >
      <Select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="w-44"
      >
        <option value="">{t('category_all')}</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Select
        value={filters.stockStatus}
        onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
        className="w-44"
      >
        <option value="">{t('all_stock')}</option>
        <option value="ok">{t('status_in_stock')}</option>
        <option value="low">{t('low_stock')}</option>
        <option value="critical">{t('status_critical')}</option>
        <option value="out">{t('status_out_of_stock')}</option>
      </Select>
    </FilterBar>
  )
}