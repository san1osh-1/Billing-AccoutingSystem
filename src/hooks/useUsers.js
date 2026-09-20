import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [
      { data: usersData, error: usersErr },
      { data: rolesData, error: rolesErr },
    ] = await Promise.all([
      supabase.from('app_users').select('*').order('created_at'),
      supabase.from('roles').select('*').order('id'),
    ])

    if (usersErr) console.error('useUsers fetch error:', usersErr.message)
    if (rolesErr) console.error('useRoles fetch error:', rolesErr.message)

    setUsers(
      (usersData || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        roleId: u.role_id,
        roleName: u.role_name,
        status: u.status,
        lastLogin: u.last_login,
        createdAt: u.created_at,
      }))
    )

    setRolesList(
      (rolesData || []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        permissions: Array.isArray(r.permissions) ? r.permissions : [],
      }))
    )

    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addUser = async (userData) => {
    const role = rolesList.find((r) => r.id === Number(userData.roleId))
    const payload = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role_id: Number(userData.roleId),
      role_name: role?.name || 'User',
      status: 'Active',
      last_login: 'Never',
    }
    const { data: inserted, error } = await supabase
      .from('app_users')
      .insert([payload])
      .select()
      .single()
    if (error) { console.error('addUser error:', error.message); return null }

    const newUser = {
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      phone: inserted.phone,
      roleId: inserted.role_id,
      roleName: inserted.role_name,
      status: inserted.status,
      lastLogin: inserted.last_login,
      createdAt: inserted.created_at,
    }
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

    const { error } = await supabase.from('app_users').update(payload).eq('id', id)
    if (error) { console.error('updateUser error:', error.message); return }

    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u
      return { ...u, ...data, roleName: role?.name || u.roleName }
    }))
  }

  const toggleUserStatus = async (id) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    const { error } = await supabase.from('app_users').update({ status: newStatus }).eq('id', id)
    if (error) { console.error('toggleUserStatus error:', error.message); return }
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u))
  }

  return { users, roles: rolesList, loading, addUser, updateUser, toggleUserStatus }
}