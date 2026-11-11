import { useEffect, useState } from 'react'
import { Form, Input, Switch, InputNumber, Row, Col } from 'antd'
import notify from '../../lib/notify.jsx'
import { currenciesApi } from './currenciesApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function CurrencyFormModal({ open, onClose, currency, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (currency) {
      form.setFieldsValue({
        ...currency,
        is_active: currency.is_active === 1 || currency.is_active === true,
        is_base: currency.is_base === 1 || currency.is_base === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true, is_base: false })
    }
  }, [open, currency, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
        is_base: values.is_base ? 1 : 0,
      }
      const res = currency?.id ? await currenciesApi.update(currency.id, payload) : await currenciesApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message || (currency ? 'تم التعديل' : 'تم الإضافة'))
        onSaved?.(res.data.data)
        onClose()
      } else {
        notify.error(res.data.message || 'فشل الحفظ')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally { setSaving(false) }
  }

  return (
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={currency ? 'تعديل عملة' : 'إضافة عملة'} size="md" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}><Input placeholder="اسم العملة" /></Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item name="code" label="الكود" rules={[{ required: true }]}><Input placeholder="SAR, USD, ..." /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="symbol" label="الرمز"><Input placeholder="﷼, $, ..." /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="rate" label="سعر الصرف"><InputNumber style={{ width: '100%' }} min={0} step={0.000001} /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_base" label="عملة أساسية" valuePropName="checked"><Switch /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked"><Switch checkedChildren="نشط" unCheckedChildren="موقوف" /></Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}