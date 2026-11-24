import api from '../../lib/api'

export const goldOpeningBalancesApi = {
  options: (params) => api.get('/gold-opening-balances/options', { params }),
  list: (params) => api.get('/gold-opening-balances', { params }),
  create: (payload) => api.post('/gold-opening-balances', payload),
  update: (id, payload) => api.put(`/gold-opening-balances/${id}`, payload),
  remove: (id) => api.delete(`/gold-opening-balances/${id}`),
}