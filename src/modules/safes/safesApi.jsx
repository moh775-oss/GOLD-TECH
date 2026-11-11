import api from '../../lib/api'

export const safesApi = {
  list:   (params = {}) => api.get('/safes', { params }),
  show:   (id) => api.get(`/safes/${id}`),
  create: (data) => api.post('/safes', data),
  update: (id, data) => api.put(`/safes/${id}`, data),
  remove: (id) => api.delete(`/safes/${id}`),
}