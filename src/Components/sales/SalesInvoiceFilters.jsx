import { useTranslation } from '../../i18n/LanguageContext'
import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'

export default function SalesInvoiceFilters({ filters, setFilters }) {
  const { t } = useTranslation()
  const clear = () => setFilters({ search: '', status: '' })

  return (
    <FilterBar
      searchValue={filters.search}
      onSearchChange={(v) => setFilters({ ...filters, search: v })}
      searchPlaceholder={t('search_invoice_customer')}
      onClear={clear}
    >
      <Select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="w-44"
      >
        <option value="">{t('all_status')}</option>
        <option value="Paid">{t('status_paid')}</option>
        <option value="Partial">{t('status_partial')}</option>
        <option value="Due">{t('status_due')}</option>
      </Select>
    </FilterBar>
  )
}
