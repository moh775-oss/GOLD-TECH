import { useState } from 'react'
import { Button, Form, Input, Select, Space, Typography } from 'antd'
import {  PhoneOutlined , LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import '../../styles/auth.css'
import logo from '../../assets/Logo.png'

const { Text } = Typography

export default function LoginPage() {
  const { checkCredentials, login } = useAuth()
  const notify = useNotification()
  const navigate = useNavigate()
  const [step, setStep] = useState('credentials')
  const [loading, setLoading] = useState(false)
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()

  const [user, setUser] = useState(null)
  const [branches, setBranches] = useState([])
  const [fiscalYears, setFiscalYears] = useState([])
  const [credentials, setCredentials] = useState({ mobile: '', password: '' })

  const onCheck = async (values) => {
    setLoading(true)
    try {
      const data = await checkCredentials(values.mobile, values.password)
      setUser(data.user)
      setBranches(data.branches)
      setFiscalYears(data.fiscal_years)
      setCredentials(values)

      if (!data.branches.length) return notify.error('لا توجد فروع مفعلة')
      if (!data.fiscal_years.length) return notify.error('لا توجد سنوات مالية مفعلة')

      setStep('select')
      notify.success('اختر الفرع والسنة المالية')
    } catch (e) {
      notify.error(e.message || 'بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  const onLogin = async (values) => {
    setLoading(true)
    try {
      await login(credentials.mobile, credentials.password, values.branch_id, values.fiscal_year_id)
      notify.success('تم تسجيل الدخول')
      navigate('/contacts')
    } catch (e) {
      notify.error(e.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    setStep('credentials')
    setUser(null)
    setBranches([])
    setFiscalYears([])
    form2.resetFields()
  }

  return (
    <div className="auth-wrapper" >
      <div className="auth-card">
        <div className="auth-logo">
            <img src={logo} alt="شعار النظام" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">نظام الذهب</h1>
        <p className="auth-subtitle">تسجيل الدخول إلى حسابك</p>

        {step === 'credentials' ? (
          <Form form={form1} layout="vertical" className="auth-form" onFinish={onCheck} requiredMark={false}>
            <Form.Item
  name="mobile"
  label="رقم الهاتف"
  rules={[{ required: true, message: 'أدخل رقم الهاتف' }]}
>
  <Input
    size="large"
    placeholder="05xxxxxxxx"
    prefix={<PhoneOutlined />}
    inputMode="numeric"
    maxLength={15}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, '')
      form1.setFieldValue('mobile', value)
    }}
  />
</Form.Item>

            <Form.Item
              name="password"
              label="كلمة المرور"
              rules={[{ required: true, message: 'أدخل كلمة المرور' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
                
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block className="auth-btn" loading={loading}>
              متابعة
            </Button>

            <div className="auth-footer">
              ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
            </div>
          </Form>
        ) : (
          <>
            <div className="auth-stepper">
              <span className="auth-step-dot active" />
              <span className="auth-step-dot active" />
            </div>

            <div className="auth-greeting">
              مرحباً، <strong>{user?.name}</strong>
            </div>

            <Form form={form2} layout="vertical" className="auth-form" onFinish={onLogin} requiredMark={false}>
              <Form.Item name="branch_id" label="الفرع" rules={[{ required: true, message: 'اختر الفرع' }]}>
                <Select
                  size="large"
                  placeholder="اختر الفرع"
                  dir="rtl"
                  options={branches.map((b) => ({
                    value: b.id,
                    label: b.is_main ? `${b.name} (رئيسي)` : b.name,
                  }))}
                />
              </Form.Item>

              <Form.Item name="fiscal_year_id" label="السنة المالية" rules={[{ required: true, message: 'اختر السنة المالية' }]}>
                <Select
                  size="large"
                  placeholder="اختر السنة المالية"
                  dir="rtl"
                  options={fiscalYears.map((f) => ({
                    value: f.id,
                    label: `${f.name} (${f.start_date} → ${f.end_date})`,
                    disabled: f.is_closed,
                  }))}
                />
              </Form.Item>

              <Space style={{ width: '100%', marginTop: 6 }} size="middle">
                <Button size="large" className="auth-btn-secondary" style={{ flex: 1 }} onClick={back}>
                  رجوع
                </Button>
                <Button type="primary" htmlType="submit" size="large" className="auth-btn" style={{ flex: 2 }} loading={loading}>
                  دخول
                </Button>
              </Space>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}