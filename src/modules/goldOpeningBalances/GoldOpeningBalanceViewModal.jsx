import { Descriptions, Tag } from 'antd'
import AppModal from '../../components/AppModal.jsx'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')
const fmtMoney = (v) =>
    v != null
        ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00'

export default function GoldOpeningBalanceViewModal({ open, onClose, record }) {
    if (!record) return null

    const calculatedTotal =
        record.total_amount != null
            ? Number(record.total_amount)
            : Number(record.weight || 0) * Number(record.price || 0)

    return (
        <AppModal
            open={open}
            onCancel={onClose}
            title={`تفاصيل رصيد افتتاحي ذهب: ${record.doc_no || record.store_name || ''}`}
            size="md"
            footer={null}
        >
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="رقم المستند">{record.doc_no || '—'}</Descriptions.Item>
                <Descriptions.Item label="التاريخ">{record.opening_date || '—'}</Descriptions.Item>
                <Descriptions.Item label="الخزينة">{record.store_name || '—'}</Descriptions.Item>
                <Descriptions.Item label="الفرع">{record.branch_name || record.branch_id || '—'}</Descriptions.Item>
                <Descriptions.Item label="العيار">
                    <Tag color="gold">{record.karat_name || '—'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="الوزن (جم)">{fmtWeight(record.weight)}</Descriptions.Item>
                <Descriptions.Item label="السعر">{fmtMoney(record.price)}</Descriptions.Item>
                <Descriptions.Item label="الإجمالي">{fmtMoney(calculatedTotal)}</Descriptions.Item>
                <Descriptions.Item label="الحساب">
                    {record.acc_no ? `${record.acc_no} — ` : ''}
                    {record.account_name || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="المستخدم">{record.user_name || '—'}</Descriptions.Item>
                <Descriptions.Item label="البيان" span={2}>
                    {record.description || '—'}
                </Descriptions.Item>
            </Descriptions>
        </AppModal>
    )
}