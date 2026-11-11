import { useEffect, useState } from 'react'
import { Form, Input, Switch, InputNumber, Select, Row, Col } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import { costCentersApi } from './costCentersApi'
import AppModal from '../../components/AppModal'

export default function CostCenterFormModal({ open, onClose, costCenter, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (costCenter) {
      form.setFieldsValue({ ...costCenter, is_active: costCenter.is_active === 1 || costCenter.is_active === true })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true })
    }
  }, [open, costCenter, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = { ...values, branch_id: session?.branch_id, is_active: values.is_active ? 1 : 0 }
      const res = costCenter?.id ? await costCentersApi.update(costCenter.id, payload) : await costCentersApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message || (costCenter ? 'تم التعديل' : 'تم الإضافة'))
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
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={costCenter ? 'تعديل مركز تكلفة' : 'إضافة مركز تكلفة'} size="lg" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}><Input placeholder="اسم المركز" /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="name_en" label="الاسم بالإنجليزية"><Input placeholder="English name" /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="code" label="الكود"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="center_type" label="النوع">
              <Select allowClear options={[
                { value: 'revenue', label: 'إيرادات' },
                { value: 'cost', label: 'تكاليف' },
                { value: 'profit', label: 'أرباح' },
                { value: 'investment', label: 'استثمار' },
              ]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="budget_amount" label="الميزانية"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="opening_balance" label="الرصيد الافتتاحي"><InputNumber style={{ width: '100%' }} /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked"><Switch checkedChildren="نشط" unCheckedChildren="موقوف" /></Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="notes" label="ملاحظات"><Input.TextArea rows={2} /></Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}