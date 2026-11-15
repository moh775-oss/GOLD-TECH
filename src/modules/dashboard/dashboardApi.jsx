import api from '../../lib/api'

export const dashboardApi = {
  stats: (params = {}) => api.get('/dashboard/stats', { params }),
}