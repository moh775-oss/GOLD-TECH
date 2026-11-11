import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function BankViewModal({ open, onClose, bank }) {
  if (!bank) return null
  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${bank.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">
        
        <Descriptions.Item label="الاسم">{bank.name}</Descriptions.Item>
        
        <Descriptions.Item label="رقم الحساب البنكي">{bank.account_number || '—'}</Descriptions.Item>
        <Descriptions.Item label="IBAN">{bank.iban || '—'}</Descriptions.Item>
        <Descriptions.Item label="رقم الحساب">{bank.acc_no || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الافتتاحي">{Number(bank.opening_balance || 0).toLocaleString('ar-SA')}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الحالي">{Number(bank.current_balance || 0).toLocaleString('ar-SA')}</Descriptions.Item>
        <Descriptions.Item label="الحالة"><Tag color={bank.is_active ? 'green' : 'red'}>{bank.is_active ? 'نشط' : 'موقوف'}</Tag></Descriptions.Item>
        <Descriptions.Item label="ملاحظات" span={2}>{bank.notes || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}