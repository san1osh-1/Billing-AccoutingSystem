import { categories } from '../../data/products'
import FilterBar from '../ui/FilterBar'
import Select from '../ui/Select'

export default function ProductFilters({ filters, setFilters }) {
  const clear = () => setFilters({ search: '', category: '', stockStatus: '' })

  return (
    <FilterBar
      searchValue={filters.search}
      onSearchChange={(v) => setFilters({ ...filters, search: v })}
      searchPlaceholder="Search by name or SKU..."
      onClear={clear}
    >
      <Select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="w-44"
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </Select>
      <Select
        value={filters.stockStatus}
        onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
        className="w-44"
      >
        <option value="">All Stock</option>
        <option value="ok">In Stock</option>
        <option value="low">Low Stock</option>
        <option value="critical">Critical</option>
        <option value="out">Out of Stock</option>
      </Select>
    </FilterBar>
  )
}