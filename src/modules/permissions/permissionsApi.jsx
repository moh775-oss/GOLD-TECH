import api from '../../lib/api'

export const permissionsApi = {
  list:               () => api.get('/permissions'),
  tree:               () => api.get('/permissions/tree'),
  getUserPermissions: (userId) => api.get(`/permissions/user/${userId}`),
  saveUserPermissions:(userId, data) => api.post(`/permissions/user/${userId}`, data),
}