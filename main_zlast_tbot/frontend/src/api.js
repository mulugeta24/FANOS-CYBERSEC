import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password })
  return response.data
}

export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password })
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// Stats
export const getStats = async () => {
  const response = await api.get('/stats')
  return response.data
}

// Scan URL
export const scanURL = async (url) => {
  const response = await api.post('/scan', { url })
  return response.data
}

// Reports
export const getReports = async () => {
  const response = await api.get('/admin/status')
  return response.data.recent_reports || []
}

// Admin status
export const getAdminStatus = async () => {
  const response = await api.get('/admin/status')
  return response.data
}

export default api