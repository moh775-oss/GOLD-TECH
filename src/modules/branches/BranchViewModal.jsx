import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function BranchViewModal({ open, onClose, branch }) {
  if (!branch) return null
  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${branch.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الرقم">{branch.id}</Descriptions.Item>
        <Descriptions.Item label="الاسم">{branch.name}</Descriptions.Item>
        <Descriptions.Item label="الكود">{branch.code || '—'}</Descriptions.Item>
        <Descriptions.Item label="الهاتف">{branch.phone || '—'}</Descriptions.Item>
        <Descriptions.Item label="الجوال">{branch.mobile || '—'}</Descriptions.Item>
        <Descriptions.Item label="البريد">{branch.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="المدينة">{branch.city || '—'}</Descriptions.Item>
        <Descriptions.Item label="الحي">{branch.district || '—'}</Descriptions.Item>
        <Descriptions.Item label="الشارع">{branch.street || '—'}</Descriptions.Item>
        <Descriptions.Item label="رقم المبنى">{branch.building_no || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرمز البريدي">{branch.postal_code || '—'}</Descriptions.Item>
        <Descriptions.Item label="العنوان" span={2}>{branch.address || '—'}</Descriptions.Item>
        <Descriptions.Item label="رئيسي">{branch.is_main ? <Tag color="gold">نعم</Tag> : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة"><Tag color={branch.is_active ? 'green' : 'red'}>{branch.is_active ? 'نشط' : 'موقوف'}</Tag></Descriptions.Item>
        <Descriptions.Item label="ملاحظات" span={2}>{branch.notes || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}