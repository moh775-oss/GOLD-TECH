import { useEffect, useState } from 'react'
import { Form, Input, Switch, Row, Col } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import { branchesApi } from './branchesApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function BranchFormModal({ open, onClose, branch, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (branch) {
      form.setFieldsValue({ ...branch, is_active: branch.is_active === 1 || branch.is_active === true, is_main: branch.is_main === 1 || branch.is_main === true })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true, is_main: false })
    }
  }, [open, branch, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = { ...values, is_active: values.is_active ? 1 : 0, is_main: values.is_main ? 1 : 0 }
      const res = branch?.id ? await branchesApi.update(branch.id, payload) : await branchesApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message || (branch ? 'تم التعديل' : 'تم الإضافة'))
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
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={branch ? 'تعديل فرع' : 'إضافة فرع'} size="lg" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}><Input placeholder="اسم الفرع" /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="code" label="الكود"><Input placeholder="BR-001" /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="الهاتف"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="mobile" label="الجوال"><Input placeholder="05xxxxxxxx" /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="email" label="البريد"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="city" label="المدينة"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="district" label="الحي"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="street" label="الشارع"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="building_no" label="رقم المبنى"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="postal_code" label="الرمز البريدي"><Input /></Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="address" label="العنوان"><Input.TextArea rows={2} /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_main" label="فرع رئيسي" valuePropName="checked" disabled={!!branch}><Switch /></Form.Item>
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