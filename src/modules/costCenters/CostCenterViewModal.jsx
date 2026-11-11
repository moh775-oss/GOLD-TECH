import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal'

export default function CostCenterViewModal({ open, onClose, costCenter }) {
  if (!costCenter) return null
  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${costCenter.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الرقم">{costCenter.id}</Descriptions.Item>
        <Descriptions.Item label="الاسم">{costCenter.name}</Descriptions.Item>
        <Descriptions.Item label="الاسم بالإنجليزية">{costCenter.name_en || '—'}</Descriptions.Item>
        <Descriptions.Item label="الكود">{costCenter.code || '—'}</Descriptions.Item>
        <Descriptions.Item label="النوع">{costCenter.center_type || '—'}</Descriptions.Item>
        <Descriptions.Item label="الميزانية">{costCenter.budget_amount != null ? Number(costCenter.budget_amount).toLocaleString('ar-SA') : '—'}</Descriptions.Item>
        <Descriptions.Item label="رصيد افتتاحي">{costCenter.opening_balance != null ? Number(costCenter.opening_balance).toLocaleString('ar-SA') : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة"><Tag color={costCenter.is_active ? 'green' : 'red'}>{costCenter.is_active ? 'نشط' : 'موقوف'}</Tag></Descriptions.Item>
        <Descriptions.Item label="ملاحظات" span={2}>{costCenter.notes || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}