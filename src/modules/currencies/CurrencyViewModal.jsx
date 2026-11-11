import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function CurrencyViewModal({ open, onClose, currency }) {
  if (!currency) return null
  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${currency.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">

        <Descriptions.Item label="الاسم">{currency.name}</Descriptions.Item>
        <Descriptions.Item label="الكود">{currency.code || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرمز">{currency.symbol || '—'}</Descriptions.Item>
        <Descriptions.Item label="سعر الصرف">{currency.rate != null ? Number(currency.rate).toFixed(6) : '—'}</Descriptions.Item>
        <Descriptions.Item label="عملة أساسية">{currency.is_base ? <Tag color="gold">نعم</Tag> : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة"><Tag color={currency.is_active ? 'green' : 'red'}>{currency.is_active ? 'نشط' : 'موقوف'}</Tag></Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}