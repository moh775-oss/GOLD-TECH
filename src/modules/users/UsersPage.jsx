import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, Select, Button, Row, Col } from 'antd'
import { PlusOutlined, ClearOutlined } from '@ant-design/icons'
import DataTable from '../../components/ReportGenerator'
import notify from '../../lib/notify.jsx'
import { usersApi } from './usersApi.jsx'
import UserFormModal from './UserFormModal.jsx'
import { buildUserColumns } from './usersConfig.jsx'

export default function UsersPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [filters, setFilters] = useState({
    branch_id: undefined,
    role: undefined,
    is_active: undefined,
  })

  const fetchHelper = useCallback(async () => {
    try {
      const res = await usersApi.meta()
      if (res.data.success) setBranches(res.data.data.branches || [])
    } catch {}
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.branch_id) params.branch_id = filters.branch_id
      if (filters.role) params.role = filters.role
      if (filters.is_active !== undefined) params.is_active = filters.is_active

      const res = await usersApi.list(params)
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message)
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchHelper() }, [fetchHelper])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (row) => { setEditing(row); setFormOpen(true) }

  const onDelete = async (row) => {
    try {
      const res = await usersApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message); fetchData() }
      else notify.error(res.data.message)
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }

  const onToggle = async (row) => {
    try {
      const res = await usersApi.toggleActive(row.id)
      if (res.data.success) { notify.success(res.data.message); fetchData() }
      else notify.error(res.data.message)
    } catch (e) { notify.error(e.response?.data?.message || 'فشل التغيير') }
  }

  const onSaved = () => { setFormOpen(false); fetchData() }
  const resetFilters = () => setFilters({ branch_id: undefined, role: undefined, is_active: undefined })

  const columns = useMemo(
    () => buildUserColumns({ onEdit: openEdit, onDelete, onToggle }),
    []
  )

  const hasFilters = filters.branch_id || filters.role || filters.is_active !== undefined

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="items-filters" style={{ marginBottom: 16 }}>
          <Row gutter={[8, 8]}>
            <Col xs={12} md={6}>
              <Select
                allowClear
                placeholder="الفرع"
                style={{ width: '100%' }}
                value={filters.branch_id}
                onChange={(v) => setFilters({ ...filters, branch_id: v })}
                options={branches.map(b => ({ value: b.id, label: b.name }))}
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                allowClear
                placeholder="الدور"
                style={{ width: '100%' }}
                value={filters.role}
                onChange={(v) => setFilters({ ...filters, role: v })}
                options={[
                  { value: 'admin',      label: 'مدير' },
                  { value: 'accountant', label: 'محاسب' },
                  { value: 'cashier',    label: 'كاشير' },
                ]}
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                allowClear
                placeholder="الحالة"
                style={{ width: '100%' }}
                value={filters.is_active}
                onChange={(v) => setFilters({ ...filters, is_active: v })}
                options={[
                  { value: 1, label: 'نشط' },
                  { value: 0, label: 'موقوف' },
                ]}
              />
            </Col>
            {hasFilters && (
              <Col xs={12} md={6}>
                <Button icon={<ClearOutlined />} onClick={resetFilters} size="small" danger style={{ width: '100%' }}>
                  مسح الفلاتر
                </Button>
              </Col>
            )}
          </Row>
        </div>

        <DataTable
          title="إدارة المستخدمين"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الجوال أو البريد"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
              <PlusOutlined /> إضافة مستخدم
            </button>
          }
        />
      </Card>

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        user={editing}
        onSaved={onSaved}
      />
    </div>
  )
}