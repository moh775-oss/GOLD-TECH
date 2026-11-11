import api from '../../lib/api'

export const branchesApi = {
  list:   (params = {}) => api.get('/branches', { params }),
  show:   (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  remove: (id) => api.delete(`/branches/${id}`),
}