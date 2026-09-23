import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { addStaffUser } from '../services/authService'
import { roles as defaultRoles } from '../data/users'

export default function useUsers() {
  const { businessId, user: currentUser } = useAuth()
  const activeBusinessId = businessId || currentUser?.businessId || 1

  const [users, setUsers] = useState([])
  const [rolesList, setRolesList] = useState(defaultRoles)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    let fetchedUsers = []
    let fetchedRoles = []

    try {
      const [
        { data: usersData, error: usersErr },
        { data: rolesData, error: rolesErr },
      ] = await Promise.all([
        supabase.from('app_users').select('*').eq('business_id', activeBusinessId).order('created_at', { ascending: false }),
        supabase.from('roles').select('*').order('id'),
      ])

      if (usersErr) console.error('useUsers fetch error:', usersErr.message)
      if (rolesErr) console.error('useRoles fetch error:', rolesErr.message)

      if (rolesData && rolesData.length > 0) {
        fetchedRoles = rolesData.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          permissions: Array.isArray(r.permissions) ? r.permissions : [],
        }))
      }

      if (usersData && usersData.length > 0) {
        fetchedUsers = usersData.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          roleId: u.role_id,
          roleName: u.role_name,
          status: u.status || 'Active',
          permissions: Array.isArray(u.permissions) ? u.permissions : [],
          mustChangePassword: Boolean(u.must_change_password),
          isVerified: Boolean(u.is_verified),
          firstLoggedInAt: u.first_logged_in_at,
          lastLogin: u.last_login || 'Never',
          createdAt: u.created_at,
        }))
      }
    } catch (err) {
      console.error('Error fetching users from Supabase:', err)
    }

    setRolesList(fetchedRoles.length > 0 ? fetchedRoles : defaultRoles)
    setUsers(fetchedUsers)
    setLoading(false)
  }, [activeBusinessId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addUser = async (userData) => {
    const role = rolesList.find((r) => r.id === Number(userData.roleId))
    const payload = {
      businessId: activeBusinessId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      roleId: Number(userData.roleId),
      roleName: role?.name || 'User',
      permissions: userData.permissions && userData.permissions.length > 0 ? userData.permissions : (role?.permissions || []),
    }

    let newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      roleId: Number(userData.roleId),
      roleName: role?.name || 'User',
      status: 'Active',
      permissions: payload.permissions,
      mustChangePassword: true,
      isVerified: false,
      firstLoggedInAt: null,
      lastLogin: 'Never',
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await addStaffUser(payload)
      if (res && res.user) {
        newUser = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          roleId: res.user.role_id,
          roleName: res.user.role_name,
          status: res.user.status || 'Active',
          permissions: res.user.permissions || [],
          mustChangePassword: true,
          isVerified: false,
          firstLoggedInAt: null,
          lastLogin: 'Never',
          createdAt: res.user.created_at || new Date().toISOString(),
        }
      }
    } catch (err) {
      console.warn('Backend API addStaffUser failed or offline, adding locally:', err.message)
      // Try direct Supabase fallback if API fails
      try {
        const fallbackPayload = {
          business_id: activeBusinessId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          role_id: Number(userData.roleId),
          role_name: role?.name || 'User',
          permissions: payload.permissions,
          status: 'Active',
          is_verified: false,
          must_change_password: true,
          last_login: 'Never',
        }
        const { data: inserted } = await supabase
          .from('app_users')
          .insert([fallbackPayload])
          .select()
          .single()
        if (inserted) {
          newUser.id = inserted.id
        }
      } catch (sbErr) {
        console.warn('Direct Supabase insert also failed:', sbErr.message)
      }
    }

    // Always update local state so user immediately shows in table!
    setUsers((prev) => [newUser, ...prev])
    return newUser
  }

  const updateUser = async (id, data) => {
    const role = rolesList.find((r) => r.id === Number(data.roleId))
    const payload = {}
    if (data.name !== undefined) payload.name = data.name
    if (data.email !== undefined) payload.email = data.email
    if (data.phone !== undefined) payload.phone = data.phone
    if (data.roleId !== undefined) {
      payload.role_id = Number(data.roleId)
      payload.role_name = role?.name || data.roleName || ''
    }
    if (data.permissions !== undefined) payload.permissions = data.permissions

    try {
      await supabase.from('app_users').update(payload).eq('id', id).eq('business_id', activeBusinessId)
    } catch (err) {
      console.warn('updateUser Supabase error:', err.message)
    }

    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u
      return { ...u, ...data, roleName: role?.name || u.roleName }
    }))
  }

  const toggleUserStatus = async (id) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await supabase.from('app_users').update({ status: newStatus }).eq('id', id).eq('business_id', activeBusinessId)
    } catch (err) {
      console.warn('toggleUserStatus Supabase error:', err.message)
    }
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u))
  }

  return { users, roles: rolesList, loading, fetchAll, addUser, updateUser, toggleUserStatus }
}