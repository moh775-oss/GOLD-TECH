import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, PrinterOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import { confirmDelete } from '../../../lib/confirmDelete.jsx'

const fmtMoney = (v) =>
  v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')

const fmtDate = (v) => {
  if (!v) return '—'
  const date = new Date(v)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

const TYPE_MAP = {
  cash:      { label: 'ريال', color: 'green' },
  gold:      { label: 'ذهب', color: 'gold' },
  cash_gold: { label: 'ذهب وريال', color: 'purple' },
}

const METHOD_MAP = { cash: 'نقدي', bank: 'بنك', cheque: 'شيك', card: 'بطاقة' }

const renderMoneyWithRiyal = (v, color = '#197fdd', bold = true) => (
  <span style={{ color, fontWeight: bold ? 700 : 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    {fmtMoney(v)}
    <RiyalIcon width={14} height={14} />
  </span>
)

export function buildReceiptVoucherColumns({ onEdit, onDelete, onView, onPrint }) {
  return [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 90,
      sortable: false,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const handleDelete = () => confirmDelete({ name: `سند رقم ${row.doc_no}`, onOk: () => onDelete(row) })
        const menuItems = [
          { key: 'edit', icon: <EditOutlined style={{ color: '#197fdd', fontSize: 15 }} />, label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>, onClick: () => onEdit(row) },
          { key: 'view', icon: <EyeOutlined style={{ color: '#d4a017', fontSize: 15 }} />, label: <span style={{ color: '#b8860b', fontWeight: 600 }}>عرض</span>, onClick: () => onView(row) },
          { key: 'print', icon: <PrinterOutlined style={{ color: '#6b7280', fontSize: 15 }} />, label: <span style={{ fontWeight: 600 }}>طباعة</span>, onClick: () => onPrint(row) },
          { type: 'divider' },
          { key: 'delete', icon: <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 15 }} />, label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>, danger: true, onClick: handleDelete },
        ]
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottom">
              <Button
                type="text"
                icon={<MoreOutlined style={{ fontSize: 18, color: '#6b7280' }} />}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                  padding: 0,
                }}
              />
            </Dropdown>
          </div>
        )
      },
    },
    {
      key: 'doc_no',
      label: 'رقم السند',
      width: 100,
      align: 'center',
      sortable: true,
      render: (v) => <code style={{ color: '#b8860b', fontWeight: 700, fontSize: 12 }}>{v}</code>,
    },
    {
      key: 'doc_date',
      label: 'التاريخ',
      width: 110,
      align: 'center',
      sortable: true,
      render: (v) => fmtDate(v),
    },
    {
      key: 'contact',
      label: 'الحساب',
      width: 160,
      align: 'center',
      render: (_, row) => (row.contact?.name ? <Tag color="blue">{row.contact.name}</Tag> : '—'),
    },
    {
      key: 'safe',
      label: 'الصندوق/البنك',
      width: 120,
      align: 'center',
      render: (_, row) => row.safe?.name || row.bank?.name || '—',
    },
    {
      key: 'payment_method',
      label: 'طريقة الدفع',
      width: 110,
      align: 'center',
      render: (v) => METHOD_MAP[v] || v || '—',
    },
    {
      key: 'transaction_type',
      label: 'نوع العملية',
      width: 110,
      align: 'center',
      render: (v) => {
        const t = TYPE_MAP[v] || { label: v || '—', color: 'default' }
        return <Tag color={t.color} style={{ fontWeight: 700 }}>{t.label}</Tag>
      },
    },
    {
      key: 'cash_amount',
      label: 'المبلغ النقدي',
      width: 135,
      align: 'center',
      render: (v) =>
        v != null && Number(v) > 0 ? renderMoneyWithRiyal(v, '#389e0d', true) : <span style={{ color: '#ccc' }}>—</span>,
    },
    {
      key: 'gold_weight',
      label: 'وزن الذهب',
      width: 120,
      align: 'center',
      render: (v) =>
        v != null && Number(v) > 0 ? (
          <span style={{ color: '#d4a017', fontWeight: 700 }}>{`${fmtWeight(v)} جم`}</span>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      key: 'total_amount',
      label: 'الإجمالي',
      width: 135,
      align: 'center',
      render: (v) => renderMoneyWithRiyal(v, '#197fdd', true),
    },
  ]
}