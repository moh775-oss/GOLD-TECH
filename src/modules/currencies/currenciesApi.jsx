import api from '../../lib/api'

export const currenciesApi = {
  list:   (params = {}) => api.get('/currencies', { params }),
  show:   (id) => api.get(`/currencies/${id}`),
  create: (data) => api.post('/currencies', data),
  update: (id, data) => api.put(`/currencies/${id}`, data),
  remove: (id) => api.delete(`/currencies/${id}`),
}