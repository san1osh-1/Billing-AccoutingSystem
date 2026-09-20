import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useBusinessSettings() {
  const [settings, setSettings] = useState({
    id: 1,
    name: 'Shrestha Traders',
    address: 'New Road, Kathmandu',
    phone: '01-4234567',
    email: 'info@shresthatraders.com',
    panVat: '602487514',
    logoUrl: '',
    invoicePrefix: 'INV',
    invoiceFooter: 'Thank you for your business!',
  })
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('useBusinessSettings fetch error:', error.message)
    } else if (data) {
      setSettings({
        id: data.id,
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        panVat: data.pan_vat || '',
        logoUrl: data.logo_url || '',
        invoicePrefix: data.invoice_prefix || 'INV',
        invoiceFooter: data.invoice_footer || '',
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = async (newData) => {
    const payload = {
      updated_at: new Date().toISOString(),
    }
    if (newData.name !== undefined) payload.name = newData.name
    if (newData.address !== undefined) payload.address = newData.address
    if (newData.phone !== undefined) payload.phone = newData.phone
    if (newData.email !== undefined) payload.email = newData.email
    if (newData.panVat !== undefined) payload.pan_vat = newData.panVat
    if (newData.logoUrl !== undefined) payload.logo_url = newData.logoUrl
    if (newData.invoicePrefix !== undefined) payload.invoice_prefix = newData.invoicePrefix
    if (newData.invoiceFooter !== undefined) payload.invoice_footer = newData.invoiceFooter

    const currentId = settings.id || 1
    const { error } = await supabase
      .from('business_settings')
      .update(payload)
      .eq('id', currentId)

    if (error) {
      console.error('updateSettings error:', error.message)
      return false
    }

    setSettings((prev) => ({
      ...prev,
      ...newData,
    }))
    return true
  }

  return { settings, loading, updateSettings, refreshSettings: fetchSettings }
}
