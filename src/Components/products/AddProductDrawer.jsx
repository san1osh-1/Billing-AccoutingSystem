import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import { categories, units } from '../../data/products'

const emptyForm = {
  name: '', sku: '', category: '', brand: '',
  purchasePrice: '', sellingPrice: '', stock: '',
  minStock: '', unit: 'Pcs', vatApplicable: true, description: '',
}

export default function AddProductDrawer({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const isEdit = Boolean(initial)

  if (open && prevOpen !== open) {
    setPrevOpen(open)
    if (initial) {
      setForm({
        name: initial.name, sku: initial.sku, category: initial.category, brand: initial.brand || '',
        purchasePrice: initial.purchasePrice, sellingPrice: initial.sellingPrice,
        stock: initial.stock, minStock: initial.minStock,
        unit: initial.unit, vatApplicable: initial.vatApplicable, description: initial.description || '',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.purchasePrice || Number(form.purchasePrice) < 0) e.purchasePrice = 'Enter a valid price'
    if (!form.sellingPrice || Number(form.sellingPrice) < 0) e.sellingPrice = 'Enter a valid price'
    if (Number(form.sellingPrice) < Number(form.purchasePrice)) e.sellingPrice = 'Selling price should be ≥ purchase price'
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Enter valid stock'
    if (form.minStock === '' || Number(form.minStock) < 0) e.minStock = 'Enter valid min stock'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      vatApplicable: form.vatApplicable === true || form.vatApplicable === 'true',
    })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save Changes' : 'Add Product'}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" value={form.name} onChange={set('name')} error={errors.name} required />
          <Input label="SKU" value={form.sku} onChange={set('sku')} error={errors.sku} required />
          <Select label="Category" value={form.category} onChange={set('category')} error={errors.category} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Brand" value={form.brand} onChange={set('brand')} />
          <Input label="Purchase Price (Rs.)" type="number" min="0" step="0.01" value={form.purchasePrice} onChange={set('purchasePrice')} error={errors.purchasePrice} required />
          <Input label="Selling Price (Rs.)" type="number" min="0" step="0.01" value={form.sellingPrice} onChange={set('sellingPrice')} error={errors.sellingPrice} required />
          <Input label="Opening Stock" type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} required />
          <Input label="Minimum Stock" type="number" min="0" value={form.minStock} onChange={set('minStock')} error={errors.minStock} required />
          <Select label="Unit" value={form.unit} onChange={set('unit')}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </Select>
          <Select label="VAT Applicable" value={String(form.vatApplicable)} onChange={(e) => setForm({ ...form, vatApplicable: e.target.value })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder="Optional product description..."
          />
        </div>
      </form>
    </Drawer>
  )
}