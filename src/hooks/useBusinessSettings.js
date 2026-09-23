import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function useBusinessSettings() {
  const { business, businessId } = useAuth()

  const [settings, setSettings] = useState({
    id: businessId,
    name: business?.name || '',
    address: business?.address || '',
    phone: business?.phone || '',
    email: business?.email || '',
    panVat: business?.panNumber || business?.panVat || '',
    invoicePrefix: 'INV',
    invoiceFooter: 'Thank you for your business!',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (business) {
      setSettings((prev) => ({
        ...prev,
        id: business.id || prev.id,
        name: business.name || prev.name,
        address: business.address || prev.address,
        phone: business.phone || prev.phone,
        email: business.email || prev.email,
        panVat: business.panNumber || business.panVat || prev.panVat,
      }))
    }
  }, [business])

  const fetchSettings = useCallback(async () => {
    if (!businessId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('id', businessId)
      .maybeSingle()

    if (error) {
      console.error('useBusinessSettings fetch error:', error.message)
    } else if (data) {
      setSettings({
        id: data.id,
        name: data.name || business?.name || '',
        address: data.address || business?.address || '',
        phone: data.phone || business?.phone || '',
        email: data.email || business?.email || '',
        panVat: data.pan_vat || business?.panNumber || '',
        invoicePrefix: data.invoice_prefix || 'INV',
        invoiceFooter: data.invoice_footer || 'Thank you for your business!',
      })
    }
    setLoading(false)
  }, [businessId, business])

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
    if (newData.invoicePrefix !== undefined) payload.invoice_prefix = newData.invoicePrefix
    if (newData.invoiceFooter !== undefined) payload.invoice_footer = newData.invoiceFooter

    if (businessId) {
      const { error } = await supabase
        .from('business_settings')
        .update(payload)
        .eq('id', businessId)

      if (error) {
        console.error('updateSettings error:', error.message)
        return false
      }
    }

    setSettings((prev) => ({ ...prev, ...newData }))
    return true
  }

  return { settings, loading, updateSettings, refreshSettings: fetchSettings }
}
