import api from '../../lib/api'

export const costCentersApi = {
  list:   (params = {}) => api.get('/cost-centers', { params }),
  show:   (id) => api.get(`/cost-centers/${id}`),
  create: (data) => api.post('/cost-centers', data),
  update: (id, data) => api.put(`/cost-centers/${id}`, data),
  remove: (id) => api.delete(`/cost-centers/${id}`),
}