import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, Select, Button, Row, Col } from 'antd'
import { PlusOutlined, ClearOutlined } from '@ant-design/icons'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { karatsApi } from './karatsApi.jsx'
import KaratFormModal from './KaratFormModal.jsx'
import { buildKaratColumns } from './karatsConfig.jsx'

export default function KaratsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [filters, setFilters] = useState({
    metal_type: undefined,
    is_active: undefined,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.metal_type) params.metal_type = filters.metal_type
      if (filters.is_active !== undefined) params.is_active = filters.is_active

      const res = await karatsApi.list(params)
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message)
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (row) => { setEditing(row); setFormOpen(true) }

  const onDelete = async (row) => {
    try {
      const res = await karatsApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message); fetchData() }
      else notify.error(res.data.message)
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }

  const onSaved = () => { setFormOpen(false); fetchData() }
  const resetFilters = () => setFilters({ metal_type: undefined, is_active: undefined })

  const columns = useMemo(
    () => buildKaratColumns({ onEdit: openEdit, onDelete }),
    []
  )

  const hasFilters = filters.metal_type || filters.is_active !== undefined

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="items-filters" style={{ marginBottom: 16 }}>
          <Row gutter={[8, 8]}>
            <Col xs={12} md={6}>
              <Select
                allowClear
                placeholder="نوع المعدن"
                style={{ width: '100%' }}
                value={filters.metal_type}
                onChange={(v) => setFilters({ ...filters, metal_type: v })}
                options={[
                  { value: 'gold',   label: 'ذهب' },
                  { value: 'silver', label: 'فضة' },
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
          title="إدارة العيارات"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
              <PlusOutlined /> إضافة عيار
            </button>
          }
        />
      </Card>

      <KaratFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        karat={editing}
        onSaved={onSaved}
      />
    </div>
  )
}