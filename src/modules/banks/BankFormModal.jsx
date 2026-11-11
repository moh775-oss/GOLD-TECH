import { useEffect, useState } from 'react'
import { Form, Input, Switch, InputNumber, Row, Col } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import { banksApi } from './banksApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function BankFormModal({ open, onClose, bank, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (bank) {
      form.setFieldsValue({ ...bank, is_active: bank.is_active === 1 || bank.is_active === true })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true })
    }
  }, [open, bank, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = { ...values, branch_id: session?.branch_id, is_active: values.is_active ? 1 : 0 }
      const res = bank?.id ? await banksApi.update(bank.id, payload) : await banksApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message || (bank ? 'تم التعديل' : 'تم الإضافة'))
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
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={bank ? 'تعديل بنك' : 'إضافة بنك'} size="lg" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}><Input placeholder="اسم البنك" /></Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item name="account_number" label="رقم الحساب البنكي"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="iban" label="IBAN"><Input /></Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="opening_balance" label="الرصيد الافتتاحي"><InputNumber style={{ width: '100%' }} min={0} disabled={!!bank} /></Form.Item>
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