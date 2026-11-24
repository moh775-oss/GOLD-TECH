import api from '../../../lib/api'

export const paymentVouchersApi = {
  list:      (params = {}) => api.get('/payment-vouchers', { params }),
  show:      (id, params = {}) => api.get(`/payment-vouchers/${id}`, { params }),
  create:    (data) => api.post('/payment-vouchers', data),
  update:    (id, data) => api.put(`/payment-vouchers/${id}`, data),
  remove:    (id) => api.delete(`/payment-vouchers/${id}`),
  post:      (id) => api.post(`/payment-vouchers/${id}/post`),
  print:     (id) => api.get(`/payment-vouchers/${id}/print`),
  options: () => api.get('/payment-vouchers/options'),
  nextDocNo: (branch_id) => api.get('/payment-vouchers/create', { params: { branch_id } }),
}