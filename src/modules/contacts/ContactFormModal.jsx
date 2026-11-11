import { useEffect, useState } from 'react'
import { Form, Input, Select, Switch, InputNumber, Row, Col } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import { contactsApi } from './contactsApi'
import AppModal from '../../components/AppModal'

export default function ContactFormModal({ open, onClose, contact, type, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (contact) {
      form.setFieldsValue({
        ...contact,
        is_active: contact.is_active === 1 || contact.is_active === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        contact_type: type || 'customer',
        is_active: true,
      })
    }
  }, [open, contact, type, form])

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

      const res = contact?.id
        ? await contactsApi.update(contact.id, payload)
        : await contactsApi.create(payload)

      if (res.data.success) {
        notify.success(res.data.message || (contact ? 'تم التعديل' : 'تم الإضافة'))
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
      title={contact ? 'تعديل' : 'إضافة'}
      size="md"
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={saving}
      okButtonProps={{ disabled: saving }}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item name="contact_type" label="النوع" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'customer', label: 'عميل' },
                  { value: 'supplier', label: 'مورد' },
                  { value: 'both', label: 'عميل ومورد' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
              <Input placeholder="أدخل الاسم" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="name_en" label="الاسم بالإنجليزية">
              <Input placeholder="English name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="tax_number" label="الرقم الضريبي">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="commercial_register" label="السجل التجاري">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="national_id" label="الهوية الوطنية">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="mobile" label="الجوال">
              <Input placeholder="05xxxxxxxx" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="phone" label="الهاتف">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="whatsapp" label="واتساب">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="email" label="البريد" rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="website" label="الموقع">
              <Input />
            </Form.Item>
          </Col>
          
          
          <Col xs={24} md={8}>
            <Form.Item name="city" label="المدينة">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="district" label="الحي">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="street" label="الشارع">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="building_no" label="رقم المبنى">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="postal_code" label="الرمز البريدي">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="country" label="الدولة">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="credit_limit" label="حد الائتمان">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="opening_balance" label="الرصيد الافتتاحي">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
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