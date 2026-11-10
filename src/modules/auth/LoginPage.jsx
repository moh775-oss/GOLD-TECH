import { useEffect, useState } from 'react'
import { Button, Form, Input, Select, Space, Typography } from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import '../../styles/auth.css'
import logo from '../../assets/Logo.png'

const { Text } = Typography

export default function LoginPage() {
  const { checkCredentials, login } = useAuth()
  
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const [branches, setBranches] = useState([])
  const [fiscalYears, setFiscalYears] = useState([])
  const [checkedUser, setCheckedUser] = useState(null)
  const [credentials, setCredentials] = useState({ mobile: '', password: '' })

  // الخطوة 1: التحقق
  const onCheck = async (values) => {
    setLoading(true)
    try {
      const data = await checkCredentials(values.mobile, values.password)
      setCheckedUser(data.user)
      setBranches(data.branches)
      setFiscalYears(data.fiscal_years)
      setCredentials(values)

      if (!data.branches.length) return notify.error('لا توجد فروع مفعلة')
      if (!data.fiscal_years.length) return notify.error('لا توجد سنوات مالية مفعلة')

      // اختيار تلقائي: آخر سنة مالية + أول فرع
      const lastFiscal = [...data.fiscal_years].sort((a, b) => {
        return new Date(b.start_date) - new Date(a.start_date)
      })[0]
      const firstBranch = data.branches.find((b) => b.is_main) || data.branches[0]

      form.setFieldsValue({
        branch_id: firstBranch.id,
        fiscal_year_id: lastFiscal.id,
      })

      notify.success('اختر الفرع والسنة المالية ثم اضغط دخول')
    } catch (e) {
      notify.error(e.message || 'بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  // الخطوة 2: الدخول النهائي
  const onLogin = async (values) => {
    setLoading(true)
    try {
      await login(
        credentials.mobile,
        credentials.password,
        values.branch_id,
        values.fiscal_year_id
      )
      notify.success('تم تسجيل الدخول')
      navigate('/')
    } catch (e) {
      notify.error(e.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="شعار النظام" className="auth-logo-img" />
        </div>
        <h1 className="auth-title"> جولد تاك</h1>
        <p className="auth-subtitle">تسجيل الدخول إلى حسابك</p>

        {!checkedUser ? (
          // ============ الخطوة 1 ============
          <Form form={form} layout="vertical" className="auth-form" onFinish={onCheck} requiredMark={false}>
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
                  const v = e.target.value.replace(/[^0-9]/g, '')
                  form.setFieldValue('mobile', v)
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="كلمة المرور"
              rules={[{ required: true, message: 'أدخل كلمة المرور' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block className="auth-btn" loading={loading}>
              متابعة
            </Button>

            <div className="auth-footer">
              ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
            </div>
          </Form>
        ) : (
          // ============ الخطوة 2: كل الحقول في صفحة واحدة ============
          <>
            <div className="auth-greeting">
              مرحباً، <strong>{checkedUser.name}</strong>
            </div>

            <Form form={form} layout="vertical" className="auth-form" onFinish={onLogin} requiredMark={false}>
              {/* السنة المالية أولاً */}
              <Form.Item
                name="fiscal_year_id"
                label="السنة المالية"
                rules={[{ required: true, message: 'اختر السنة المالية' }]}
              >
                <Select
                  size="large"
                  placeholder="اختر السنة المالية"
                  options={fiscalYears.map((f) => ({
                    value: f.id,
                    label: `${f.name} (${f.start_date} → ${f.end_date})`,
                    disabled: f.is_closed,
                  }))}
                />
              </Form.Item>

              {/* الفرع */}
              <Form.Item
                name="branch_id"
                label="الفرع"
                rules={[{ required: true, message: 'اختر الفرع' }]}
              >
                <Select
                  size="large"
                  placeholder="اختر الفرع"
                  options={branches.map((b) => ({
                    value: b.id,
                    label: b.is_main ? `${b.name} (رئيسي)` : b.name,
                  }))}
                />
              </Form.Item>

              <Space style={{ width: '100%', marginTop: 6 }} size="middle">
                
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="auth-btn"
                  style={{ flex: '0 0 80%' }}
                  loading={loading}
                >
                  دخول
                </Button>
                <Button
                  size="large"
                  className="auth-btn-secondary"
                  style={{ flex: '0 0 20%' }}
                  onClick={() => { setCheckedUser(null); setBranches([]); setFiscalYears([]) }}
                >
                  رجوع
                </Button>
              </Space>
            </Form>
          </>
        )}
      </div>
    </div>
  )
}