
import { useEffect, useMemo, useState } from 'react'
import { Form, Input, InputNumber, Select, Row, Col, DatePicker, Button, Table, Tag } from 'antd'
import { PlusOutlined, DeleteOutlined, GoldOutlined, DollarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuth } from '../../contexts/AuthContext.jsx'
import notify from '../../lib/notify.jsx'
import AppModal from '../../components/AppModal.jsx'
import { journalEntriesApi } from './journalEntriesApi.jsx'

const emptyLine = (costCenterId, karatId = null) => ({
  account_id: null,
  debit_amount: null,
  credit_amount: null,
  gold_side: 'debit',
  gold_weight: null,
  gold_net_weight: null,
  karat_id: karatId,
  cost_center_id: costCenterId,
  description: '',
})

// استخراج رقم العيار
const getKaratNum = (karat) => {
  if (!karat) return 0
  if (karat.karat && Number(karat.karat) > 0) return Number(karat.karat)

  const fromName = Number(String(karat.name || '').replace(/[^\d.]/g, ''))
  if (fromName > 0 && fromName <= 24) return fromName

  const tv = Number(karat.the_value || 0)
  if (tv > 0) return Math.round(tv * 24)

  return 0
}

// الوزن المعاير = الوزن × (العيار / 24)
const calcNetWeight = (weight, karat) => {
  const w = Number(weight || 0)
  if (!w) return null

  const kn = getKaratNum(karat)
  if (!kn || kn <= 0) return null

  return Number((w * (kn / 24)).toFixed(3))
}

// استرجاع الوزن الأصلي عند التعديل
const calcOrigWeight = (netWeight, karat) => {
  const nw = Number(netWeight || 0)
  if (!nw) return null

  const kn = getKaratNum(karat)
  if (!kn || kn <= 0) return null

  return Number((nw / (kn / 24)).toFixed(3))
}

// تنسيق رأس الجدول باللون الذهبي
const tableComponents = {
  header: {
    cell: props => (
      <th
        {...props}
        style={{
          ...props.style,
          background: '#b8860b',
          color: '#ffffff',
          fontWeight: 700,
          textAlign: 'center',
          borderColor: '#9b7208',
          padding: '11px 8px',
          whiteSpace: 'nowrap',
        }}
      />
    ),
  },
}

// تنسيق بطاقات الإجماليات
const totalBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  minWidth: 145,
  padding: '7px 12px',
  borderRadius: 8,
  background: '#ffffff',
  border: '1px solid #ead9a5',
}

const totalLabelStyle = {
  color: '#666666',
  fontSize: 11,
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

const totalValueStyle = {
  fontSize: 15,
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
}

export default function JournalEntryFormModal({ open, onClose, entry, helpers = {}, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [lines, setLines] = useState([])
  const [transactionType, setTransactionType] = useState('cash')

  const { accounts = [], costCenters = [], karats = [] } = helpers
  const defaultCostCenter = costCenters[0]?.id ?? null
  const firstKaratId = karats[0]?.id ?? null

  const isGold = transactionType === 'gold'

  // ===== تهيئة النموذج =====
  useEffect(() => {
    if (!open) return

    if (entry?.id) {
      const details = entry.details || []

      const hasGold = details.some(d =>
        Number(d.gold_debit || 0) > 0 ||
        Number(d.gold_credit || 0) > 0
      )

      setTransactionType(hasGold ? 'gold' : 'cash')

      form.setFieldsValue({
        journal_date: entry.journal_date ? dayjs(entry.journal_date) : null,
        description: entry.description || '',
      })

      setLines(details.map(d => {
        const goldDebit = Number(d.gold_debit || 0)
        const goldCredit = Number(d.gold_credit || 0)
        const netWeight = goldDebit || goldCredit

        const karatObj = karats.find(
          k => String(k.id) === String(d.karat_id)
        )

        const origWeight = calcOrigWeight(netWeight, karatObj)

        return {
          account_id: d.account_id,
          debit_amount: d.debit_amount != null ? Number(d.debit_amount) : null,
          credit_amount: d.credit_amount != null ? Number(d.credit_amount) : null,
          gold_side: goldCredit > 0 ? 'credit' : 'debit',
          gold_weight: origWeight,
          gold_net_weight: netWeight || null,
          cost_center_id: d.cost_center_id || defaultCostCenter,
          karat_id: d.karat_id || firstKaratId,
          description: d.description || '',
        }
      }))
    } else {
      setTransactionType('cash')
      form.resetFields()

      form.setFieldsValue({
        journal_date: dayjs(),
        description: '',
      })

      setLines([
        emptyLine(defaultCostCenter, firstKaratId),
        emptyLine(defaultCostCenter, firstKaratId),
      ])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, entry?.id])

  // ===== تحديث سطر =====
  const updateLine = (idx, field, value) => {
    setLines(prev => prev.map((line, i) => {
      if (i !== idx) return line

      const next = { ...line, [field]: value }

      if (field === 'gold_weight' || field === 'karat_id') {
        const karat = karats.find(
          k => String(k.id) === String(next.karat_id)
        )

        next.gold_net_weight = calcNetWeight(next.gold_weight, karat)
      }

      return next
    }))
  }

  // ===== تغيير النوع =====
  const changeTransactionType = (value) => {
    setTransactionType(value)

    setLines(prev => prev.map(line => ({
      ...line,
      debit_amount: null,
      credit_amount: null,
      gold_side: 'debit',
      gold_weight: null,
      gold_net_weight: null,
      karat_id: firstKaratId,
    })))
  }

  // ===== إضافة سطر =====
  const addLine = () => {
    setLines(prev => [
      ...prev,
      emptyLine(defaultCostCenter, firstKaratId),
    ])
  }

  // ===== حذف سطر =====
  const removeLine = (idx) => {
    setLines(prev => prev.filter((_, i) => i !== idx))
  }

  // ===== الإجماليات =====
  const totalCashDebit = useMemo(
    () => lines.reduce(
      (s, l) => s + Number(l.debit_amount || 0),
      0
    ),
    [lines]
  )

  const totalCashCredit = useMemo(
    () => lines.reduce(
      (s, l) => s + Number(l.credit_amount || 0),
      0
    ),
    [lines]
  )

  const totalGoldDebit = useMemo(
    () => lines.reduce(
      (s, l) => s + (
        l.gold_side === 'debit'
          ? Number(l.gold_net_weight || 0)
          : 0
      ),
      0
    ),
    [lines]
  )

  const totalGoldCredit = useMemo(
    () => lines.reduce(
      (s, l) => s + (
        l.gold_side === 'credit'
          ? Number(l.gold_net_weight || 0)
          : 0
      ),
      0
    ),
    [lines]
  )

  const balanced = isGold
    ? Math.abs(totalGoldDebit - totalGoldCredit) < 0.001
    : Math.abs(totalCashDebit - totalCashCredit) < 0.01

  // ===== الحفظ =====
  const handleOk = async () => {
    let values

    try {
      values = await form.validateFields()
    } catch {
      return
    }

    if (lines.length < 2) {
      notify.error('القيد يحتاج سطرين على الأقل')
      return
    }

    const missingAccount = lines.findIndex(l => !l.account_id)

    if (missingAccount !== -1) {
      notify.error(`السطر ${missingAccount + 1}: الحساب مطلوب`)
      return
    }

    if (isGold) {
      const missingWeight = lines.findIndex(l =>
        !(Number(l.gold_weight || 0) > 0) ||
        !(Number(l.gold_net_weight || 0) > 0) ||
        !l.karat_id
      )

      if (missingWeight !== -1) {
        notify.error(`السطر ${missingWeight + 1}: أدخل الوزن واختر العيار`)
        return
      }

      if (Math.abs(totalGoldDebit - totalGoldCredit) >= 0.001) {
        notify.error(
          `الذهب غير متوازن: المدين ${totalGoldDebit.toFixed(3)} جم، والدائن ${totalGoldCredit.toFixed(3)} جم`
        )
        return
      }
    } else {
      const emptyAmount = lines.findIndex(l =>
        Number(l.debit_amount || 0) <= 0 &&
        Number(l.credit_amount || 0) <= 0
      )

      if (emptyAmount !== -1) {
        notify.error(`السطر ${emptyAmount + 1}: أدخل مبلغاً في المدين أو الدائن`)
        return
      }

      const bothSides = lines.findIndex(l =>
        Number(l.debit_amount || 0) > 0 &&
        Number(l.credit_amount || 0) > 0
      )

      if (bothSides !== -1) {
        notify.error(
          `السطر ${bothSides + 1}: لا يمكن إدخال مدين ودائن في السطر نفسه`
        )
        return
      }

      if (Math.abs(totalCashDebit - totalCashCredit) >= 0.01) {
        notify.error(
          `الريال غير متوازن: المدين ${totalCashDebit.toFixed(2)}، والدائن ${totalCashCredit.toFixed(2)}`
        )
        return
      }
    }

    setSaving(true)

    try {
      const payloadLines = lines.map(line => {
        const goldNet = Number(line.gold_net_weight || 0)

        return {
          account_id: line.account_id,
          cost_center_id: line.cost_center_id || null,
          karat_id: isGold ? line.karat_id : null,

          debit_amount: isGold
            ? 0
            : Number(line.debit_amount || 0),

          credit_amount: isGold
            ? 0
            : Number(line.credit_amount || 0),

          gold_debit:
            isGold && line.gold_side === 'debit'
              ? goldNet
              : 0,

          gold_credit:
            isGold && line.gold_side === 'credit'
              ? goldNet
              : 0,

          description: line.description || values.description || '',
        }
      })

      const payload = {
        branch_id: session?.branch_id,
        journal_date: values.journal_date
          ? values.journal_date.format('YYYY-MM-DD')
          : undefined,
        transaction_type: transactionType,
        description: values.description || 'قيد يومية',
        lines: payloadLines,
      }

      const res = entry?.id
        ? await journalEntriesApi.update(entry.id, payload)
        : await journalEntriesApi.create(payload)

      if (res.data.success) {
        notify.success(res.data.message)
        onSaved?.(res.data.data)
      } else {
        notify.error(res.data.message)
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  // ===== أعمدة الجدول =====
  const columns = [
    {
      title: '#',
      dataIndex: 'idx',
      width: 45,
      align: 'center',
      render: idx => (
        <span style={{ fontWeight: 600, color: '#7a5d00' }}>
          {idx + 1}
        </span>
      ),
    },
    {
      title: 'الحساب',
      width: 240,
      render: (_, row) => (
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="اختر الحساب"
          value={row.account_id}
          onChange={value => updateLine(row.idx, 'account_id', value)}
          style={{ width: '100%' }}
          options={accounts.map(a => ({
            value: a.id,
            label: `${a.acc_no} - ${a.name}`,
          }))}
        />
      ),
    },

    ...(!isGold ? [
      {
        title: 'مدين',
        width: 120,
        align: 'center',
        render: (_, row) => (
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            value={row.debit_amount}
            onChange={v => updateLine(row.idx, 'debit_amount', v)}
            placeholder="0.00"
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: 'دائن',
        width: 120,
        align: 'center',
        render: (_, row) => (
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            value={row.credit_amount}
            onChange={v => updateLine(row.idx, 'credit_amount', v)}
            placeholder="0.00"
            style={{ width: '100%' }}
          />
        ),
      },
    ] : []),

    ...(isGold ? [
      {
        title: 'الجهة',
        width: 100,
        align: 'center',
        render: (_, row) => (
          <Select
            value={row.gold_side}
            onChange={v => updateLine(row.idx, 'gold_side', v)}
            style={{ width: '100%' }}
            options={[
              { value: 'debit', label: 'مدين' },
              { value: 'credit', label: 'دائن' },
            ]}
          />
        ),
      },
      {
        title: 'الوزن',
        width: 110,
        align: 'center',
        render: (_, row) => (
          <InputNumber
            min={0}
            step={0.001}
            precision={3}
            value={row.gold_weight}
            onChange={v => updateLine(row.idx, 'gold_weight', v)}
            placeholder="0.000"
            style={{ width: '100%' }}
          />
        ),
      },
      {
        title: 'العيار',
        width: 120,
        align: 'center',
        render: (_, row) => (
          <Select
            value={row.karat_id}
            onChange={v => updateLine(row.idx, 'karat_id', v)}
            placeholder="اختر العيار"
            style={{ width: '100%' }}
            options={karats.map(k => ({
              value: k.id,
              label: `${k.name} `,
            }))}
          />
        ),
      },
      {
        title: 'الوزن المعاير',
        width: 120,
        align: 'center',
        render: (_, row) => (
          <InputNumber
            value={row.gold_net_weight}
            readOnly
            controls={false}
            precision={3}
            placeholder="0.000"
            style={{
              width: '100%',
              background: '#fafafa',
              fontWeight: 700,
              color: '#b8860b',
            }}
          />
        ),
      },
    ] : []),

    {
      title: 'مركز التكلفة',
      width: 150,
      render: (_, row) => (
        <Select
          allowClear
          placeholder="مركز التكلفة"
          value={row.cost_center_id}
          onChange={v => updateLine(row.idx, 'cost_center_id', v)}
          style={{ width: '100%' }}
          options={costCenters.map(c => ({
            value: c.id,
            label: c.name,
          }))}
        />
      ),
    },
    {
      title: 'البيان',
      width: 180,
      render: (_, row) => (
        <Input
          value={row.description}
          onChange={e => updateLine(row.idx, 'description', e.target.value)}
          placeholder="بيان السطر"
        />
      ),
    },
    {
      title: '',
      width: 50,
      align: 'center',
      render: (_, row) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeLine(row.idx)}
          disabled={lines.length <= 2}
        />
      ),
    },
  ]

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isGold
            ? <GoldOutlined style={{ color: '#b8860b' }} />
            : <DollarOutlined style={{ color: '#389e0d' }} />
          }
          {entry?.id
            ? `تعديل قيد رقم ${entry.doc_no}`
            : 'قيد يومية جديد'
          }
        </span>
      }
      okText="حفظ"
      cancelText="إغلاق"
      confirmLoading={saving}
      width={1250}
    >
      <Form form={form} layout="vertical" dir="rtl" size="small">

        {/* بيانات القيد */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fef9e7, #fdf2d0)',
            border: '1px solid #f2d98d',
            borderRadius: 10,
            padding: '12px 14px 4px',
            marginBottom: 14,
          }}
        >
          <Row gutter={12}>
            <Col xs={24} md={5}>
              <Form.Item
                name="journal_date"
                label="التاريخ"
                rules={[{ required: true, message: 'التاريخ مطلوب' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={5}>
              <Form.Item label="نوع القيد" required>
                <Select
                  value={transactionType}
                  onChange={changeTransactionType}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'cash', label: 'ريال' },
                    { value: 'gold', label: 'ذهب' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={14}>
              <Form.Item name="description" label="بيان القيد">
                <Input placeholder="بيان القيد العام (يُستخدم للسطور اللي بدون بيان)" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* عنوان الجدول */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: '#7a5d00',
              fontSize: 14,
            }}
          >
            {isGold
              ? 'سطور الذهب (بالوزن المعاير)'
              : 'سطور الريال'
            }
          </span>

          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={addLine}
            size="small"
            style={{
              borderColor: '#b8860b',
              color: '#b8860b',
            }}
          >
            إضافة صف
          </Button>
        </div>

        {/* جدول القيد */}
        <Table
          key={transactionType}
          size="small"
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
          dataSource={lines.map((line, idx) => ({
            ...line,
            key: idx,
            idx,
          }))}
          columns={columns}
          components={tableComponents}
          rowClassName={(_, idx) =>
            idx % 2 === 0 ? 'row-even' : 'row-odd'
          }
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell
                index={0}
                colSpan={columns.length}
                style={{
                  background: '#fff9e8',
                  borderTop: '2px solid #b8860b',
                  padding: '12px 10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      color: '#7a5c08',
                      fontWeight: 800,
                      fontSize: 14,
                      minWidth: 75,
                    }}
                  >
                    الإجماليات
                  </div>

                  {isGold ? (
                    <>
                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>
                          إجمالي الوزن المعاير مدين
                        </span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: '#389e0d',
                          }}
                        >
                          {totalGoldDebit.toFixed(3)} جم
                        </strong>
                      </div>

                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>
                          إجمالي الوزن المعاير دائن
                        </span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: '#cf1322',
                          }}
                        >
                          {totalGoldCredit.toFixed(3)} جم
                        </strong>
                      </div>

                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>الفرق</span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: balanced ? '#389e0d' : '#cf1322',
                          }}
                        >
                          {Math.abs(
                            totalGoldDebit - totalGoldCredit
                          ).toFixed(3)} جم
                        </strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>
                          إجمالي المدين
                        </span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: '#389e0d',
                          }}
                        >
                          {totalCashDebit.toFixed(2)} ريال
                        </strong>
                      </div>

                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>
                          إجمالي الدائن
                        </span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: '#cf1322',
                          }}
                        >
                          {totalCashCredit.toFixed(2)} ريال
                        </strong>
                      </div>

                      <div style={totalBoxStyle}>
                        <span style={totalLabelStyle}>الفرق</span>
                        <strong
                          style={{
                            ...totalValueStyle,
                            color: balanced ? '#389e0d' : '#cf1322',
                          }}
                        >
                          {Math.abs(
                            totalCashDebit - totalCashCredit
                          ).toFixed(2)} ريال
                        </strong>
                      </div>
                    </>
                  )}

                  {/* حالة توازن القيد */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 125,
                      padding: '9px 16px',
                      borderRadius: 8,
                      background: balanced ? '#f0f9eb' : '#fff1f0',
                      border: `1px solid ${
                        balanced ? '#b7eb8f' : '#ffa39e'
                      }`,
                      color: balanced ? '#237804' : '#cf1322',
                      fontWeight: 800,
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {balanced
                      ? '✓ القيد متوازن'
                      : '✕ القيد غير متوازن'
                    }
                  </div>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Form>
    </AppModal>
  )
}
