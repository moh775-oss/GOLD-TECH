import { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import api from '../../lib/api'
import { useNotification } from '../../contexts/NotificationContext'

export default function CompanyFormModal({ open, onClose, editing, onSaved }) {
  const notify = useNotification()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.setFieldsValue(editing)
      setLogoUrl(editing.logo_url || null)
    } else {
      form.resetFields()
      setLogoUrl(null)
    }
  }, [open, editing, form])

  const handleUpload = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'companies')
    const res = await api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res.data.success) {
      form.setFieldValue('logo_path', res.data.data.path)
      setLogoUrl(res.data.data.url)
      notify.success('تم رفع الشعار')
    } else {
      notify.error(res.data.message)
    }
    return false
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = editing
        ? await api.put(`/companies/${editing.id}`, values)
        : await api.post('/companies', values)
      if (res.data.success) {
        notify.success(res.data.message)
        onSaved()
      } else {
        notify.error(res.data.message)
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editing ? 'تعديل شركة' : 'إضافة شركة'}
      okText="حفظ"
      cancelText="إلغاء"
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="اسم الشركة" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="name_en" label="الاسم بالإنجليزية">
          <Input />
        </Form.Item>

        <Form.Item name="logo_path" label="شعار الشركة">
          <div>
            <Upload showUploadList={false} beforeUpload={handleUpload} accept="image/*">
              <Button icon={<UploadOutlined />}>اختيار صورة</Button>
            </Upload>
            {logoUrl && (
              <img
                src={logoUrl}
                alt="شعار"
                style={{ width: 64, height: 64, objectFit: 'contain', marginTop: 8, borderRadius: 8, border: '1px solid #eee' }}
              />
            )}
          </div>
        </Form.Item>

        <Form.Item name="mobile" label="رقم الهاتف" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {!editing && (
          <>
            <Form.Item name="admin_name" label="اسم مدير الشركة" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="كلمة المرور" rules={[{ required: true, min: 6 }]}>
              <Input.Password />
            </Form.Item>
          </>
        )}

        <Form.Item name="email" label="البريد الإلكتروني" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="tax_number" label="الرقم الضريبي">
          <Input />
        </Form.Item>

        <Form.Item name="commercial_register" label="السجل التجاري">
          <Input />
        </Form.Item>

        <Form.Item name="subscription_plan" label="الباقة">
          <Select
            allowClear
            options={[
              { value: 'trial',      label: 'تجريبي' },
              { value: 'basic',      label: 'أساسي' },
              { value: 'pro',        label: 'احترافي' },
              { value: 'enterprise', label: 'مؤسسي' },
            ]}
          />
        </Form.Item>

        <Form.Item name="max_users" label="الحد الأقصى للمستخدمين">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="max_branches" label="الحد الأقصى للفروع">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}