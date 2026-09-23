import { createContext, useContext, useState, useEffect } from 'react'
import { loginAccount, registerAccount } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hisaabkit_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [business, setBusiness] = useState(() => {
    try {
      const saved = localStorage.getItem('hisaabkit_business')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('hisaabkit_token') || null)

  const isAuthenticated = Boolean(user && token)

  // The business_id used to scope all Supabase queries
  const businessId = business?.id || user?.businessId || null

  useEffect(() => {
    if (user) {
      localStorage.setItem('hisaabkit_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('hisaabkit_user')
    }
  }, [user])

  useEffect(() => {
    if (business) {
      localStorage.setItem('hisaabkit_business', JSON.stringify(business))
    } else {
      localStorage.removeItem('hisaabkit_business')
    }
  }, [business])

  useEffect(() => {
    if (token) {
      localStorage.setItem('hisaabkit_token', token)
    } else {
      localStorage.removeItem('hisaabkit_token')
    }
  }, [token])

  const login = async (email, password) => {
    const res = await loginAccount(email, password)
    if (res.user) setUser(res.user)
    if (res.business) setBusiness(res.business)
    if (res.token) setToken(res.token)
    return res
  }

  const signup = async (signupData) => {
    const res = await registerAccount(signupData)
    if (res.user) setUser(res.user)
    if (res.business) setBusiness(res.business)
    if (res.token) setToken(res.token)
    return res
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setBusiness(null)
    localStorage.removeItem('hisaabkit_user')
    localStorage.removeItem('hisaabkit_token')
    localStorage.removeItem('hisaabkit_business')
  }

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('hisaabkit_user', JSON.stringify(updated))
      return updated
    })
  }

  const updateBusiness = (updates) => {
    setBusiness((prev) => ({ ...prev, ...updates }))
  }

  /**
   * Check if logged in user has permission for a specific feature key
   * @param {string} permKey
   */
  const hasPermission = (permKey) => {
    if (!user) return false
    // Always allow dashboard and settings/profile basic view
    if (permKey === 'dashboard') return true
    if (user.roleName === 'Owner' || user.permissions?.includes('all')) return true
    if (!Array.isArray(user.permissions)) return false
    return user.permissions.includes(permKey)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        businessId,
        token,
        isAuthenticated,
        mustChangePassword: Boolean(user?.mustChangePassword),
        isVerified: user?.isVerified !== false, // Default true for owners, check for staff
        hasPermission,
        login,
        signup,
        logout,
        updateUser,
        updateBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
