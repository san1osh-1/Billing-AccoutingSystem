import { useState, useMemo, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useProducts() {
  const { businessId } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', stockStatus: '' })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('useProducts fetch error:', error.message)
    } else {
      // Map snake_case DB columns → camelCase for existing UI compatibility
      setProducts(
        (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          brand: p.brand,
          purchasePrice: Number(p.purchase_price),
          sellingPrice: Number(p.selling_price),
          stock: p.stock,
          minStock: p.min_stock,
          unit: p.unit,
          vatApplicable: p.vat_applicable,
          description: p.description,
          status: p.status,
          imageUrl: p.image_url,
        }))
      )
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !filters.search ||
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.sku.toLowerCase().includes(filters.search.toLowerCase())
      const matchCategory = !filters.category || p.category === filters.category
      let matchStock = true
      if (filters.stockStatus === 'low') matchStock = p.stock > 0 && p.stock <= p.minStock
      else if (filters.stockStatus === 'critical') matchStock = p.stock > 0 && p.stock < p.minStock * 0.5
      else if (filters.stockStatus === 'out') matchStock = p.stock === 0
      else if (filters.stockStatus === 'ok') matchStock = p.stock > p.minStock
      return matchSearch && matchCategory && matchStock
    })
  }, [products, filters])

  const deriveStatus = (stock, minStock) =>
    stock === 0 ? 'Out of Stock' : stock <= minStock ? 'Low Stock' : 'Active'

  const addProduct = async (data) => {
    const payload = {
      business_id: businessId,
      name: data.name,
      sku: data.sku,
      category: data.category,
      brand: data.brand || '',
      purchase_price: Number(data.purchasePrice),
      selling_price: Number(data.sellingPrice),
      stock: Number(data.stock),
      min_stock: Number(data.minStock),
      unit: data.unit,
      vat_applicable: data.vatApplicable === true || data.vatApplicable === 'true',
      description: data.description || '',
      status: deriveStatus(Number(data.stock), Number(data.minStock)),
      image_url: data.imageUrl || '',
    }
    const { data: inserted, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single()
    if (error) { console.error('addProduct error:', error.message); return null }
    const newProduct = {
      ...data,
      id: inserted.id,
      purchasePrice: Number(inserted.purchase_price),
      sellingPrice: Number(inserted.selling_price),
      minStock: inserted.min_stock,
      vatApplicable: inserted.vat_applicable,
      imageUrl: inserted.image_url,
      status: inserted.status,
    }
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = async (id, data) => {
    const payload = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.sku !== undefined) payload.sku = data.sku
    if (data.category !== undefined) payload.category = data.category
    if (data.brand !== undefined) payload.brand = data.brand
    if (data.purchasePrice !== undefined) payload.purchase_price = Number(data.purchasePrice)
    if (data.sellingPrice !== undefined) payload.selling_price = Number(data.sellingPrice)
    if (data.stock !== undefined) payload.stock = Number(data.stock)
    if (data.minStock !== undefined) payload.min_stock = Number(data.minStock)
    if (data.unit !== undefined) payload.unit = data.unit
    if (data.vatApplicable !== undefined) payload.vat_applicable = data.vatApplicable === true || data.vatApplicable === 'true'
    if (data.description !== undefined) payload.description = data.description
    if (data.imageUrl !== undefined) payload.image_url = data.imageUrl

    const stock = data.stock !== undefined ? Number(data.stock) : null
    const minStock = data.minStock !== undefined ? Number(data.minStock) : null
    if (stock !== null && minStock !== null) {
      payload.status = deriveStatus(stock, minStock)
    }

    const { error } = await supabase.from('products').update(payload).eq('id', id).eq('business_id', businessId)
    if (error) { console.error('updateProduct error:', error.message); return }

    setProducts((prev) => prev.map((p) =>
      p.id === id
        ? {
            ...p,
            ...data,
            purchasePrice: data.purchasePrice !== undefined ? Number(data.purchasePrice) : p.purchasePrice,
            sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : p.sellingPrice,
            stock: data.stock !== undefined ? Number(data.stock) : p.stock,
            minStock: data.minStock !== undefined ? Number(data.minStock) : p.minStock,
            status: payload.status || p.status,
          }
        : p
    ))
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id).eq('business_id', businessId)
    if (error) { console.error('deleteProduct error:', error.message); return }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return { products: filtered, all: products, loading, filters, setFilters, addProduct, updateProduct, deleteProduct }
}