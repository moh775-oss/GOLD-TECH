import api from '../../lib/api'

export const banksApi = {
  list:   (params = {}) => api.get('/banks', { params }),
  show:   (id) => api.get(`/banks/${id}`),
  create: (data) => api.post('/banks', data),
  update: (id, data) => api.put(`/banks/${id}`, data),
  remove: (id) => api.delete(`/banks/${id}`),
}