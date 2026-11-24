import { Descriptions, Tag, Button, Space } from 'antd'
import { LeftOutlined, RightOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons'
import AppModal from '../../../components/AppModal.jsx'
import dayjs from 'dayjs'

const STATUS_MAP = {
  draft:  { label: 'مسودة', color: 'default' },
  posted: { label: 'مرحّل', color: 'green'   },
}
const METHOD_MAP = { cash: 'نقدي', bank: 'بنك', cheque: 'شيك', card: 'بطاقة' }

export default function PaymentVoucherViewModal({ open, onClose, voucher, onEdit, onPrint, onNavigate }) {
  if (!voucher) return null
  const nav = voucher.nav || {}
  const hasPrev = nav.prev_id != null
  const hasNext = nav.next_id != null

  return (
    <AppModal
      open={open} onCancel={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>سند صرف رقم {voucher.doc_no ?? '—'}</span>
          <Space>
            <Button size="small" icon={<RightOutlined />} disabled={!hasPrev}
              onClick={() => onNavigate?.(nav.prev_id)}>السابق</Button>
            <Button size="small" icon={<LeftOutlined />} disabled={!hasNext}
              onClick={() => onNavigate?.(nav.next_id)}>التالي</Button>
          </Space>
        </div>
      }
      size="lg"
      footer={
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit?.(voucher)} disabled={voucher.status === 'posted'}>تعديل</Button>
          <Button icon={<PrinterOutlined />} onClick={() => onPrint?.(voucher)}>طباعة</Button>
          <Button onClick={onClose}>إغلاق</Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="رقم السند">{voucher.doc_no}</Descriptions.Item>
        <Descriptions.Item label="التاريخ">{voucher.doc_date ? dayjs(voucher.doc_date).format('YYYY-MM-DD') : '—'}</Descriptions.Item>
        <Descriptions.Item label="الحساب">{voucher.contact?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="الصندوق / البنك">{voucher.safe?.name || voucher.bank?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="طريقة الدفع">{METHOD_MAP[voucher.payment_method] || voucher.payment_method || '—'}</Descriptions.Item>
        <Descriptions.Item label="العملة">{voucher.currency?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="المبلغ النقدي">{Number(voucher.cash_amount || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="قيمة الذهب">{Number(voucher.gold_amount || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="وزن الذهب">{Number(voucher.gold_weight || 0).toFixed(3)}</Descriptions.Item>
        <Descriptions.Item label="العيار">{voucher.karat?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="الضريبة">{Number(voucher.tax_amount || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="الخصم">{Number(voucher.discount_amount || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="الإجمالي">{Number(voucher.total_amount || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={(STATUS_MAP[voucher.status] || {}).color || 'default'}>
            {(STATUS_MAP[voucher.status] || {}).label || voucher.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="المرجع">{voucher.reference_no || '—'}</Descriptions.Item>
        <Descriptions.Item label="الوصف" span={2}>{voucher.description || '—'}</Descriptions.Item>
      </Descriptions>
    </AppModal>
  )
}