import { useState, useRef } from 'react'
import { Button, Form, Input, Select, Spin } from 'antd'
import { PhoneOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import '../../styles/auth.css'
import logo from '../../assets/Logo.png'

export default function LoginPage() {
  const { checkMobile, login } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [form] = Form.useForm()

  const [user, setUser] = useState(null)
  const [branches, setBranches] = useState([])
  const [fiscalYears, setFiscalYears] = useState([])
  const [mobileVerified, setMobileVerified] = useState(false)

  const lastCheckedMobile = useRef('')

  // ✅ فحص الرقم تلقائياً لما يخرج من الحقل
  const handleMobileBlur = async () => {
    const mobile = form.getFieldValue('mobile')
    if (!mobile || mobile.length < 9) return
    if (mobile === lastCheckedMobile.current) return

    lastCheckedMobile.current = mobile
    setChecking(true)
    try {
      const data = await checkMobile(mobile)
      setUser(data.user)
      setBranches(data.branches || [])
      setFiscalYears(data.fiscal_years || [])
      setMobileVerified(true)

      if (!data.branches?.length) {
        notify.error('لا توجد فروع مفعلة')
        return
      }
      if (!data.fiscal_years?.length) {
        notify.error('لا توجد سنوات مالية مفعلة')
        return
      }

      const lastFiscal = [...data.fiscal_years].sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      )[0]
      const firstBranch = data.branches.find((b) => b.is_main) || data.branches[0]

      form.setFieldsValue({
        branch_id: firstBranch.id,
        fiscal_year_id: lastFiscal.id,
      })
    } catch (e) {
      setUser(null)
      setBranches([])
      setFiscalYears([])
      setMobileVerified(false)
      notify.error(e.response?.data?.message || e.message || 'الرقم غير مسجل')
    } finally {
      setChecking(false)
    }
  }

  // ✅ الدخول النهائي
  const onLogin = async (values) => {
    if (!mobileVerified) {
      notify.error('أدخل رقم هاتف صحيح أولاً')
      return
    }

    setLoading(true)
    try {
      await login(values.mobile, values.password, values.branch_id, values.fiscal_year_id)
      notify.success('تم تسجيل الدخول')
      navigate('/')
    } catch (e) {
      notify.error(e.response?.data?.message || e.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  // ✅ أي تغيير في الرقم → صفّر التحقق
  const handleMobileChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, '')
    form.setFieldValue('mobile', v)

    if (v !== lastCheckedMobile.current) {
      lastCheckedMobile.current = ''
      setMobileVerified(false)
      setUser(null)
      setBranches([])
      setFiscalYears([])
      form.setFieldsValue({ branch_id: undefined, fiscal_year_id: undefined })
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="شعار النظام" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">جولد تاك</h1>
        <p className="auth-subtitle">تسجيل الدخول إلى حسابك</p>

        <Form
          form={form}
          layout="vertical"
          className="auth-form"
          onFinish={onLogin}
          requiredMark={false}
        >
          {/* 1. رقم الهاتف */}
          <Form.Item
            name="mobile"
            label="رقم الهاتف"
            rules={[{ required: true, message: 'أدخل رقم الهاتف' }]}
          >
            <Input
              size="large"
              placeholder="05xxxxxxxx"
              prefix={<PhoneOutlined />}
              suffix={
                checking ? (
                  <Spin size="small" />
                ) : mobileVerified ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : null
              }
              inputMode="numeric"
              maxLength={15}
              onChange={handleMobileChange}
              onBlur={handleMobileBlur}
            />
          </Form.Item>

          {/* 2. كلمة المرور — معطلة لحد ما الرقم يتحقق */}
          <Form.Item
            name="password"
            label="كلمة المرور"
            rules={[{ required: true, message: 'أدخل كلمة المرور' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder={mobileVerified ? '••••••••' : 'أدخل رقم الهاتف أولاً'}
              disabled={!mobileVerified}
            />
          </Form.Item>

          {/* 3. السنة المالية — معطلة لحد ما الرقم يتحقق */}
          <Form.Item
            name="fiscal_year_id"
            label="السنة المالية"
            rules={[{ required: true, message: 'اختر السنة المالية' }]}
          >
            <Select
              size="large"
              placeholder={mobileVerified ? 'اختر السنة المالية' : 'أدخل رقم الهاتف أولاً'}
              style={{ width: '100%' }}
              popupMatchSelectWidth
              disabled={!mobileVerified}
              options={fiscalYears.map((f) => ({
                value: f.id,
                label: f.name,
                disabled: f.is_closed,
              }))}
            />
          </Form.Item>

          {/* 4. الفرع — معطل لحد ما الرقم يتحقق */}
          <Form.Item
            name="branch_id"
            label="الفرع"
            rules={[{ required: true, message: 'اختر الفرع' }]}
          >
            <Select
              size="large"
              placeholder={mobileVerified ? 'اختر الفرع' : 'أدخل رقم الهاتف أولاً'}
              style={{ width: '100%' }}
              popupMatchSelectWidth
              disabled={!mobileVerified}
              options={branches.map((b) => ({
                value: b.id,
                label: b.is_main ? `${b.name} (رئيسي)` : b.name,
              }))}
            />
          </Form.Item>

          {/* زر الدخول — معطل لحد ما الرقم يتحقق */}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="auth-btn"
            style={{ height: 48 }}
            loading={loading}
            disabled={!mobileVerified}
          >
            دخول
          </Button>

          <div className="auth-footer" style={{ marginTop: 12 }}>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}