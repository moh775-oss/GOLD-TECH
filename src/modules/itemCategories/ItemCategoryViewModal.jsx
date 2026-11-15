import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function ItemCategoryViewModal({ open, onClose, category, categories = [] }) {
  if (!category) return null
  const parent = categories.find(c => c.id === category.parent_id)

  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${category.name}`} size="md" footer={null}>
    <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الاسم">{category.name}</Descriptions.Item>
        <Descriptions.Item label="الاسم بالإنجليزية">{category.name_en || '—'}</Descriptions.Item>
        <Descriptions.Item label="المجموعة الأب">{parent?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
        <Tag color={category.is_active ? 'green' : 'red'}>{category.is_active ? 'نشط' : 'موقوف'}</Tag>
        </Descriptions.Item>
    </Descriptions>
    </AppModal>
  )
}