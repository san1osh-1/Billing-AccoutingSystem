import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useCategories() {
  const { businessId } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!businessId) {
      setCategories([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('business_id', businessId)
      .order('name', { ascending: true })
    if (error) {
      console.error('useCategories fetch error:', error.message)
    } else {
      setCategories((data || []).map((c) => ({ id: c.id, name: c.name })))
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const addCategory = async (name) => {
    const trimmed = String(name || '').trim()
    if (!trimmed) return null
    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    }
    const { data: inserted, error } = await supabase
      .from('categories')
      .insert([{ business_id: businessId, name: trimmed }])
      .select()
      .single()
    if (error) {
      console.error('addCategory error:', error.message)
      return null
    }
    const newCat = { id: inserted.id, name: inserted.name }
    setCategories((prev) => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)))
    return newCat
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id).eq('business_id', businessId)
    if (error) {
      console.error('deleteCategory error:', error.message)
      return
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return { categories, loading, addCategory, deleteCategory, refreshCategories: fetchCategories }
}