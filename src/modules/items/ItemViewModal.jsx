import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

export default function ItemViewModal({ open, onClose, item, categories = [], karats = [] }) {
  if (!item) return null

  const category = categories.find(c => c.id === item.category_id)
  const karat = karats.find(k => k.id === item.karat_id)

  const itemTypeMap = { scrap: 'كسر مصاغ', pure: 'ذهب صافي', worked: 'مصاغ', silver: 'فضة', diamond: 'الماس', for_sale: 'للبيع', raw: 'خام' }
  const goldTypeMap = { scrap: 'كسر', worked: 'مصاغ', pure: 'صافي' }

  return (
    <AppModal open={open} onCancel={onClose} title={`تفاصيل: ${item.name}`} size="md" footer={null}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الكود">{item.code || '—'}</Descriptions.Item>
        <Descriptions.Item label="الاسم">{item.name}</Descriptions.Item>
        <Descriptions.Item label="الاسم بالإنجليزية">{item.name_en || '—'}</Descriptions.Item>
        <Descriptions.Item label="الباركود">{item.barcode || '—'}</Descriptions.Item>
        <Descriptions.Item label="المجموعة">{category?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="العيار">{karat?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="نوع الصنف"><Tag color="blue">{itemTypeMap[item.item_type] || item.item_type || '—'}</Tag></Descriptions.Item>
        <Descriptions.Item label="نوع الذهب"><Tag color="gold">{goldTypeMap[item.gold_type] || item.gold_type || '—'}</Tag></Descriptions.Item>
        <Descriptions.Item label="الوحدة">{item.unit || '—'}</Descriptions.Item>
        <Descriptions.Item label="الوزن">{item.weight != null ? Number(item.weight).toFixed(3) : '—'}</Descriptions.Item>
        <Descriptions.Item label="سعر التكلفة">{item.cost_price != null ? Number(item.cost_price).toLocaleString('en-US') : '—'}</Descriptions.Item>
        <Descriptions.Item label="سعر البيع">{item.sale_price != null ? Number(item.sale_price).toLocaleString('en-US') : '—'}</Descriptions.Item>
        <Descriptions.Item label="سعر الجملة">{item.wholesale_price != null ? Number(item.wholesale_price).toLocaleString('en-US') : '—'}</Descriptions.Item>
        <Descriptions.Item label="الضريبة">{item.tax_rate != null ? `${item.tax_rate}%` : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={item.is_active ? 'green' : 'red'}>{item.is_active ? 'نشط' : 'موقوف'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="الوصف" span={2}>{item.description || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}