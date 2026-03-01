const API_URL = '/api'

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return response.json()
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },
  
  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    })
    return response.json()
  }
}

export const reportAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_URL}/reports?${params}`, {
      headers: getHeaders()
    })
    return response.json()
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      headers: getHeaders()
    })
    return response.json()
  },
  
  create: async (reportData) => {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    })
    return response.json()
  },
  
  updateStatus: async (id, statusData) => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    })
    return response.json()
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    return response.json()
  },
  
  getTypes: async () => {
    const response = await fetch(`${API_URL}/reports/types`)
    return response.json()
  },
  
  getStatistics: async () => {
    const response = await fetch(`${API_URL}/reports/statistics`, {
      headers: getHeaders()
    })
    return response.json()
  }
}
