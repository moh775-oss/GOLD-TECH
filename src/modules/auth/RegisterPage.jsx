import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { ShopOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import notify from '../../lib/notify.jsx'
import '../../styles/auth.css'
import logo from '../../assets/Logo.png'

export default function RegisterPage() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        company_name: values.company_name,
        mobile: values.mobile,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      if (res.data.success) {
        notify.success('تم إنشاء الحساب بنجاح')
        setTimeout(() => navigate('/login'), 800)
      } else {
        notify.error(res.data.message || 'فشل إنشاء الحساب')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper" dir="rtl">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="شعار النظام" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">إنشاء حساب جديد</h1>
        <p className="auth-subtitle">سجّل مؤسستك وابدأ باستخدام النظام</p>

        <Form layout="vertical" className="auth-form" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="company_name"
            label="اسم المؤسسة"
            rules={[
              { required: true, message: 'أدخل اسم المؤسسة' },
              { min: 3, message: 'الاسم قصير جداً' },
            ]}
          >
            <Input size="large" prefix={<ShopOutlined />} placeholder="مؤسسة الذهب" dir="rtl" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="رقم الهاتف"
            rules={[
              { required: true, message: 'أدخل رقم الهاتف' },
              { pattern: /^05\d{8}$/, message: 'رقم سعودي يبدأ بـ 05 ويتكون من 10 أرقام' },
            ]}
          >
            <Input size="large" prefix={<PhoneOutlined />} placeholder="05xxxxxxxx" dir="rtl" />
          </Form.Item>

          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[
              { required: true, message: 'أدخل كلمة المرور' },
              { min: 6, message: 'على الأقل 6 أحرف' },
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" dir="rtl" />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="تأكيد كلمة المرور"
            dependencies={['password']}
            rules={[
              { required: true, message: 'أعد إدخال كلمة المرور' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject(new Error('كلمتا المرور غير متطابقتين'))
                },
              }),
            ]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" dir="rtl" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block className="auth-btn" loading={loading}>
            إنشاء الحساب
          </Button>

          <div className="auth-footer">
            لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}