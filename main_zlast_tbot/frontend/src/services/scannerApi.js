import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createScannerJob = async (jobData) => {
  const response = await api.post('/scanner/jobs', jobData)
  return response.data
}

export const getScannerJobs = async (limit = 50) => {
  const response = await api.get('/scanner/jobs', { params: { limit } })
  return response.data.jobs || []
}

export const getScannerJob = async (jobId) => {
  const response = await api.get(`/scanner/jobs/${jobId}`)
  return response.data.job
}

export const cancelScannerJob = async (jobId) => {
  const response = await api.post(`/scanner/jobs/${jobId}/cancel`)
  return response.data
}

export const getScannerAssets = async (jobId, assetType = null) => {
  const params = assetType ? { type: assetType } : {}
  const response = await api.get(`/scanner/jobs/${jobId}/assets`, { params })
  return response.data.assets || []
}

export const getScannerTechnologies = async (jobId) => {
  const response = await api.get(`/scanner/jobs/${jobId}/technologies`)
  return response.data.technologies || []
}

export const getScannerUrls = async (jobId) => {
  const response = await api.get(`/scanner/jobs/${jobId}/urls`)
  return response.data.urls || []
}

export const getScannerEndpoints = async (jobId) => {
  const response = await api.get(`/scanner/jobs/${jobId}/endpoints`)
  return response.data.endpoints || []
}

export const getScannerFindings = async (jobId, filters = {}) => {
  const response = await api.get(`/scanner/jobs/${jobId}/findings`, { params: filters })
  return response.data.findings || []
}

export const getScannerFinding = async (findingId) => {
  const response = await api.get(`/scanner/findings/${findingId}`)
  return response.data.finding
}

export const updateFindingStatus = async (findingId, status) => {
  const response = await api.patch(`/scanner/findings/${findingId}/status`, { status })
  return response.data
}

export const getScannerEvidence = async (jobId, findingId = null) => {
  const params = findingId ? { finding_id: findingId } : {}
  const response = await api.get(`/scanner/jobs/${jobId}/evidence`, { params })
  return response.data.evidence || []
}

export const getScannerJsonReport = async (jobId) => {
  const response = await api.get(`/scanner/jobs/${jobId}/report/json`)
  return response.data
}

export const downloadScannerPdfReport = async (jobId, filename = 'security_report.pdf') => {
  const response = await api.get(`/scanner/jobs/${jobId}/report/pdf`, {
    responseType: 'blob',
  })
  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export const validateTargetScope = async (targetUrl, allowPrivate = false) => {
  const response = await api.post('/scanner/validate-target', {
    target_url: targetUrl,
    allow_private: allowPrivate,
  })
  return response.data
}

export default api
