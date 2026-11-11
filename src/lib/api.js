import axios from 'axios'

const API_BASE = 'https://cd-gold-tech-api.ethiodeploy.app/api'
// const API_BASE = 'http://127.0.0.1:8000/api'

const STORAGE_KEY = 'auth_session'   // ← نفس المفتاح اللي AuthContext بيستخدمه

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})


const getToken = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    return session?.token || null
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


const AUTH_ENDPOINTS = ['/auth/check', '/auth/login', '/auth/register']

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url = err.config?.url || ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => url.includes(ep))
    const token = getToken()

    
    if (status === 401 && !isAuthEndpoint && token) {
      localStorage.removeItem(STORAGE_KEY)
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api