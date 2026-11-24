import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Form, Input, InputNumber, Select, Row, Col, DatePicker, Button, Space, Tooltip, Modal } from 'antd'
import { SaveOutlined, ArrowRightOutlined, UserAddOutlined, GoldOutlined, DollarOutlined, PrinterOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import dayjs from 'dayjs'
import AppModal from '../../components/AppModal.jsx'
import ContactFormModal from '../contacts/ContactFormModal.jsx'
import SalesClosingPrint from './salesClosingsPrint.jsx'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { salesClosingsApi } from './salesClosingsApi.jsx'

const TYPE_OPTIONS = [
  { value: 'gold', label: 'ذهب' },
  { value: 'both', label: 'ذهب وريال معاً' },
  
  { value: 'cash', label: 'ريال (نقدي)' },
]

export default function SalesClosingForm({ open, onClose, closing, helpers = {}, onSaved, onPrintAfterSave }) {
  const { session } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isModal = typeof open === 'boolean'
  const recordId = closing?.id || id
  const isEdit = Boolean(recordId)
  const currentUserId = session?.user_id ?? null

  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [loadingRecord, setLoadingRecord] = useState(false)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [printingPayload, setPrintingPayload] = useState(null)
  const [localContacts, setLocalContacts] = useState(helpers.contacts || [])
  const [localKarats, setLocalKarats] = useState(helpers.karats || [])
  const [localUsers, setLocalUsers] = useState(helpers.users || [])

  useEffect(() => {
    if (helpers.contacts?.length) setLocalContacts(helpers.contacts)
    if (helpers.karats?.length) {
      setLocalKarats(helpers.karats)
      if (!isEdit && !form.getFieldValue('karat_id')) {
        form.setFieldsValue({ karat_id: helpers.karats[0].id })
      }
    }
    if (helpers.users?.length) setLocalUsers(helpers.users)
  }, [helpers.contacts, helpers.karats, helpers.users, isEdit, form])

  useEffect(() => {
    if (!localContacts.length || !localKarats.length || !localUsers.length) {
      salesClosingsApi
        .options()
        .then((res) => {
          if (res.data?.success) {
            const contactsList = res.data.data?.contacts || []
            const karatsList = res.data.data?.karats || []
            const usersList = res.data.data?.users || []
            setLocalContacts(contactsList)
            setLocalKarats(karatsList)
            setLocalUsers(usersList)
            if (!isEdit && karatsList.length && !form.getFieldValue('karat_id')) {
              form.setFieldsValue({ karat_id: karatsList[0].id })
            }
          }
        })
        .catch(() => {})
    }
  }, [localContacts.length, localKarats.length, localUsers.length, isEdit, form])

  useEffect(() => {
    if (!isEdit && currentUserId && !form.getFieldValue('user_id')) {
      form.setFieldsValue({ user_id: currentUserId })
    }
  }, [currentUserId, isEdit, form])

  const txType = Form.useWatch('transaction_type', form) || 'both'
  const netWeight = Number(Form.useWatch('net_weight', form) || 0)
  const gramPrice = Number(Form.useWatch('gram_price', form) || 0)
  const jewelryAmount = Number(Form.useWatch('jewelry_amount', form) || 0)
  const cashAmount = Number(Form.useWatch('total_amount', form) || 0)
  const goldEnabled = txType === 'gold' || txType === 'both'
  const cashEnabled = txType === 'cash' || txType === 'both'
  const goldValue = goldEnabled ? Number((netWeight * gramPrice + jewelryAmount).toFixed(2)) : 0
  const totalAmount = Number((cashEnabled ? cashAmount : goldValue).toFixed(2))

  const resetForNextEntry = (keepDate, keepType) => {
    form.resetFields()
    form.setFieldsValue({
      doc_date: keepDate || dayjs(),
      transaction_type: keepType || 'both',
      user_id: currentUserId,
      contact_id: null,
      karat_id: localKarats[0]?.id ?? null,
      net_weight: null,
      jewelry_weight: null,
      gram_price: null,
      jewelry_amount: null,
      total_amount: null,
      notes: null,
    })
  }

  const handleTypeChange = (nextType) => {
    if (nextType === 'gold') {
      form.setFieldsValue({ total_amount: null })
    } else if (nextType === 'cash') {
      form.setFieldsValue({
        net_weight: null,
        jewelry_weight: null,
        karat_id: null,
        gram_price: null,
        jewelry_amount: null,
      })
    } else if (!form.getFieldValue('karat_id') && localKarats.length) {
      form.setFieldsValue({ karat_id: localKarats[0].id })
    }
  }

  useEffect(() => {
    if (isModal && !open) return
    if (closing?.id) {
      form.setFieldsValue({
        ...closing,
        doc_date: closing.doc_date ? dayjs(closing.doc_date) : dayjs(),
        transaction_type: closing.transaction_type || 'both',
        user_id: closing.user_id ?? currentUserId,
        net_weight: closing.net_weight ?? null,
        jewelry_weight: closing.jewelry_weight ?? null,
        gram_price: closing.gram_price ?? null,
        jewelry_amount: closing.jewelry_amount ?? null,
        total_amount: closing.total_amount ?? null,
      })
      return
    }
    if (!isModal && id) {
      setLoadingRecord(true)
      salesClosingsApi
        .show(id)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const row = res.data.data
            form.setFieldsValue({
              ...row,
              doc_date: row.doc_date ? dayjs(row.doc_date) : dayjs(),
              transaction_type: row.transaction_type || 'both',
              user_id: row.user_id ?? currentUserId,
              net_weight: row.net_weight ?? null,
              jewelry_weight: row.jewelry_weight ?? null,
              gram_price: row.gram_price ?? null,
              jewelry_amount: row.jewelry_amount ?? null,
              total_amount: row.total_amount ?? null,
            })
          }
        })
        .catch(() => notify.error('فشل جلب بيانات التسكير'))
        .finally(() => setLoadingRecord(false))
      return
    }
    resetForNextEntry(dayjs(), 'gold')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModal, open, closing, id, form, localKarats, currentUserId])

  const handleCustomerCreated = async (newCustomer) => {
    try {
      const res = await salesClosingsApi.options()
      if (res.data?.success) {
        setLocalContacts(res.data.data?.contacts || [])
      } else if (newCustomer?.id) {
        setLocalContacts((prev) => [newCustomer, ...prev])
      }
    } catch {
      if (newCustomer?.id) {
        setLocalContacts((prev) => [newCustomer, ...prev])
      }
    }
    if (newCustomer?.id) {
      form.setFieldsValue({ contact_id: newCustomer.id })
    }
  }

  const triggerPrintModal = async (savedRow) => {
    if (!savedRow?.id) return
    try {
      const res = await salesClosingsApi.print(savedRow.id)
      if (res.data?.success) {
        setPrintingPayload(res.data.data)
        setPrintOpen(true)
        return
      }
    } catch {}
    setPrintingPayload({
      closing: savedRow,
      print_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      printed_by: session?.name || '',
    })
    setPrintOpen(true)
  }

  const promptPrintAfterSave = (savedRow) => {
    Modal.confirm({
      centered: true,
      title: 'تم حفظ التسكير بنجاح',
      content: `رقم المستند (${savedRow?.doc_no || '—'}). هل تريد طباعة المستند الآن؟`,
      okText: 'طباعة',
      cancelText: 'متابعة الإضافة',
      icon: <PrinterOutlined style={{ color: '#b8860b' }} />,
      onOk: () => {
        if (onPrintAfterSave) {
          onPrintAfterSave(savedRow)
        } else {
          triggerPrintModal(savedRow)
        }
      },
    })
  }

  const handleSubmit = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...values,
        branch_id: values.branch_id || closing?.branch_id || session?.branch_id,
        user_id: values.user_id || closing?.user_id || currentUserId,
        doc_date: values.doc_date ? values.doc_date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        net_weight: goldEnabled ? Number(values.net_weight || 0) : 0,
        jewelry_weight: goldEnabled ? Number(values.jewelry_weight || 0) : 0,
        karat_id: goldEnabled ? values.karat_id || null : null,
        gram_price: goldEnabled ? Number(values.gram_price || 0) : 0,
        jewelry_amount: goldEnabled ? Number(values.jewelry_amount || 0) : 0,
        total_amount: cashEnabled ? Number(values.total_amount || 0) : goldValue,
      }
      const res = isEdit
        ? await salesClosingsApi.update(recordId, payload)
        : await salesClosingsApi.create(payload)
      if (res.data?.success) {
        const savedRow = res.data.data
        notify.success(res.data.message || 'تم الحفظ بنجاح')
        if (!isEdit) {
          resetForNextEntry(values.doc_date, values.transaction_type)
          onSaved?.(savedRow, { keepOpen: true })
          promptPrintAfterSave(savedRow)
        } else if (onSaved) {
          onSaved(savedRow, { keepOpen: false })
        } else {
          navigate('/sales-closings')
        }
      } else {
        notify.error(res.data?.message || 'فشل الحفظ')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const cardStyle = (active, accentBorder, activeBg) => ({
    height: '100%',
    borderRadius: 14,
    borderColor: active ? accentBorder : '#e5e7eb',
    background: active ? activeBg : '#f8f9fa',
    opacity: active ? 1 : 0.68,
    display: 'flex',
    flexDirection: 'column',
  })

  const formContent = (
    <>
      <Form form={form} layout="vertical" dir="rtl" disabled={loadingRecord}>
        <Row gutter={[12, 10]} align="stretch">
          <Col xs={24} md={8}>
            <Form.Item label="العميل" required style={{ marginBottom: 10 }}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="contact_id" noStyle rules={[{ required: true, message: 'العميل مطلوب' }]}>
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="ابحث واختر العميل..."
                    style={{ width: '100%' }}
                    options={localContacts.map((c) => ({
                      value: c.id,
                      label:  c.name,
                    }))}
                  />
                </Form.Item>
                <Tooltip title="إضافة عميل جديد">
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setCustomerModalOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                      borderColor: '#b8860b',
                    }}
                  />
                </Tooltip>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="user_id" label="المستخدم" rules={[{ required: true, message: 'المستخدم مطلوب' }]} style={{ marginBottom: 10 }}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="اختر المستخدم..."
                options={localUsers.map((u) => ({ value: u.id, label: u.name }))}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="doc_date" label="التاريخ" rules={[{ required: true, message: 'التاريخ مطلوب' }]} style={{ marginBottom: 10 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item  name="transaction_type" label="نوع التسكير" rules={[{ required: true, message: 'النوع مطلوب' }]} style={{ marginBottom: 10 }}>
              <Select disabled options={TYPE_OPTIONS} onChange={handleTypeChange} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} style={{ display: 'flex' }}>
            <Card
              size="small"
              title={<span style={{ color: '#8f6200', fontWeight: 800 }}><GoldOutlined style={{ marginLeft: 6 }} />بيانات الذهب</span>}
              style={{ ...cardStyle(goldEnabled, '#e6c35c', '#fffdf6'), width: '100%' }}
              styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
            >
              <Row gutter={[10, 8]}>
                <Col xs={8}>
                  <Form.Item name="net_weight" label="الوزن (جم)" rules={[{ required: goldEnabled, message: 'الوزن مطلوب' }]} style={{ marginBottom: 8 }}>
                    <InputNumber disabled={!goldEnabled} min={0} step={0.001} precision={3} style={{ width: '100%' }} placeholder="0.000" />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item name="karat_id" label="العيار" rules={[{ required: goldEnabled, message: 'العيار مطلوب' }]} style={{ marginBottom: 8 }}>
                    <Select disabled={!goldEnabled} placeholder="اختر العيار" options={localKarats.map((k) => ({ value: k.id, label: k.name }))} />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item name="gram_price" label="سعر الجرام" rules={[{ required: goldEnabled, message: 'السعر مطلوب' }]} style={{ marginBottom: 8 }}>
                    <InputNumber disabled={!goldEnabled} min={0} step={0.01} precision={2} style={{ width: '100%' }} placeholder="0.00" />
                  </Form.Item>
                </Col>
                {/* <Col xs={12}>
                  <Form.Item name="jewelry_amount" label="أجور إضافية" style={{ marginBottom: 8 }}>
                    <InputNumber disabled={!goldEnabled} min={0} step={0.01} precision={2} style={{ width: '100%' }} placeholder="0.00" />
                  </Form.Item>
                </Col> */}
              </Row>
              <div
                style={{
                  background: 'linear-gradient(135deg, #fef9e7 0%, #fdf2d0 100%)',
                  border: '1px solid #e6c35c',
                  borderRadius: 10,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7a5d00' }}>قيمة الذهب:</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#b8860b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {goldValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  <RiyalIcon width={14} height={14} />
                </span>
              </div>
            </Card>
          </Col>
          {/* <Col xs={24} md={12} style={{ display: 'flex' }}>
            <Card
              size="small"
              title={<span style={{ color: '#1d4ed8', fontWeight: 800 }}><DollarOutlined style={{ marginLeft: 6 }} />بيانات المبالغ (ريال)</span>}
              style={{ ...cardStyle(cashEnabled, '#93c5fd', '#f8fbff'), width: '100%' }}
              styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
            >
              <Row gutter={[10, 8]}>
                <Col xs={24}>
                  <Form.Item name="total_amount" label="المبلغ النقدي" rules={[{ required: cashEnabled, message: 'المبلغ مطلوب' }]} style={{ marginBottom: 8 }}>
                    <InputNumber disabled={!cashEnabled} min={0} step={0.01} precision={2} style={{ width: '100%' }} placeholder="0.00" />
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1px solid #93c5fd',
                  borderRadius: 10,
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a' }}>المبلغ النقدي المستقل:</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#1d4ed8', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  <RiyalIcon width={15} height={15} />
                </span>
              </div>
            </Card>
          </Col> */}
          <Col xs={24}>
            <Form.Item name="notes" label="البيان / ملاحظات" style={{ marginBottom: 0 }}>
              <Input.TextArea rows={2} placeholder="اكتب بيان تسكير المبيعات..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ContactFormModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        contact={null}
        type="customer"
        onSaved={handleCustomerCreated}
      />
      <SalesClosingPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        payload={printingPayload}
      />
    </>
  )

  if (isModal) {
    return (
      <AppModal
        open={open}
        onCancel={onClose}
        onOk={handleSubmit}
        title={isEdit ? 'تعديل تسكير مبيعات' : 'إضافة تسكير مبيعات'}
        okText="حفظ"
        cancelText="إغلاق"
        confirmLoading={saving}
        width={920}
      >
        {formContent}
      </AppModal>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={isEdit ? 'تعديل تسكير مبيعات' : 'إضافة تسكير مبيعات'}
        extra={
          <Space>
            <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales-closings')}>رجوع</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSubmit} style={{ background: '#b8860b', borderColor: '#b8860b' }}>حفظ</Button>
          </Space>
        }
      >
        {formContent}
      </Card>
    </div>
  )
}