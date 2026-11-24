
import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, Row, Col, DatePicker } from 'antd'
import { GoldOutlined, DollarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import notify from '../../../lib/notify.jsx'
import AppModal from '../../../components/AppModal.jsx'
import { paymentVouchersApi } from './paymentVouchersApi.jsx'
import '../shared/VoucherFormModal.css'
const TYPE_OPTIONS = [
  { value: 'cash', label: 'ريال' },
  { value: 'gold', label: 'ذهب' },
  { value: 'cash_gold', label: 'ذهب وريال' },
]
const PAYMENT_METHODS = [
  { value: 'cash', label: 'نقدي' },
  { value: 'bank', label: 'تحويل بنكي' },
]
export default function PaymentVoucherFormModal({ open, onClose, voucher, helpers = {}, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const {
    contacts = [],
    safes = [],
    banks = [],
    stores = [],
    karats = [],
    costCenters = [],
  } = helpers
  const voucherType = Form.useWatch('transaction_type', form) || 'cash'
  const paymentMethod = Form.useWatch('payment_method', form) || 'cash'
  const goldWeight = Form.useWatch('gold_weight', form)
  const karatId = Form.useWatch('karat_id', form)
  const cashAmt = Form.useWatch('cash_amount', form) || 0
  const goldAmt = Form.useWatch('gold_amount', form) || 0
  const hasCash = voucherType === 'cash' || voucherType === 'cash_gold'
  const hasGold = voucherType === 'gold' || voucherType === 'cash_gold'
  const isGoldOnly = voucherType === 'gold'
  const canUsePayment = !isGoldOnly
  const useSafe = canUsePayment && paymentMethod === 'cash'
  const useBank = canUsePayment && paymentMethod === 'bank'
  const total = (hasCash ? Number(cashAmt) : 0) + (hasGold ? Number(goldAmt) : 0)
  useEffect(() => {
    if (!hasGold) return
    const w = Number(goldWeight || 0)
    const k = karats.find(x => x.id === karatId)
    if (!k) return
    const karatNum = Number(k.karat ?? String(k.name).replace(/[^\d.]/g, ''))
    if (!karatNum || karatNum <= 0) return
    const purity = karatNum / 24
    form.setFieldValue('gold_net_weight', Number((w * purity).toFixed(3)))
  }, [goldWeight, karatId, hasGold, karats, form])
  useEffect(() => {
    if (!open) return
    if (voucher?.id) {
      form.setFieldsValue({
        ...voucher,
        transaction_type: voucher.transaction_type || 'cash',
        payment_method: voucher.payment_method || 'cash',
        doc_date: voucher.doc_date ? dayjs(voucher.doc_date) : null,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        doc_date: dayjs(),
        transaction_type: 'cash',
        payment_method: 'cash',
        exchange_rate: 1,
        safe_id: safes[0]?.id ?? null,
        bank_id: banks[0]?.id ?? null,
        store_id: stores[0]?.id ?? null,
      })
    }
  }, [open, voucher?.id, safes, banks, stores, form])
  useEffect(() => {
    if (!open || voucher?.id || !costCenters.length) return
    if (form.getFieldValue('cost_center_id') == null) {
      form.setFieldValue('cost_center_id', costCenters[0].id)
    }
  }, [open, voucher?.id, costCenters, form])
  const handleOk = async () => {
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
        branch_id: session?.branch_id,
        doc_date: values.doc_date ? values.doc_date.format('YYYY-MM-DD') : undefined,
        exchange_rate: values.exchange_rate ?? 1,
        cash_amount: hasCash ? Number(values.cash_amount || 0) : 0,
        gold_amount: hasGold ? Number(values.gold_amount || 0) : 0,
        gold_weight: hasGold ? Number(values.gold_weight || 0) : 0,
        gold_net_weight: hasGold ? Number(values.gold_net_weight || 0) : 0,
        total_amount: (hasCash ? Number(values.cash_amount || 0) : 0) + (hasGold ? Number(values.gold_amount || 0) : 0),
      }
      const res = voucher?.id
        ? await paymentVouchersApi.update(voucher.id, payload)
        : await paymentVouchersApi.create(payload)
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
  return (
    <AppModal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={voucher?.id ? 'تعديل سند صرف' : 'سند صرف جديد'}
      okText="حفظ"
      cancelText="إغلاق"
      confirmLoading={saving}
      width={1050}
    >
      <Form form={form} layout="vertical" dir="rtl" size="small">
        <div className="voucher-form-grid">
          <div className="voucher-col right">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="doc_date" label="التاريخ" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="transaction_type" label="نوع السند" rules={[{ required: true }]}>
                  <Select options={TYPE_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="contact_id" label="الحساب" rules={[{ required: true }]}>
              <Select allowClear showSearch optionFilterProp="label" placeholder="اختر" size="large" options={contacts.map(c => ({ value: c.id, label: c.name }))} />
            </Form.Item>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="safe_id" label="الصندوق">
                  <Select allowClear disabled={!useSafe} placeholder={useSafe ? 'اختر الصندوق' : 'غير مطلوب'} options={safes.map(s => ({ value: s.id, label: s.name }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="store_id" label="الخزينة">
                  <Select allowClear disabled={!hasGold} placeholder={hasGold ? 'اختر الخزينة' : 'غير مطلوب'} options={stores.map(s => ({ value: s.id, label: s.name }))} />
                </Form.Item>
              </Col>
            </Row>
            <div className="voucher-cards">
              <div className={`voucher-card ${hasCash ? '' : 'disabled'}`}>
                <div className="card-title"><DollarOutlined /> الريال</div>
                <Form.Item name="cash_amount" label="المبلغ">
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} disabled={!hasCash} placeholder="0.00" />
                </Form.Item>
              </div>
              <div className={`voucher-card ${hasGold ? '' : 'disabled'}`}>
                <div className="card-title"><GoldOutlined /> الذهب</div>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item name="gold_weight" label="الوزن القائم">
                      <InputNumber min={0} step={0.001} style={{ width: '100%' }} disabled={!hasGold} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="karat_id" label="العيار">
                      <Select allowClear disabled={!hasGold} options={karats.map(k => ({ value: k.id, label: k.name }))} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="gold_net_weight" label="الوزن المعاير">
                      <InputNumber min={0} step={0.001} style={{ width: '100%' }} disabled={!hasGold} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="voucher-col left">
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="cost_center_id" label="مركز التكلفة">
                  <Select allowClear placeholder="اختر مركز التكلفة" options={costCenters.map(c => ({ value: c.id, label: c.name }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="reference_no" label="رقم المرجع">
                  <Input placeholder="شيك / حوالة..." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="payment_method" label="طريقة الدفع">
                  <Select options={PAYMENT_METHODS} onChange={(value) => {
                    if (value === 'bank') {
                      form.setFieldValue('safe_id', null)
                    } else {
                      form.setFieldValue('bank_id', null)
                    }
                  }} disabled={!canUsePayment} placeholder={canUsePayment ? '' : 'غير مطلوب للذهب'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bank_id" label="البنك">
                  <Select allowClear disabled={!useBank} placeholder={useBank ? 'اختر البنك' : 'غير مطلوب'} options={banks.map(b => ({ value: b.id, label: b.name }))} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name="agent_name" label="المندوب">
                  <Input placeholder="اسم المندوب" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="البيان" className="statement-field">
                  <Input.TextArea rows={2} placeholder="بيان السند..." />
                </Form.Item>
              </Col>
            </Row>
            <div className="voucher-total-footer">
              <span>الإجمالي</span>
              <strong>{Number(total).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </Form>
    </AppModal>
  )
}
