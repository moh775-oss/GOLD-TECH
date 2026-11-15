import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Select, Switch, Row, Col, Divider } from 'antd'
import notify from '../../lib/notify.jsx'
import { karatsApi } from './karatsApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function KaratFormModal({ open, onClose, karat, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (karat) {
      form.setFieldsValue({
        ...karat,
        is_active: karat.is_active === 1 || karat.is_active === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({
        metal_type: 'gold',
        is_active: true,
      })
    }
  }, [open, karat])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      }

      const res = karat?.id
        ? await karatsApi.update(karat.id, payload)
        : await karatsApi.create(payload)

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
      title={karat ? 'تعديل عيار' : 'إضافة عيار'}
      size="md"
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={saving}
      okButtonProps={{ disabled: saving }}
    >
      <Form form={form} layout="vertical" dir="rtl">

        <Divider orientation="right">البيانات الأساسية</Divider>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="اسم العيار" rules={[{ required: true }]}>
              <Input placeholder="مثال: 24 أو 21 أو 925" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="metal_type" label="نوع المعدن" rules={[{ required: true }]}>
              <Select options={[
                { value: 'gold',   label: 'ذهب' },
                { value: 'silver', label: 'فضة' },
              ]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="the_value"
              label="نسبة النقاء (0 - 1)"
              rules={[{ required: true, message: 'أدخل النسبة' }]}
            >
              <InputNumber min={0} max={1} step={0.000001} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked">
              <Switch checkedChildren="نشط" unCheckedChildren="موقوف" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="notes" label="ملاحظات">
              <Input.TextArea rows={2} placeholder="اختياري" />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </AppModal>
  )
}