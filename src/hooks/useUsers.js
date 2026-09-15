import { useState, useEffect } from 'react'
import { initialUsers, roles } from '../data/users'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setUsers(initialUsers)
      setRolesList(roles)
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [])

  const addUser = (userData) => {
    const role = rolesList.find((r) => r.id === Number(userData.roleId))
    const newUser = {
      ...userData,
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      roleName: role?.name || 'User',
      status: 'Active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setUsers((prev) => [newUser, ...prev])
    return newUser
  }

  const updateUser = (id, data) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u
      const role = rolesList.find((r) => r.id === Number(data.roleId))
      return { ...u, ...data, roleName: role?.name || u.roleName }
    }))
  }

  const toggleUserStatus = (id) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ))
  }

  return { users, roles: rolesList, loading, addUser, updateUser, toggleUserStatus }
}