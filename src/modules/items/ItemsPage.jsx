import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, Select, Space, Col, Row, Button } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { itemsApi } from './itemsApi.jsx'
import ItemFormModal from './ItemFormModal.jsx'
import ItemViewModal from './ItemViewModal.jsx'
import { buildItemColumns } from './itemsConfig.jsx'
import api from '../../lib/api'

export default function ItemsPage() {
  const { session } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

  const [categories, setCategories] = useState([])
  const [karats, setKarats] = useState([])
  const [taxes, setTaxes] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [stores, setStores] = useState([])

  const [filters, setFilters] = useState({
    category_id: undefined,
    karat_id: undefined,
    item_type: undefined,
    gold_type: undefined,
  })

  const fetchHelperData = useCallback(async () => {
    try {
      const [catRes, karatRes, taxRes, currRes, storeRes] = await Promise.all([
        api.get('/item-categories'),
        api.get('/karats'),
        api.get('/taxes'),
        api.get('/currencies'),
        api.get('/stores'),
      ])
      if (catRes.data.success) setCategories(catRes.data.data || [])
      if (karatRes.data.success) setKarats(karatRes.data.data || [])
      if (taxRes.data.success) setTaxes(taxRes.data.data || [])
      if (currRes.data.success) setCurrencies(currRes.data.data || [])
      if (storeRes.data.success) setStores(storeRes.data.data || [])
    } catch {}
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const branch_id =session?.branch_id
    try {
      const res = await itemsApi.list({
        branch_id: branch_id,
        category_id: filters.category_id,
        karat_id: filters.karat_id,
        item_type: filters.item_type,
        gold_type: filters.gold_type,
      })
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message || 'فشل الجلب')
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [session?.branch_id, filters])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchHelperData() }, [fetchHelperData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit   = (row) => { setEditing(row); setFormOpen(true) }
  const openView   = (row) => { setViewing(row); setViewOpen(true) }

  const onDelete = async (row) => {
    try {
      const res = await itemsApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الحذف'); fetchData() }
      else notify.error(res.data.message || 'فشل الحذف')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }

  const onSaved = () => { setFormOpen(false); fetchData() }

  const resetFilters = () => {
    setFilters({ category_id: undefined, karat_id: undefined, item_type: undefined, gold_type: undefined })
  }

  const columns = useMemo(
    () => buildItemColumns({ onEdit: openEdit, onDelete, onView: openView }),
    []
  )

  const hasFilters = filters.category_id || filters.karat_id || filters.item_type || filters.gold_type

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="page-header-banner" >
         إدارة الأصناف
        </div>
        <div className="items-filters" style={{ marginBottom:'20px' }}>
  <Row gutter={[8, 8]}>
    <Col xs={12} md={6}>
      <Select
        allowClear
        placeholder="المجموعة"
        style={{ width: '100%' }}
        value={filters.category_id}
        onChange={(v) => setFilters({ ...filters, category_id: v })}
        options={categories.map(c => ({ value: c.id, label: c.parent_id ? `— ${c.name}` : c.name }))}
      />
    </Col>

    <Col xs={12} md={6}>
      <Select
        allowClear
        placeholder="العيار"
        style={{ width: '100%' }}
        value={filters.karat_id}
        onChange={(v) => setFilters({ ...filters, karat_id: v })}
        options={karats.map(k => ({ value: k.id, label: k.name }))}
      />
    </Col>

    <Col xs={12} md={6}>
      <Select
        allowClear
        placeholder="النوع"
        style={{ width: '100%' }}
        value={filters.item_type}
        onChange={(v) => setFilters({ ...filters, item_type: v })}
        options={[
          { value: 'scrap',    label: 'كسر مصاغ' },
          { value: 'pure',     label: 'ذهب صافي' },
          { value: 'worked',   label: 'مصاغ' },
          { value: 'silver',   label: 'فضة' },
          { value: 'diamond',  label: 'الماس' },
          { value: 'for_sale', label: 'للبيع' },
          { value: 'raw',      label: 'خام' },
        ]}
      />
    </Col>

    <Col xs={12} md={6}>
      <Select
        allowClear
        placeholder="نوع الذهب"
        style={{ width: '100%' }}
        value={filters.gold_type}
        onChange={(v) => setFilters({ ...filters, gold_type: v })}
        options={[
          { value: 'scrap',  label: 'كسر' },
          { value: 'worked', label: 'مصاغ' },
          { value: 'pure',   label: 'صافي' },
        ]}
      />
    </Col>

    {hasFilters && (
      <Col xs={24}>
        <Button icon={<ClearOutlined />} onClick={resetFilters} size="small" danger>
          مسح الفلاتر
        </Button>
      </Col>
    )}
  </Row>
</div>

        <DataTable
          title="إدارة الأصناف"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الكود أو الباركود"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
              إضافة صنف
            </button>
          }
        />
      </Card>

      <ItemFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        item={editing}
        onSaved={onSaved}
      />

      <ItemViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        item={viewing}
      />
    </div>
  )
}