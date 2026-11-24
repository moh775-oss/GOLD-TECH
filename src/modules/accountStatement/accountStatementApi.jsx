import api from '../../lib/api'

export const accountStatementApi = {
  options: (params) => api.get('/account-statement/options', { params }),
  statement: (params) => api.get('/account-statement', { params }),
}