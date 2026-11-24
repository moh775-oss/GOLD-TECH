import api from '../../lib/api'

export const salesClosingsApi = {
  list:    (params = {}) => api.get('/sales-closings', { params }),
  options: () => api.get('/sales-closings/options'),
  create:  (data) => api.post('/sales-closings', data),
  show:    (id, params = {}) => api.get(`/sales-closings/${id}`, { params }),
  update:  (id, data) => api.put(`/sales-closings/${id}`, data),
  remove:  (id) => api.delete(`/sales-closings/${id}`),
  print:   (id) => api.get(`/sales-closings/${id}/print`),
}