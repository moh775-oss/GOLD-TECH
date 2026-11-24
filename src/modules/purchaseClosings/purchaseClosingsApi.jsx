import api from '../../lib/api'
export const purchaseClosingsApi = {
  list:    (params = {}) => api.get('/purchase-closings', { params }),
  options: () => api.get('/purchase-closings/options'),
  create:  (data) => api.post('/purchase-closings', data),
  show:    (id, params = {}) => api.get(`/purchase-closings/${id}`, { params }),
  update:  (id, data) => api.put(`/purchase-closings/${id}`, data),
  remove:  (id) => api.delete(`/purchase-closings/${id}`),
  print:   (id) => api.get(`/purchase-closings/${id}/print`),
}