import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card } from 'antd'
import DataTable from '../../components/ReportGenerator'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext'
import { contactsApi } from './contactsApi.jsx'
import ContactFormModal from './ContactFormModal'
import ContactViewModal from './ContactViewModal'
import { buildContactColumns } from './contactsConfig.jsx'

export default function CustomersPage() {
  const { session } = useAuth()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

  // ===== جلب البيانات =====
  const fetchData = useCallback(async () => {
    setLoading(true)
    const branchId = session?.branch_id
    try {
      const res = await contactsApi.list({
        branch_id:  branchId, 
        contact_type: 'customer',
      })
      if (res.data.success) {
        setData(res.data.data || [])
      } else {
        notify.error(res.data.message || 'فشل الجلب')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally {
      setLoading(false)
    }
  }, [session?.branch_id])

  useEffect(() => { fetchData() }, [fetchData])

  // ===== الأزرار =====
  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit   = (row) => { setEditing(row); setFormOpen(true) }
  const openView   = (row) => { setViewing(row); setViewOpen(true) }

  const onDelete = async (row) => {
    
    try {
      const res = await contactsApi.remove(row.id)
      if (res.data.success) {
        notify.success(res.data.message || 'تم الحذف')
        fetchData()
      } else {
        notify.error(res.data.message || 'فشل الحذف')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحذف')
    }
  }

  const onSaved = () => {
    setFormOpen(false)
    fetchData()
  }

  const columns = useMemo(
    () => buildContactColumns({
      type: 'customer',
      onEdit: openEdit,
      onDelete,
      onView: openView,
    }),
    []
  )

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <DataTable
          title="إدارة العملاء"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الجوال"
          showReload
          onReload={fetchData}
          extraActions={
            <button
              onClick={openCreate}
              style={{
                background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)',
              }}
            >
               إضافة عميل
            </button>
          }
        />
      </Card>

      <ContactFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        contact={editing}
        type="customer"
        onSaved={onSaved}
      />

      <ContactViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        contact={viewing}
      />
    </div>
  )
}