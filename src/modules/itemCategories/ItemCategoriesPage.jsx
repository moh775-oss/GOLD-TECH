import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card } from 'antd'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { itemCategoriesApi } from './itemCategoriesApi.jsx'
import ItemCategoryFormModal from './ItemCategoryFormModal.jsx'
import ItemCategoryViewModal from './ItemCategoryViewModal.jsx'
import { buildItemCategoryColumns } from './itemCategoriesConfig.jsx'





export default function ItemCategoriesPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await itemCategoriesApi.list()
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message || 'فشل الجلب')
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit   = (row) => { setEditing(row); setFormOpen(true) }
  const openView   = (row) => { setViewing(row); setViewOpen(true) }

  const onDelete = async (row) => {
    try {
      const res = await itemCategoriesApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الحذف'); fetchData() }
      else notify.error(res.data.message || 'فشل الحذف')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }

  const onSaved = () => { setFormOpen(false); fetchData() }

  const columns = useMemo(
    () => buildItemCategoryColumns({ onEdit: openEdit, onDelete, onView: openView, categories: data }),
    [data]
  )

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <DataTable
          title="إدارة مجموعات الأصناف"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
               إضافة مجموعة
            </button>
          }
        />
      </Card>
      <ItemCategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} category={editing} categories={data} onSaved={onSaved} />
      <ItemCategoryViewModal open={viewOpen} onClose={() => setViewOpen(false)} category={viewing} categories={data} />
    </div>
  )
}