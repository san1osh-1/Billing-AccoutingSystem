import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'
import { useTranslation } from '../../i18n/LanguageContext'

export default function CustomerFilters({ filters, setFilters }) {
  const { t } = useTranslation()
  const clear = () => setFilters({ search: '', status: '' })

  return (
    <FilterBar
      searchValue={filters.search}
      onSearchChange={(v) => setFilters({ ...filters, search: v })}
      searchPlaceholder={t('search_name_phone_email')}
      onClear={clear}
    >
      <Select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="w-40"
      >
        <option value="">{t('all_status')}</option>
        <option value="Active">{t('status_active')}</option>
        <option value="Overdue">{t('status_overdue')}</option>
        <option value="Inactive">{t('status_inactive')}</option>
      </Select>
    </FilterBar>
  )
}