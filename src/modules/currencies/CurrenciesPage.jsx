import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card } from 'antd'
import DataTable from '../../components/ReportGenerator'
import notify from '../../lib/notify.jsx'
import { currenciesApi } from './currenciesApi.jsx'
import CurrencyFormModal from './CurrencyFormModal.jsx'
import CurrencyViewModal from './CurrencyViewModal.jsx'
import { buildCurrencyColumns } from './currenciesConfig.jsx'

export default function CurrenciesPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await currenciesApi.list()
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
      const res = await currenciesApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الحذف'); fetchData() }
      else notify.error(res.data.message || 'فشل الحذف')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }

  const onSaved = () => { setFormOpen(false); fetchData() }
  const columns = useMemo(() => buildCurrencyColumns({ onEdit: openEdit, onDelete, onView: openView }), [])

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <DataTable
          title="إدارة العملات"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الكود"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
              + إضافة عملة
            </button>
          }
        />
      </Card>
      <CurrencyFormModal open={formOpen} onClose={() => setFormOpen(false)} currency={editing} onSaved={onSaved} />
      <CurrencyViewModal open={viewOpen} onClose={() => setViewOpen(false)} currency={viewing} />
    </div>
  )
}