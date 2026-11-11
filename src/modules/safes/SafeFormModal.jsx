import { useEffect, useState } from 'react'
import { Form, Input, Switch, InputNumber, Row, Col } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import { safesApi } from './safesApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function SafeFormModal({ open, onClose, safe, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (safe) {
      form.setFieldsValue({
        ...safe,
        is_active: safe.is_active === 1 || safe.is_active === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true })
    }
  }, [open, safe, form])

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
        is_active: values.is_active ? 1 : 0,
      }

      const res = safe?.id
        ? await safesApi.update(safe.id, payload)
        : await safesApi.create(payload)

      if (res.data.success) {
        notify.success(res.data.message || (safe ? 'تم التعديل' : 'تم الإضافة'))
        onSaved?.(res.data.data)
        onClose()
      } else {
        notify.error(res.data.message || 'فشل الحفظ')
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
      title={safe ? 'تعديل صندوق' : 'إضافة صندوق'}
      size="lg"
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={saving}
      okButtonProps={{ disabled: saving }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
              <Input placeholder="اسم الصندوق" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="code" label="الكود">
              <Input placeholder="كود الصندوق" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="opening_cash" label="الرصيد الافتتاحي النقدي">
              <InputNumber style={{ width: '100%' }} min={0} disabled={!!safe} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="opening_gold" label="الرصيد الافتتاحي الذهب">
              <InputNumber style={{ width: '100%' }} min={0} step={0.001} disabled={!!safe} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked">
              <Switch checkedChildren="نشط" unCheckedChildren="موقوف" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="notes" label="ملاحظات">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}