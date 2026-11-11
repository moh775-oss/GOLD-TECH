import api from '../../lib/api'

export const taxesApi = {
  list:   (params = {}) => api.get('/taxes', { params }),
  show:   (id) => api.get(`/taxes/${id}`),
  create: (data) => api.post('/taxes', data),
  update: (id, data) => api.put(`/taxes/${id}`, data),
  remove: (id) => api.delete(`/taxes/${id}`),
}