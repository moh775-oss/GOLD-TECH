import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'auth_session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // تحميل الجلسة من localStorage عند بدء التطبيق
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.token && parsed?.user_id && parsed?.company_id) {
          setSession(parsed)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  // الخطوة 1: التحقق من الجوال والباسورد (لجلب الفروع والسنوات المالية)
  const checkCredentials = async (mobile, password) => {
    const res = await api.post('/auth/check', { mobile, password })
    if (!res.data.success) throw new Error(res.data.message || 'بيانات غير صحيحة')
    return res.data.data
  }

  // الخطوة 2: تسجيل الدخول النهائي وحفظ الجلسة
  const login = async (mobile, password, branchId, fiscalYearId) => {
    const res = await api.post('/auth/login', {
      mobile,
      password,
      branch_id: branchId,
      fiscal_year_id: fiscalYearId,
    })
    if (!res.data.success) throw new Error(res.data.message || 'فشل تسجيل الدخول')

    const { token, user } = res.data.data
    const sessionData = {
      token,
      user_id:        user.id,
      name:           user.name,
      mobile:         user.mobile,
      email:          user.email,
      role:           user.role,
      company_id:     user.company_id,
      branch_id:      user.branch_id,
      branch_name:    user.branch_name,
      fiscal_year_id: user.fiscal_year_id,
      fiscal_year:    user.fiscal_year,
      company_name:   user.company_name,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
    setSession(sessionData)
    return sessionData
  }

  // الخروج
  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  // تحديث الفرع (لتبديل الفرع لاحقاً)
  const setBranch = (branchId, branchName) => {
    if (!session) return
    const updated = { ...session, branch_id: branchId, branch_name: branchName }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSession(updated)
  }

  // تحديث السنة المالية
  const setFiscalYear = (id, name) => {
    if (!session) return
    const updated = { ...session, fiscal_year_id: id, fiscal_year: name }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSession(updated)
  }

  const isAuthenticated = Boolean(session?.token && session?.user_id && session?.company_id)

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session,             // للتوافق مع الكود القديم
        isAuthenticated,
        loading,
        checkCredentials,
        login,
        logout,
        setBranch,
        setFiscalYear,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)