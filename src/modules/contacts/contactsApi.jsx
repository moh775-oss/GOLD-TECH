// src/modules/contacts/contactsApi.js
import api from '../../lib/api'

export const contactsApi = {
  list: (params = {}) =>
    api.get('/contacts', { params }),

  show: (id) =>
    api.get(`/contacts/${id}`),

  create: (data) =>
    api.post('/contacts', data),

  update: (id, data) =>
    api.put(`/contacts/${id}`, data),

  remove: (id) =>
    api.delete(`/contacts/${id}`),
}