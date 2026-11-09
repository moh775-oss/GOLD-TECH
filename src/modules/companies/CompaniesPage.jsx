import { useEffect, useState } from 'react'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import DataTable from '../../components/DataTable'
import { useNotification } from '../../contexts/NotificationContext'
import CompanyFormModal from './CompanyFormModal'
import api from '../../lib/api'

const { Title } = Typography

export default function CompaniesPage() {
  const notify = useNotification()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/companies', { params: { search } })
      if (res.data.success) setData(res.data.data)
      else notify.error(res.data.message)
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [search])

  const onDelete = async (id) => {
    try {
      const res = await api.delete(`/companies/${id}`)
      if (res.data.success) { notify.success(res.data.message); fetchData() }
      else notify.error(res.data.message)
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحذف')
    }
  }

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (row) => { setEditing(row); setModalOpen(true) }

  const columns = [
    {
      title: 'الشعار', dataIndex: 'logo_url', width: 80,
      render: (url) => url
        ? <img src={url} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }} />
        : <span style={{ color: '#bbb' }}>—</span>,
      sorter: false,
    },
    { title: 'الرقم', dataIndex: 'id', width: 70 },
    { title: 'اسم الشركة', dataIndex: 'name', width: 220 },
    { title: 'الهاتف', dataIndex: 'mobile', width: 140 },
    { title: 'البريد', dataIndex: 'email', width: 200 },
    {
      title: 'الباقة', dataIndex: 'subscription_plan', width: 110,
      render: (v) => <Tag color="gold">{v || '—'}</Tag>,
    },
    {
      title: 'الاشتراك', dataIndex: 'subscription_status', width: 120,
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
    { title: 'تاريخ الانتهاء', dataIndex: 'subscription_end', width: 130 },
    { title: 'الفروع', dataIndex: 'branches_count', width: 90 },
    { title: 'المستخدمون', dataIndex: 'users_count', width: 110 },
    {
      title: 'الحالة', dataIndex: 'is_active', width: 90,
      render: (v) => v
        ? <Tag color="green">مفعّل</Tag>
        : <Tag color="red">معطّل</Tag>,
    },
    {
      title: 'إجراءات', width: 140, fixed: 'right', sorter: false,
      render: (_, row) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(row.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <DataTable
          title="إدارة الشركات"
          columns={columns}
          dataSource={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الهاتف"
          searchValue={search}
          onSearch={setSearch}
          scrollX={1400}
          scrollY={520}
          paginated
          pageSize={20}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              إضافة شركة
            </Button>
          }
        />
      </Card>

      <CompanyFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        onSaved={() => { setModalOpen(false); fetchData() }}
      />
    </div>
  )
}