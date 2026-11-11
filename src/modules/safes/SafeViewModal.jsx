import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function SafeViewModal({ open, onClose, safe }) {
  if (!safe) return null

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      title={`تفاصيل: ${safe.name}`}
      size="md"
      footer={null}
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الاسم">{safe.name}</Descriptions.Item>
        
        <Descriptions.Item label="الكود">{safe.code || '—'}</Descriptions.Item>
        <Descriptions.Item label="رقم الحساب">{safe.acc_no || '—'}</Descriptions.Item>
        <Descriptions.Item label="الفرع">{safe.branch_id}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الافتتاحي النقدي">{Number(safe.opening_cash || 0).toLocaleString('ar-SA')}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الحالي النقدي">{Number(safe.current_cash || 0).toLocaleString('ar-SA')}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الافتتاحي الذهب">{Number(safe.opening_gold || 0).toFixed(3)}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الحالي الذهب">{Number(safe.current_gold || 0).toFixed(3)}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={safe.is_active ? 'green' : 'red'}>
            {safe.is_active ? 'نشط' : 'موقوف'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="ملاحظات" span={2}>{safe.notes || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}