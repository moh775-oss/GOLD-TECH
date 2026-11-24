import api from '../../../lib/api'

export const receiptVouchersApi = {
  list:      (params = {}) => api.get('/receipt-vouchers', { params }),
  show:      (id, params = {}) => api.get(`/receipt-vouchers/${id}`, { params }),
  create:    (data) => api.post('/receipt-vouchers', data),
  update:    (id, data) => api.put(`/receipt-vouchers/${id}`, data),
  remove:    (id) => api.delete(`/receipt-vouchers/${id}`),
  post:      (id) => api.post(`/receipt-vouchers/${id}/post`),
  print:     (id) => api.get(`/receipt-vouchers/${id}/print`),
  options: () => api.get('/receipt-vouchers/options'),
  nextDocNo: (branch_id) => api.get('/receipt-vouchers/create', { params: { branch_id } }),
}