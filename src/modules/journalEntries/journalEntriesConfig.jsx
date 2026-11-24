import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, PrinterOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import { confirmDelete } from '../../lib/confirmDelete.jsx'

const TYPE_MAP = {
  cash:      { label: 'نقدي', color: 'blue' },
  gold:      { label: 'ذهب', color: 'gold' },
  cash_gold: { label: 'نقدي + ذهب', color: 'purple' },
  both:      { label: 'مختلط', color: 'purple' },
}

const fmtMoney = (v) =>
  v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')

const fmtDate = (v) => {
  if (!v) return '—'
  const d = new Date(v)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const renderMoneyWithRiyal = (v, color = '#389e0d', bold = true) => (
  <span style={{ color, fontWeight: bold ? 700 : 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    {fmtMoney(v)}
    <RiyalIcon width={14} height={14} />
  </span>
)

const renderWeightGram = (v, color = '#b8860b') =>
  Number(v || 0) > 0 ? (
    <span style={{ color, fontWeight: 700 }}>{`${fmtWeight(v)} جم`}</span>
  ) : (
    <span style={{ color: '#ccc' }}>—</span>
  )

export function buildJournalEntryColumns({ onEdit, onDelete, onView, onPrint }) {
  return [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 90,
      sortable: false,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const handleDelete = () => confirmDelete({ name: `قيد رقم ${row.doc_no}`, onOk: () => onDelete(row) })
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
      label: 'رقم المستند',
      width: 100,
      align: 'center',
      sortable: true,
      render: (v) => <code style={{ color: '#b8860b', fontWeight: 700, fontSize: 12 }}>{v}</code>,
    },
    {
      key: 'journal_date',
      label: 'التاريخ',
      width: 110,
      align: 'center',
      render: (v) => fmtDate(v),
    },
    {
      key: 'transaction_type',
      label: 'النوع',
      width: 110,
      align: 'center',
      render: (v) => {
        const t = TYPE_MAP[v] || { label: v || '—', color: 'default' }
        return <Tag color={t.color} style={{ fontWeight: 700 }}>{t.label}</Tag>
      },
    },
    {
      key: 'total_debit',
      label: 'مدين (نقدي)',
      width: 135,
      align: 'center',
      render: (_, row) => {
        const total = (row.details || []).reduce((s, d) => s + Number(d.debit_amount || 0), 0)
        return renderMoneyWithRiyal(total, '#389e0d', true)
      },
    },
    {
      key: 'total_credit',
      label: 'دائن (نقدي)',
      width: 135,
      align: 'center',
      render: (_, row) => {
        const total = (row.details || []).reduce((s, d) => s + Number(d.credit_amount || 0), 0)
        return renderMoneyWithRiyal(total, '#cf1322', true)
      },
    },
    {
      key: 'gold_debit',
      label: 'مدين (ذهب جم)',
      width: 135,
      align: 'center',
      render: (_, row) => {
        const total = (row.details || []).reduce((s, d) => s + Number(d.gold_debit || 0), 0)
        return renderWeightGram(total, '#b8860b')
      },
    },
    {
      key: 'gold_credit',
      label: 'دائن (ذهب جم)',
      width: 135,
      align: 'center',
      render: (_, row) => {
        const total = (row.details || []).reduce((s, d) => s + Number(d.gold_credit || 0), 0)
        return renderWeightGram(total, '#b8860b')
      },
    },
    {
      key: 'description',
      label: 'الوصف',
      width: 220,
      align: 'right',
      render: (v) => <span style={{ fontSize: 13 }}>{v || '—'}</span>,
    },
  ]
}