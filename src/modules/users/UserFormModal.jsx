import { useEffect, useState } from 'react'
import { Form, Input, Select, Switch, Row, Col, Divider } from 'antd'
import notify from '../../lib/notify.jsx'
import { usersApi } from './usersApi.jsx'
import AppModal from '../../components/AppModal.jsx'

export default function UserFormModal({ open, onClose, user, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [options, setOptions] = useState({ branches: [], roles: [], basic_roles: [] })

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        if (user?.id) {
          const res = await usersApi.editMeta(user.id)
          if (res.data.success) {
            const d = res.data.data
            setOptions({ branches: d.branches, roles: d.roles, basic_roles: d.basic_roles || [] })
            form.setFieldsValue({
              ...d.user,
              is_active: d.user.is_active === 1 || d.user.is_active === true,
              allow_branch_switch: d.user.allow_branch_switch === 1 || d.user.allow_branch_switch === true,
              branch_ids: d.user.branches?.map(b => b.id) || [d.user.branch_id],
              role_ids: d.user.roles?.map(r => r.id) || [],
            })
          }
        } else {
          const res = await usersApi.meta()
          if (res.data.success) {
            const d = res.data.data
            setOptions(d)
            form.resetFields()
            form.setFieldsValue({
              is_active: true,
              allow_branch_switch: false,
              role: 'cashier',
            })
          }
        }
      } catch (e) {
        notify.error(e.response?.data?.message || 'فشل الجلب')
      }
    }
    load()
  }, [open, user])

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        is_active: values.is_active ? 1 : 0,
        allow_branch_switch: values.allow_branch_switch ? 1 : 0,
      }

      const res = user?.id
        ? await usersApi.update(user.id, payload)
        : await usersApi.create(payload)

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
      title={user ? 'تعديل مستخدم' : 'إضافة مستخدم'}
      size="md"
      okText="حفظ"
      cancelText="إلغاء"
      confirmLoading={saving}
      okButtonProps={{ disabled: saving }}
    >
      <Form form={form} layout="vertical" dir="rtl">

        <Divider orientation="left" className='text-info'>البيانات الأساسية</Divider>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
              <Input placeholder="اسم المستخدم" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="mobile" label="الجوال" rules={[{ required: true }]}>
              <Input placeholder="05xxxxxxxx" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
                name="email"
                label="البريد الإلكتروني"
                rules={[
                { required: true, message: 'يرجى إدخال البريد الإلكتروني' },
                { type: 'email', message: 'يرجى إدخال بريد إلكتروني صحيح' },
                ]}
            >
                <Input type="email" placeholder="example@gmail.com" />
            </Form.Item>
            </Col>
          <Col xs={24} md={12}>
            <Form.Item
                name="password"
                label="كلمة المرور"
                rules={[
                {
                    required: !user,
                    message: 'يرجى إدخال كلمة المرور',
                },
                {
                    min: 6,
                    message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                },
                ]}
            >
                <Input.Password
                placeholder={user ? 'اترك فارغاً لعدم التغيير' : '6 أحرف على الأقل'}
                />
            </Form.Item>
            </Col>
        </Row>

        <Divider orientation="left" className='text-info'>الصلاحيات</Divider>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Form.Item name="role" label="الدور" rules={[{ required: true }]}>
              <Select options={options.basic_roles?.length ? options.basic_roles : [
                { value: 'admin',      label: 'مدير' },
                { value: 'accountant', label: 'محاسب' },
                { value: 'cashier',    label: 'كاشير' },
              ]} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="role_ids" label="أدوار إضافية">
              <Select
                mode="multiple"
                allowClear
                placeholder="اختر الأدوار"
                options={options.roles?.map(r => ({ value: r.id, label: r.name })) || []}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" className='text-info'>الفروع</Divider>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Form.Item name="branch_id" label="الفرع الرئيسي" rules={[{ required: true }]}>
              <Select options={options.branches?.map(b => ({ value: b.id, label: b.name })) || []} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="branch_ids" label="الفروع المسموحة">
              <Select
                mode="multiple"
                allowClear
                placeholder="اختر الفروع"
                options={options.branches?.map(b => ({ value: b.id, label: b.name })) || []}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="right">الحالة</Divider>
        <Row gutter={10}>
          <Col xs={12} md={8}>
            <Form.Item name="is_active" label="نشط" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="allow_branch_switch" label="يسمح بتبديل الفرع" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </AppModal>
  )
}