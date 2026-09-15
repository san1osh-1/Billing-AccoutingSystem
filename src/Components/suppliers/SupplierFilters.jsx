import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'

export default function SupplierFilters({ filters, setFilters }) {
  const clear = () => setFilters({ search: '', status: '' })
  return (
    <FilterBar
      searchValue={filters.search}
      onSearchChange={(v) => setFilters({ ...filters, search: v })}
      searchPlaceholder="Search by name, phone or email..."
      onClear={clear}
    >
      <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-40">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </Select>
    </FilterBar>
  )
}