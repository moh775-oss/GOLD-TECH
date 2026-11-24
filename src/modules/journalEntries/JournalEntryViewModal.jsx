import { Descriptions, Tag, Table, Button, Space } from 'antd'
import { LeftOutlined, RightOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons'
import AppModal from '../../components/AppModal.jsx'
import dayjs from 'dayjs'

const STATUS_MAP = {
  draft:  { label: 'مسودة', color: 'default' },
  posted: { label: 'مرحّل', color: 'green'   },
}

const fmt = (v) => Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtW = (v) => Number(v || 0).toFixed(3)

export default function JournalEntryViewModal({ open, onClose, entry, onEdit, onPrint, onNavigate }) {
  if (!entry) return null
  const nav = entry.nav || {}
  const hasPrev = nav.prev_id != null
  const hasNext = nav.next_id != null

  const lines = (entry.details || []).map((d, i) => ({ ...d, key: i, idx: i + 1 }))

  return (
    <AppModal
      open={open} onCancel={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>قيد يومية رقم {entry.doc_no ?? '—'}</span>
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
          <Button icon={<EditOutlined />} onClick={() => onEdit?.(entry)} disabled={entry.status === 'posted'}>تعديل</Button>
          <Button icon={<PrinterOutlined />} onClick={() => onPrint?.(entry)}>طباعة</Button>
          <Button onClick={onClose}>إغلاق</Button>
        </Space>
      }
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="رقم القيد">{entry.doc_no}</Descriptions.Item>
        <Descriptions.Item label="التاريخ">{entry.journal_date ? dayjs(entry.journal_date).format('YYYY-MM-DD') : '—'}</Descriptions.Item>
        <Descriptions.Item label="نوع المستند">{entry.documentType?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="نوع العملية">{entry.transaction_type || '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={(STATUS_MAP[entry.status] || {}).color || 'default'}>
            {(STATUS_MAP[entry.status] || {}).label || entry.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="العملة">{entry.currency?.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="الوصف" span={2}>{entry.description || '—'}</Descriptions.Item>
      </Descriptions>

      <Table
        style={{ marginTop: 16 }}
        size="small"
        bordered
        pagination={false}
        dataSource={lines}
        columns={[
          { title: '#', dataIndex: 'idx', width: 50, align: 'center' },
          { title: 'الحساب', render: (_, r) => r.account ? `${r.account.acc_no} - ${r.account.name}` : '—' },
          { title: 'مركز التكلفة', render: (_, r) => r.costCenter?.name || '—', width: 120 },
          { title: 'مدين', align: 'center', width: 120, render: (v, r) => fmt(r.debit_amount) },
          { title: 'دائن', align: 'center', width: 120, render: (v, r) => fmt(r.credit_amount) },
          { title: 'ذهب مدين', align: 'center', width: 90, render: (v, r) => r.gold_debit > 0 ? fmtW(r.gold_debit) : '—' },
          { title: 'ذهب دائن', align: 'center', width: 90, render: (v, r) => r.gold_credit > 0 ? fmtW(r.gold_credit) : '—' },
          { title: 'البيان', render: (_, r) => r.description || '—' },
        ]}
        summary={(rows) => {
          const dr = rows.reduce((s, r) => s + Number(r.debit_amount || 0), 0)
          const cr = rows.reduce((s, r) => s + Number(r.credit_amount || 0), 0)
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}><strong>الإجمالي</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center"><strong style={{ color: '#389e0d' }}>{fmt(dr)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center"><strong style={{ color: '#cf1322' }}>{fmt(cr)}</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5} colSpan={3} />
            </Table.Summary.Row>
          )
        }}
      />
    </AppModal>
  )
}