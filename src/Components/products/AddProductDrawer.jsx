import { useState, useRef } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import useCategories from '../../hooks/useCategories'
import { units } from '../../data/products'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Upload, Image as ImageIcon, X, Plus } from 'lucide-react'

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  brand: '',
  purchasePrice: '',
  sellingPrice: '',
  stock: '',
  minStock: '',
  unit: 'Pcs',
  vatApplicable: true,
  description: '',
  imageUrl: '',
}

export default function AddProductDrawer({ open, onClose, onSubmit, initial }) {
  const { t } = useTranslation()
  const { categories, addCategory } = useCategories()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prevOpen, setPrevOpen] = useState(open)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [catError, setCatError] = useState('')
  const fileInputRef = useRef(null)
  const isEdit = Boolean(initial)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (initial) {
      setForm({
        name: initial.name,
        sku: initial.sku,
        category: initial.category,
        brand: initial.brand || '',
        purchasePrice: initial.purchasePrice,
        sellingPrice: initial.sellingPrice,
        stock: initial.stock,
        minStock: initial.minStock,
        unit: initial.unit,
        vatApplicable: initial.vatApplicable,
        description: initial.description || '',
        imageUrl: initial.imageUrl || '',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
    setUploadError('')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError('')
    try {
      const url = await uploadToCloudinary(file, 'karobar/products')
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch (err) {
      console.error('Product image upload failed:', err)
      setUploadError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = t('required_product_name')
    if (!form.sku.trim()) e.sku = t('required_sku')
    if (!form.category) e.category = t('required_category')
    if (!form.purchasePrice || Number(form.purchasePrice) < 0) e.purchasePrice = t('valid_price')
    if (!form.sellingPrice || Number(form.sellingPrice) < 0) e.sellingPrice = t('valid_price')
    if (Number(form.sellingPrice) < Number(form.purchasePrice)) e.sellingPrice = t('selling_ge_purchase')
    if (form.stock === '' || Number(form.stock) < 0) e.stock = t('valid_stock')
    if (form.minStock === '' || Number(form.minStock) < 0) e.minStock = t('valid_min_stock')
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
      imageUrl: form.imageUrl || '',
    })
    onClose()
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const quickAddCategory = async () => {
    const name = newCategory.trim()
    if (!name) {
      setCatError(t('category_name_required'))
      return
    }
    const created = await addCategory(name)
    setForm((prev) => ({ ...prev, category: created?.name || name }))
    setNewCategory('')
    setAddingCategory(false)
    setCatError('')
  }

  const categoryOptions = new Set(categories.map((c) => c.name))

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? t('edit_product') : t('add_new_product')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{isEdit ? t('save_changes') : t('add_product')}</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Image</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <Button
                type="button"
                variant="secondary"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : form.imageUrl ? 'Change Image' : 'Upload Image'}
              </Button>
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                  className="text-xs text-rose-600 hover:underline block mt-1"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
          {uploadError && (
            <p className="text-xs text-rose-600 mt-1">{uploadError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('product_name')} value={form.name} onChange={set('name')} error={errors.name} required />
          <Input label={t('sku')} value={form.sku} onChange={set('sku')} error={errors.sku} required />
          <div className="space-y-1.5">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Select label={t('category')} value={form.category} onChange={set('category')} error={errors.category} required>
                  <option value="">{t('select_category')}</option>
                  {form.category && !categoryOptions.has(form.category) && <option value={form.category}>{form.category}</option>}
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </Select>
              </div>
              <button
                type="button"
                onClick={() => { setAddingCategory((v) => !v); setNewCategory(''); setCatError('') }}
                className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border transition ${
                  addingCategory ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-slate-200 text-slate-500 hover:border-brand-500 hover:text-brand-600'
                }`}
                aria-label={t('add_category')}
                title={t('add_category')}
              >
                {addingCategory ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
            {addingCategory && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => { setNewCategory(e.target.value); setCatError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && quickAddCategory()}
                  placeholder={t('new_category')}
                  className="h-9 min-w-0 flex-1 px-2 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Button type="button" size="sm" onClick={quickAddCategory}>{t('add')}</Button>
              </div>
            )}
            {catError && <p className="text-xs text-rose-600">{catError}</p>}
          </div>
          <Input label={t('brand')} value={form.brand} onChange={set('brand')} />
          <Input label={t('purchase_price_rs')} type="number" min="0" step="0.01" value={form.purchasePrice} onChange={set('purchasePrice')} error={errors.purchasePrice} required />
          <Input label={t('selling_price_rs')} type="number" min="0" step="0.01" value={form.sellingPrice} onChange={set('sellingPrice')} error={errors.sellingPrice} required />
          <Input label={t('opening_stock')} type="number" min="0" value={form.stock} onChange={set('stock')} error={errors.stock} required />
          <Input label={t('minimum_stock')} type="number" min="0" value={form.minStock} onChange={set('minStock')} error={errors.minStock} required />
          <Select label={t('unit')} value={form.unit} onChange={set('unit')}>
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </Select>
          <Select label={t('vat_applicable')} value={String(form.vatApplicable)} onChange={(e) => setForm({ ...form, vatApplicable: e.target.value })}>
            <option value="true">{t('yes')}</option>
            <option value="false">{t('no')}</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('description')}</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            placeholder={t('product_description_placeholder')}
          />
        </div>
      </form>
    </Drawer>
  )
}