import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const feedbackAPI = {
  getAll: (params = {}) => apiClient.get('/feedback', { params }),
  getById: (id) => apiClient.get(`/feedback/${id}`),
  create: (data) => apiClient.post('/feedback', data),
  update: (id, data) => apiClient.put(`/feedback/${id}`, data),
  delete: (id) => apiClient.delete(`/feedback/${id}`),
  search: (params) => apiClient.get('/search', { params }),
  getStats: () => apiClient.get('/feedback/stats'),
}

export default apiClient
