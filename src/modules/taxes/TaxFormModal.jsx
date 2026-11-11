import { useEffect, useState } from 'react'
import { Form, Input, Switch, InputNumber, Row, Col } from 'antd'
import notify from '../../lib/notify.jsx'
import { taxesApi } from './taxesApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function TaxFormModal({ open, onClose, tax, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (tax) {
      form.setFieldsValue({
        ...tax,
        is_active: tax.is_active === 1 || tax.is_active === true,
        is_default: tax.is_default === 1 || tax.is_default === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true, is_default: false })
    }
  }, [open, tax, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
        is_default: values.is_default ? 1 : 0,
      }
      const res = tax?.id ? await taxesApi.update(tax.id, payload) : await taxesApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message || (tax ? 'تم التعديل' : 'تم الإضافة'))
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
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={tax ? 'تعديل ضريبة' : 'إضافة ضريبة'} size="md" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}><Input placeholder="اسم الضريبة" /></Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item name="rate" label="النسبة %" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} step={0.01} /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_default" label="افتراضي" valuePropName="checked"><Switch /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked"><Switch checkedChildren="نشط" unCheckedChildren="موقوف" /></Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}