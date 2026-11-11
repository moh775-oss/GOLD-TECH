import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function TaxViewModal({ open, onClose, tax }) {
  if (!tax) return null
  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${tax.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">

        <Descriptions.Item label="الاسم">{tax.name}</Descriptions.Item>
        <Descriptions.Item label="النسبة">{tax.rate != null ? `${Number(tax.rate)}%` : '—'}</Descriptions.Item>
        <Descriptions.Item label="افتراضي">{tax.is_default ? <Tag color="gold">نعم</Tag> : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة"><Tag color={tax.is_active ? 'green' : 'red'}>{tax.is_active ? 'نشط' : 'موقوف'}</Tag></Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}