import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, DatePicker, Switch, Row, Col } from 'antd'
import dayjs from 'dayjs'
import notify from '../../lib/notify.jsx'
import api from '../../lib/api'
import AppModal from '../../components/AppModal.jsx'

export default function CompanyFormModal({ open, onClose, company, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [meta, setMeta] = useState({ plans: [], cycles: [] })

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        const res = await api.get('/companies/create')
        if (res.data.success) setMeta(res.data.data)

        if (company) {
          form.setFieldsValue({
            ...company,
            is_active: company.is_active === 1 || company.is_active === true,
            subscription_start: company.subscription_start ? dayjs(company.subscription_start) : null,
            subscription_end:   company.subscription_end   ? dayjs(company.subscription_end)   : null,
          })
        } else {
          form.resetFields()
          form.setFieldsValue({ is_active: true })
        }
      } catch (e) {
        notify.error('فشل الجلب')
      }
    }
    load()
  }, [open, company])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        subscription_start: values.subscription_start?.format('YYYY-MM-DD'),
        subscription_end:   values.subscription_end?.format('YYYY-MM-DD'),
      }

      const res = company?.id
        ? await api.put(`/companies/${company.id}`, payload)
        : await api.post('/companies', payload)

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
      title={company ? 'تعديل شركة' : 'إضافة شركة'}
      size="lg"
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="اسم الشركة (عربي)" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="name_en" label="اسم الشركة (إنجليزي)">
              <Input />
            </Form.Item>
          </Col>

          {!company && (
            <>
              <Col xs={24} md={12}>
                <Form.Item name="mobile" label="جوال المدير" rules={[{ required: true }]}>
                  <Input placeholder="05xxxxxxxx" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="password" label="كلمة مرور المدير" rules={[{ required: true, min: 6 }]}>
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="admin_name" label="اسم المدير" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </>
          )}

          <Col xs={24} md={12}>
            <Form.Item name="phone" label="الهاتف">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="email" label="البريد الإلكتروني">
              <Input type="email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="tax_number" label="الرقم الضريبي">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="commercial_register" label="السجل التجاري">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="address" label="العنوان">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="subscription_plan" label="الباقة">
              <Select allowClear options={meta.plans || []} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="subscription_cycle" label="الدورة">
              <Select allowClear options={meta.cycles || []} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="subscription_start" label="تاريخ البدء">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="subscription_end" label="تاريخ الانتهاء">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="subscription_amount" label="قيمة الاشتراك">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="max_users" label="حد المستخدمين">
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="max_branches" label="حد الفروع">
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked">
              <Switch checkedChildren="مفعّل" unCheckedChildren="معطّل" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}