import api from '../../lib/api'

const log = (label, res) => console.log(`[${label}]`, res.status, res.data)

export const itemsApi = {
  list:        (params = {}) => api.get('/items', { params }),
  show:        (id) => api.get(`/items/${id}`),
  create:      (data) => api.post('/items', data),
  update:      (id, data) => api.put(`/items/${id}`, data),
  remove:      (id) => api.delete(`/items/${id}`),
  meta:        () => api.get('/items/create'),
  nextBarcode: async () => {
    try {
      const res = await api.get('/items/next-barcode')

      return res
    } catch (e) {
      console.error('[nextBarcode ERROR]', e.response?.status, e.response?.data || e.message)
      throw e
    }
  },
}