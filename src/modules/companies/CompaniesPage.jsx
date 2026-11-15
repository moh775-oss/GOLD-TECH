import { useEffect, useState, useCallback } from 'react'
import { Card, Button, Space, Tag, Modal, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LoginOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import DataTable from '../../components/ReportGenerator'
import notify from '../../lib/notify.jsx'
import api from '../../lib/api'
import CompanyFormModal from './CompanyFormModal.jsx'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CompaniesPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/companies')
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message)
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (row) => { setEditing(row); setFormOpen(true) }

  const onDelete = (row) => {
    Modal.confirm({
      title: 'تعطيل الشركة؟',
      content: `هل تريد تعطيل "${row.name}"؟ (لن تُحذف البيانات، لكن الشركة تُعطّل)`,
      okText: 'نعم، عطّل',
      cancelText: 'إلغاء',
      onOk: async () => {
        try {
          const res = await api.delete(`/companies/${row.id}`)
          if (res.data.success) { notify.success(res.data.message); fetchData() }
          else notify.error(res.data.message)
        } catch (e) { notify.error(e.response?.data?.message || 'فشل') }
      },
    })
  }

  const onForceDelete = (row) => {
    Modal.confirm({
      title: '⚠️ حذف كامل للشركة',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>هل تريد حذف <strong>"{row.name}"</strong> بالكامل؟</p>
          <p style={{ color: '#ff4d4f' }}>
            سيتم حذف <strong>كل</strong> بيانات الشركة: الفروع، المستخدمين، الحسابات، الفواتير، السندات، القيود، الأصناف... إلخ.
          </p>
          <p style={{ color: '#ff4d4f' }}>لا يمكن التراجع عن هذه العملية.</p>
        </div>
      ),
      okText: 'نعم، احذف نهائياً',
      okButtonProps: { danger: true },
      cancelText: 'إلغاء',
      onOk: async () => {
        try {
          const res = await api.delete(`/companies/${row.id}/force`)
          if (res.data.success) { notify.success(res.data.message); fetchData() }
          else notify.error(res.data.message)
        } catch (e) { notify.error(e.response?.data?.message || 'فشل') }
      },
    })
  }

  const onImpersonate = (row) => {
    Modal.confirm({
      title: 'الدخول كشركة',
      content: `هل تريد الدخول كمدير "${row.name}"؟`,
      okText: 'دخول',
      cancelText: 'إلغاء',
      onOk: async () => {
        try {
          const res = await api.post(`/companies/${row.id}/impersonate`)
          if (res.data.success) {
            const { token, user } = res.data.data
            localStorage.setItem('auth_session', JSON.stringify({
              token,
              user_id: user.id,
              name: user.name,
              mobile: user.mobile,
              email: user.email,
              role: user.role,
              company_id: user.company_id,
              branch_id: user.branch_id,
              permissions: [],
            }))
            notify.success('تم الدخول، جاري تحديث الصفحة...')
            setTimeout(() => window.location.href = '/', 800)
          } else {
            notify.error(res.data.message)
          }
        } catch (e) { notify.error(e.response?.data?.message || 'فشل') }
      },
    })
  }

  const columns = [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 160,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const isProtected = row.id === 1  // ← الشركة الرئيسية

        return (
          <Space size={4}>
            <Tooltip title="تعديل">
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
            </Tooltip>

            <Tooltip title={isProtected ? 'الشركة الرئيسية محمية' : 'دخول كشركة'}>
              <Button
                size="small"
                type="primary"
                icon={<LoginOutlined />}
                onClick={() => onImpersonate(row)}
                disabled={isProtected}
              />
            </Tooltip>

            <Tooltip title={isProtected ? 'الشركة الرئيسية محمية' : 'تعطيل'}>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(row)}
                disabled={isProtected}
              />
            </Tooltip>

            <Tooltip title={isProtected ? 'الشركة الرئيسية محمية' : 'حذف كامل'}>
              <Button
                size="small"
                danger
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => onForceDelete(row)}
                disabled={isProtected}
              >
                حذف
              </Button>
            </Tooltip>
          </Space>
        )
      },
    },
    { key: 'id',     label: 'الرقم',   width: 70,  align: 'center' },
    { key: 'name',   label: 'الاسم',   width: 200, sortable: true, align: 'center' },
    { key: 'mobile', label: 'الجوال',  width: 140, align: 'center' },
    { key: 'email',  label: 'البريد',  width: 180, align: 'center', render: (v) => v || '—' },
    {
      key: 'subscription_status',
      label: 'الاشتراك',
      width: 120,
      align: 'center',
      render: (v) => {
        const map = {
          active:    { color: 'green',  label: 'نشط' },
          trial:     { color: 'blue',   label: 'تجريبي' },
          expired:   { color: 'red',    label: 'منتهي' },
          suspended: { color: 'orange', label: 'موقوف' },
        }
        const m = map[v] || { color: 'default', label: v }
        return <Tag color={m.color}>{m.label}</Tag>
      },
    },
    {
      key: 'subscription_end',
      label: 'تاريخ الانتهاء',
      width: 140,
      align: 'center',
      render: (v) => v ? String(v).slice(0, 10) : '—',
    },
    { key: 'branches_count',   label: 'الفروع',       width: 90,  align: 'center' },
    { key: 'users_count',      label: 'المستخدمون',   width: 110, align: 'center' },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 90,
      align: 'center',
      render: (v) => v ? <Tag color="green">مفعّل</Tag> : <Tag color="red">معطّل</Tag>,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <DataTable
          title="إدارة الشركات"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الجوال"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
              <PlusOutlined /> إضافة شركة
            </button>
          }
        />
      </Card>

      <CompanyFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        company={editing}
        onSaved={() => { setFormOpen(false); fetchData() }}
      />
    </div>
  )
}