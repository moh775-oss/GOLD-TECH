import api from '../../lib/api'

export const usersApi = {
  list:           (params = {}) => api.get('/users', { params }),
  show:           (id) => api.get(`/users/${id}`),
  create:         (data) => api.post('/users', data),
  update:         (id, data) => api.put(`/users/${id}`, data),
  remove:         (id) => api.delete(`/users/${id}`),
  toggleActive:   (id) => api.post(`/users/${id}/toggle`),
  changePassword: (id, data) => api.post(`/users/${id}/password`, data),
  meta:           () => api.get('/users/create'),
  editMeta:       (id) => api.get(`/users/${id}/edit`),
}