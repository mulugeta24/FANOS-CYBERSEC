import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for all requests
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getStats = async () => {
  try {
    const response = await api.get('/stats')
    console.log('API getStats response:', response.data)
    return {
      total_checked: response.data.total_checked || 0,
      malicious_count: response.data.malicious_count || 0,
      benign_count: response.data.benign_count || 0,
      reports_by_category: response.data.reports_by_category || {},
      daily_activity: response.data.daily_activity || [],
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}

export const getReports = async (limit = 100) => {
  try {
    const response = await api.get('/reports')
    return response.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

export const getAllScans = async (limit = 1000) => {
  try {
    const response = await api.get('/scans')
    return response.data
  } catch (error) {
    console.error('Error fetching scans:', error)
    return []
  }
}

export const scanURL = async (url) => {
  try {
    console.log('[API] Scanning URL:', url)
    console.log('[API] API Base URL:', API_BASE_URL)
    console.log('[API] Full URL:', `${API_BASE_URL}/scan`)
    
    const startTime = Date.now()
    
    // Use longer timeout for URL scanning (60 seconds)
    const response = await api.post('/scan', { url }, {
      timeout: 60000  // 60 seconds for URL scanning
    })
    
    const endTime = Date.now()
    
    console.log(`[API] Scan completed in ${(endTime - startTime) / 1000}s`)
    console.log('[API] Response status:', response.status)
    console.log('[API] Response data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('[API] Scan error:', error)
    console.error('[API] Error code:', error.code)
    console.error('[API] Error message:', error.message)
    console.error('[API] Error response:', error.response?.data)
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Scan timeout - URL took too long to analyze')
    }
    throw error
  }
}

export const submitReport = async (url, reportType, mlPrediction, vtResult) => {
  try {
    const response = await api.post('/report', {
      url,
      report_type: reportType,
      ml_prediction: mlPrediction,
      vt_result: vtResult,
    })
    return response.data
  } catch (error) {
    console.error('Error submitting report:', error)
    throw error
  }
}

export const getAdminStatus = async () => {
  try {
    const response = await api.get('/admin/status')
    return response.data
  } catch (error) {
    console.error('Error fetching admin status:', error)
    throw error
  }
}

export const clearStatistics = async () => {
  try {
    const response = await api.post('/admin/clear')
    return response.data
  } catch (error) {
    console.error('Error clearing statistics:', error)
    throw error
  }
}

export const exportData = async () => {
  try {
    const response = await api.get('/admin/export', {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  }
}

export default api
