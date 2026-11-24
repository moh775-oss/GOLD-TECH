import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined, PrinterOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import { confirmDelete } from '../../lib/confirmDelete.jsx'

const TYPE_MAP = {
  gold: { label: 'ذهب', color: 'gold' },
  cash: { label: 'نقدي', color: 'blue' },
  both: { label: 'ذهب وريال', color: 'purple' },
}

const fmtMoney = (v) =>
  v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')

const fmtDate = (v) => {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime())
    ? '—'
    : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const renderMoneyWithRiyal = (v, color = '#389e0d', bold = false) => (
  <span style={{ color, fontWeight: bold ? 800 : 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    {fmtMoney(v)}
    <RiyalIcon width={14} height={14} />
  </span>
)

export function buildPurchaseClosingColumns({ onEdit, onDelete, onView, onPrint }) {
  return [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 90,
      sortable: false,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const handleDelete = () =>
          confirmDelete({ name: `تسكير مشتريات رقم ${row.doc_no}`, onOk: () => onDelete(row) })

        const menuItems = [
          {
            key: 'edit',
            icon: <EditOutlined style={{ color: '#197fdd', fontSize: 15 }} />,
            label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>,
            onClick: () => onEdit(row),
          },
          {
            key: 'view',
            icon: <EyeOutlined style={{ color: '#d4a017', fontSize: 15 }} />,
            label: <span style={{ color: '#b8860b', fontWeight: 600 }}>عرض</span>,
            onClick: () => onView(row),
          },
          {
            key: 'print',
            icon: <PrinterOutlined style={{ color: '#6b7280', fontSize: 15 }} />,
            label: <span style={{ fontWeight: 600 }}>طباعة</span>,
            onClick: () => onPrint(row),
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 15 }} />,
            label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>,
            danger: true,
            onClick: handleDelete,
          },
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
      width: 105,
      align: 'center',
      sortable: true,
      render: (v) => <code style={{ color: '#b8860b', fontWeight: 700, fontSize: 12 }}>{v}</code>,
    },
    {
      key: 'doc_date',
      label: 'التاريخ',
      width: 110,
      align: 'center',
      render: (v) => fmtDate(v),
    },
    {
      key: 'contact',
      label: 'المورد',
      width: 180,
      align: 'right',
      render: (_, row) => <span style={{ fontWeight: 700 }}>{row.contact?.name || '—'}</span>,
    },
    {
      key: 'user',
      label: 'المستخدم',
      width: 135,
      align: 'center',
      render: (_, row) => <span style={{ fontWeight: 600, color: '#374151' }}>{row.user?.name || '—'}</span>,
    },
    {
      key: 'transaction_type',
      label: 'النوع',
      width: 105,
      align: 'center',
      render: (v) => {
        const t = TYPE_MAP[v] || { label: v || '—', color: 'default' }
        return <Tag color={t.color} style={{ fontWeight: 700 }}>{t.label}</Tag>
      },
    },
    {
      key: 'karat',
      label: 'العيار',
      width: 95,
      align: 'center',
      render: (_, row) =>
        (row.transaction_type === 'gold' || row.transaction_type === 'both') && row.karat?.name ? (
          <span style={{ fontWeight: 700, color: '#8f6200' }}>{row.karat.name}</span>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      key: 'net_weight',
      label: 'الوزن',
      width: 125,
      align: 'center',
      render: (v, row) =>
        (row.transaction_type === 'gold' || row.transaction_type === 'both') && Number(v || 0) > 0 ? (
          <span style={{ color: '#b8860b', fontWeight: 700 }}>{`${fmtWeight(v)} جم`}</span>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    {
      key: 'gram_price',
      label: 'سعر الجرام',
      width: 125,
      align: 'center',
      render: (v, row) =>
        (row.transaction_type === 'gold' || row.transaction_type === 'both') && Number(v || 0) > 0 ? (
          renderMoneyWithRiyal(v, '#333333', false)
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    // {
    //   key: 'jewelry_amount',
    //   label: 'أجور إضافية',
    //   width: 130,
    //   align: 'center',
    //   render: (v, row) =>
    //     (row.transaction_type === 'gold' || row.transaction_type === 'both') && Number(v || 0) > 0 ? (
    //       renderMoneyWithRiyal(v, '#8f6200', true)
    //     ) : (
    //       <span style={{ color: '#ccc' }}>—</span>
    //     ),
    // },
    {
      key: 'net_amount',
      label: 'قيمة الذهب',
      width: 135,
      align: 'center',
      render: (v, row) =>
        (row.transaction_type === 'gold' || row.transaction_type === 'both') && Number(v || 0) > 0 ? (
          renderMoneyWithRiyal(v, '#b8860b', true)
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    },
    // {
    //   key: 'total_amount',
    //   label: 'الإجمالي',
    //   width: 145,
    //   align: 'center',
    //   render: (v) => renderMoneyWithRiyal(v, '#389e0d', true),
    // },
    // {
    //   key: 'notes',
    //   label: 'البيان / ملاحظات',
    //   width: 210,
    //   align: 'right',
    //   render: (v) => <span style={{ fontSize: 13 }}>{v || '—'}</span>,
    // },
  ]
}