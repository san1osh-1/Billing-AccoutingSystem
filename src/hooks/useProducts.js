import { useState, useMemo, useEffect } from 'react'
import { initialProducts } from '../data/products'

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', stockStatus: '' })

  // Simulate API fetch
  useEffect(() => {
    const t = setTimeout(() => {
      setProducts(initialProducts)
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [])

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

  const addProduct = (data) => {
    const newProduct = {
      ...data,
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      status: data.stock === 0 ? 'Out of Stock' : data.stock <= data.minStock ? 'Low Stock' : 'Active',
    }
    setProducts((prev) => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = (id, data) => {
    setProducts((prev) => prev.map((p) =>
      p.id === id ? { ...p, ...data, status: data.stock === 0 ? 'Out of Stock' : data.stock <= data.minStock ? 'Low Stock' : 'Active' } : p
    ))
  }

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return { products: filtered, all: products, loading, filters, setFilters, addProduct, updateProduct, deleteProduct }
}