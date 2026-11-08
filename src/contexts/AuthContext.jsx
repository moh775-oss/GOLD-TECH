import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('auth_user')
    if (saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  // الخطوة 1: التحقق من الجوال والباسورد
  const checkCredentials = async (mobile, password) => {
    const res = await api.post('/auth/check', { mobile, password })
    if (!res.data.success) throw new Error(res.data.message)
    return res.data.data
  }

  // الخطوة 2: تسجيل الدخول بعد اختيار الفرع والسنة
  const login = async (mobile, password, branchId, fiscalYearId) => {
    const res = await api.post('/auth/login', {
      mobile,
      password,
      branch_id: branchId,
      fiscal_year_id: fiscalYearId,
    })
    if (!res.data.success) throw new Error(res.data.message)

    localStorage.setItem('auth_token', res.data.data.token)
    localStorage.setItem('auth_user', JSON.stringify(res.data.data.user))
    setUser(res.data.data.user)
    return res.data.data.user
  }

  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  const switchBranch = (branchId) => {
    const updated = { ...user, branch_id: branchId }
    localStorage.setItem('auth_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, checkCredentials, login, logout, switchBranch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)