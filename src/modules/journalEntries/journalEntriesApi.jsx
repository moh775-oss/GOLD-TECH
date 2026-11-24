import api from '../../lib/api'

export const journalEntriesApi = {
  list:      (params = {}) => api.get('/journal-entries', { params }),
  options:   () => api.get('/journal-entries/options'),
  create:    (data) => api.post('/journal-entries', data),
  show:      (id, params = {}) => api.get(`/journal-entries/${id}`, { params }),
  update:    (id, data) => api.put(`/journal-entries/${id}`, data),
  remove:    (id) => api.delete(`/journal-entries/${id}`),
  post:      (id) => api.post(`/journal-entries/${id}/post`),
  reverse:   (id, reason = '') => api.post(`/journal-entries/${id}/reverse`, { reason }),
  print:     (id) => api.get(`/journal-entries/${id}/print`),
}