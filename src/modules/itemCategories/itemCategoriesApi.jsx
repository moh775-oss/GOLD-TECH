import api from '../../lib/api'

export const itemCategoriesApi = {
  list:   (params = {}) => api.get('/item-categories', { params }),
  tree:   () => api.get('/item-categories/tree'),
  show:   (id) => api.get(`/item-categories/${id}`),
  create: (data) => api.post('/item-categories', data),
  update: (id, data) => api.put(`/item-categories/${id}`, data),
  remove: (id) => api.delete(`/item-categories/${id}`),
}