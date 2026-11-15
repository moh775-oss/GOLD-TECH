import api from '../../lib/api'

export const karatsApi = {
  list:   (params = {}) => api.get('/karats', { params }),
  show:   (id) => api.get(`/karats/${id}`),
  create: (data) => api.post('/karats', data),
  update: (id, data) => api.put(`/karats/${id}`, data),
  remove: (id) => api.delete(`/karats/${id}`),
  meta:   () => api.get('/karats/create'),
}