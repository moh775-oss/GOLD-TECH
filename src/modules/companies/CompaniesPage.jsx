import { useState } from 'react'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import DataTable from '../../components/ReportGenerator'
import notify from '../../lib/notify'

const { Title } = Typography

/* ====== بيانات ثابتة للاختبار ====== */
const MOCK_COMPANIES = [
  {
    id: 1,
    name: 'شركة جولد تاك',
    mobile: '0551234567',
    email: 'info@goldtech.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-12-31',
    branches_count: 5,
    users_count: 24,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 2,
    name: 'مؤسسة الذهب الأصفر',
    mobile: '0559876543',
    email: 'contact@yellowgold.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-03-15',
    branches_count: 2,
    users_count: 8,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 3,
    name: 'مجوهرات الرياض',
    mobile: '0501112233',
    email: 'sales@riyadhjewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-01-01',
    branches_count: 12,
    users_count: 67,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 4,
    name: 'شركة اللؤلؤة',
    mobile: '0533445566',
    email: 'admin@lulua.sa',
    subscription_plan: 'Basic',
    subscription_status: 'expired',
    subscription_end: '2025-08-20',
    branches_count: 1,
    users_count: 3,
    is_active: 0,
    logo_url: null,
  },
  {
    id: 5,
    name: 'ذهب الشرق',
    mobile: '0566778899',
    email: 'info@eastgold.sa',
    subscription_plan: 'Premium',
    subscription_status: 'suspended',
    subscription_end: '2026-06-30',
    branches_count: 4,
    users_count: 15,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 6,
    name: 'دار المجوهرات',
    mobile: '0577889900',
    email: 'hello@daralj.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-11-11',
    branches_count: 7,
    users_count: 32,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 7,
    name: 'مشغل الأصالة',
    mobile: '0588990011',
    email: 'asala@works.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-04-01',
    branches_count: 1,
    users_count: 5,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 8,
    name: 'مجوهرات الفخامة',
    mobile: '0599001122',
    email: 'luxury@jewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-05-20',
    branches_count: 9,
    users_count: 50,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 1,
    name: 'شركة جولد تاك',
    mobile: '0551234567',
    email: 'info@goldtech.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-12-31',
    branches_count: 5,
    users_count: 24,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 2,
    name: 'مؤسسة الذهب الأصفر',
    mobile: '0559876543',
    email: 'contact@yellowgold.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-03-15',
    branches_count: 2,
    users_count: 8,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 3,
    name: 'مجوهرات الرياض',
    mobile: '0501112233',
    email: 'sales@riyadhjewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-01-01',
    branches_count: 12,
    users_count: 67,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 4,
    name: 'شركة اللؤلؤة',
    mobile: '0533445566',
    email: 'admin@lulua.sa',
    subscription_plan: 'Basic',
    subscription_status: 'expired',
    subscription_end: '2025-08-20',
    branches_count: 1,
    users_count: 3,
    is_active: 0,
    logo_url: null,
  },
  {
    id: 5,
    name: 'ذهب الشرق',
    mobile: '0566778899',
    email: 'info@eastgold.sa',
    subscription_plan: 'Premium',
    subscription_status: 'suspended',
    subscription_end: '2026-06-30',
    branches_count: 4,
    users_count: 15,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 6,
    name: 'دار المجوهرات',
    mobile: '0577889900',
    email: 'hello@daralj.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-11-11',
    branches_count: 7,
    users_count: 32,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 7,
    name: 'مشغل الأصالة',
    mobile: '0588990011',
    email: 'asala@works.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-04-01',
    branches_count: 1,
    users_count: 5,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 8,
    name: 'مجوهرات الفخامة',
    mobile: '0599001122',
    email: 'luxury@jewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-05-20',
    branches_count: 9,
    users_count: 50,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 1,
    name: 'شركة جولد تاك',
    mobile: '0551234567',
    email: 'info@goldtech.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-12-31',
    branches_count: 5,
    users_count: 24,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 2,
    name: 'مؤسسة الذهب الأصفر',
    mobile: '0559876543',
    email: 'contact@yellowgold.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-03-15',
    branches_count: 2,
    users_count: 8,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 3,
    name: 'مجوهرات الرياض',
    mobile: '0501112233',
    email: 'sales@riyadhjewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-01-01',
    branches_count: 12,
    users_count: 67,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 4,
    name: 'شركة اللؤلؤة',
    mobile: '0533445566',
    email: 'admin@lulua.sa',
    subscription_plan: 'Basic',
    subscription_status: 'expired',
    subscription_end: '2025-08-20',
    branches_count: 1,
    users_count: 3,
    is_active: 0,
    logo_url: null,
  },
  {
    id: 5,
    name: 'ذهب الشرق',
    mobile: '0566778899',
    email: 'info@eastgold.sa',
    subscription_plan: 'Premium',
    subscription_status: 'suspended',
    subscription_end: '2026-06-30',
    branches_count: 4,
    users_count: 15,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 6,
    name: 'دار المجوهرات',
    mobile: '0577889900',
    email: 'hello@daralj.sa',
    subscription_plan: 'Premium',
    subscription_status: 'active',
    subscription_end: '2026-11-11',
    branches_count: 7,
    users_count: 32,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 7,
    name: 'مشغل الأصالة',
    mobile: '0588990011',
    email: 'asala@works.sa',
    subscription_plan: 'Basic',
    subscription_status: 'trial',
    subscription_end: '2026-04-01',
    branches_count: 1,
    users_count: 5,
    is_active: 1,
    logo_url: null,
  },
  {
    id: 8,
    name: 'مجوهرات الفخامة',
    mobile: '0599001122',
    email: 'luxury@jewel.sa',
    subscription_plan: 'Enterprise',
    subscription_status: 'active',
    subscription_end: '2027-05-20',
    branches_count: 9,
    users_count: 50,
    is_active: 1,
    logo_url: null,
  },
]

export default function CompaniesPage() {

  const [data] = useState(MOCK_COMPANIES)
  const [loading] = useState(false)

  /* ====== الأزرار (تجريبية) ====== */
  const openCreate = () => notify.info?.('وضع الاختبار — إضافة شركة') || alert('إضافة شركة')
  const openEdit = (row) => alert(`تعديل: ${row.name}`)
  const onDelete = (row) => alert(`حذف: ${row.name}`)

  /* ====== الأعمدة ====== */
  const columns = [
    {
      key: 'logo_url',
      label: 'الشعار',
      width: 80,
      sortable: false,
      render: (url) =>
        url ? (
          <img src={url} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }} />
        ) : (
          <span style={{ color: '#bbb' }}>—</span>
        ),
    },
    { key: 'id', label: 'الرقم', width: 70 },
    { key: 'name', label: 'اسم الشركة', width: 220 },
    { key: 'mobile', label: 'الهاتف', width: 140 },
    { key: 'email', label: 'البريد', width: 200 },
    {
      key: 'subscription_plan',
      label: 'الباقة',
      width: 110,
      render: (v) => <Tag color="gold">{v || '—'}</Tag>,
    },
    {
      key: 'subscription_status',
      label: 'الاشتراك',
      width: 120,
      render: (v) => {
        const map = {
          active: { color: 'green', label: 'نشط' },
          trial: { color: 'blue', label: 'تجريبي' },
          expired: { color: 'red', label: 'منتهي' },
          suspended: { color: 'orange', label: 'موقوف' },
        }
        const m = map[v] || { color: 'default', label: v }
        return <Tag color={m.color}>{m.label}</Tag>
      },
    },
    { key: 'subscription_end', label: 'تاريخ الانتهاء', width: 130 },
    { key: 'branches_count', label: 'الفروع', width: 90 },
    { key: 'users_count', label: 'المستخدمون', width: 110 },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 90,
      render: (v) => (v ? <Tag color="green">مفعّل</Tag> : <Tag color="red">معطّل</Tag>),
    },
    {
      key: 'actions',
      label: 'إجراءات',
      width: 140,
      sortable: false,
      render: (_, row) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(row)} />
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
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالاسم أو الهاتف"

        />
      </Card>
    </div>
  )
}