import { useEffect, useState } from 'react'
import { Form, Input, Switch, Select, Row, Col } from 'antd'
import notify from '../../lib/notify.jsx'
import { itemCategoriesApi } from './itemCategoriesApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function ItemCategoryFormModal({ open, onClose, category, categories = [], onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (category) {
      form.setFieldsValue({
        ...category,
        is_active: category.is_active === 1 || category.is_active === true,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ is_active: true })
    }
  }, [open, category, form])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = { ...values, is_active: values.is_active ? 1 : 0 }
      const res = category?.id
        ? await itemCategoriesApi.update(category.id, payload)
        : await itemCategoriesApi.create(payload)

      if (res.data.success) {
        notify.success(res.data.message || (category ? 'تم التعديل' : 'تم الإضافة'))
        onSaved?.(res.data.data)
        onClose()
      } else {
        notify.error(res.data.message || 'فشل الحفظ')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally { setSaving(false) }
  }

  const parentOptions = categories
    .filter(c => c.id !== category?.id && !c.parent_id)
    .map(c => ({ value: c.id, label: c.name }))

  return (
    <AppModal open={open} onCancel={onClose} onOk={handleOk} title={category ? 'تعديل مجموعة' : 'إضافة مجموعة'} size="md" okText="حفظ" cancelText="إلغاء" confirmLoading={saving} okButtonProps={{ disabled: saving }}>
      <Form form={form} layout="vertical" dir="rtl">
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
              <Input placeholder="اسم المجموعة" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="name_en" label="الاسم بالإنجليزية">
              <Input placeholder="English name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="parent_id" label="المجموعة الأب">
              <Select allowClear placeholder="بدون (رئيسية)"  options={parentOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="is_active" label="الحالة" valuePropName="checked">
              <Switch checkedChildren="نشط" unCheckedChildren="موقوف" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AppModal>
  )
}