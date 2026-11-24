import { useEffect, useState } from 'react'
import { Card, Form, Input, Button, Row, Col, Upload, Avatar } from 'antd'
import { UploadOutlined, SaveOutlined, PictureOutlined } from '@ant-design/icons'
import api from '../../lib/api'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function CompanyInfoPage() {
  const { session, refreshPermissions } = useAuth()
  const [form] = Form.useForm()
  const [info, setInfo] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)   // معاينة فورية
  const [imageError, setImageError] = useState(false)  // لو الصورة فشلت

  const fetchInfo = async () => {
    try {
      const res = await api.get('/company-info')
      if (res.data.success) {
        setInfo(res.data.data)
        form.setFieldsValue(res.data.data)
      }
    } catch { notify.error('فشل الجلب') }
  }

  useEffect(() => { fetchInfo() }, [])

  // إعادة تعيين خطأ الصورة عند تغييرها
  useEffect(() => { setImageError(false) }, [info?.logo_url, previewUrl])

  // ============== الحفظ ==============
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      const res = await api.put('/company-info', values)
      if (res.data.success) {
        setInfo(res.data.data)
        notify.success('تم حفظ بيانات الشركة بنجاح')   // ✅ رسالة نجاح
        await refreshPermissions()
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally { setSaving(false) }
  }

  // ============== رفع الشعار ==============
  const handleUpload = async (file) => {
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)      // ✅ معاينة فورية
    setImageError(false)

    const fd = new FormData()
    fd.append('logo', file)
    setUploading(true)
    try {
      const res = await api.post('/company-info/logo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        setInfo(res.data.data)
        URL.revokeObjectURL(localUrl)
        setPreviewUrl(null)       // نستخدم logo_url من السيرفر الآن
        await refreshPermissions()
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الرفع')
      URL.revokeObjectURL(localUrl)
      setPreviewUrl(null)
    } finally { setUploading(false) }
    return false
  }

  const displaySrc = !imageError ? (previewUrl || info?.logo_url) : null

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="بيانات الشركة"
        extra={
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
            حفظ
          </Button>
        }
      >
        <Row gutter={24}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar
              shape="square"
              size={160}
              src={displaySrc}
              icon={!displaySrc ? <PictureOutlined /> : undefined}
              onError={() => { setImageError(true); return false }}
              style={{ border: '1px solid #eee', borderRadius: 8, background: '#fafafa' }}
            >
              {!displaySrc && 'شعار'}
            </Avatar>
            <div style={{ marginTop: 12 }}>
              <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*">
                <Button icon={<UploadOutlined />} loading={uploading}>رفع الشعار</Button>
              </Upload>
            </div>
            {uploading && <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>جاري الرفع...</div>}
          </Col>

          <Col xs={24} md={16}>
            <Form form={form} layout="vertical" dir="rtl">
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="name" label="الاسم (عربي)" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="name_en" label="الاسم (إنجليزي)">
                    <Input dir="ltr" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="tax_number"
                    label="الرقم الضريبي"
                    rules={[
                      { pattern: /^3\d{13}3$/, message: 'الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ وينتهي بالرقم 3' },
                    ]}
                  >
                    <Input inputMode="numeric" maxLength={15} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="commercial_register"
                    label="السجل التجاري"
                    rules={[
                      { pattern: /^\d{10}$/, message: 'يجب أن يتكون الرقم من 10 أرقام' },
                    ]}
                  >
                    <Input inputMode="numeric" maxLength={10} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="الهاتف">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="mobile" label="الجوال">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="email" label="البريد الإلكتروني">
                    <Input dir="ltr" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="website" label="الموقع">
                    <Input dir="ltr" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="country" label="الدولة">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="city" label="المدينة">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="district" label="الحي / المنطقة">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="street" label="الشارع">
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={12} md={12}>
                  <Form.Item
                    name="building_no"
                    label="رقم المبنى"
                    rules={[{ pattern: /^\d{4}$/, message: 'رقم المبنى يجب أن يتكون من 4 أرقام' }]}
                  >
                    <Input inputMode="numeric" maxLength={4} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={12}>
                  <Form.Item
                    name="postal_code"
                    label="الرمز البريدي"
                    rules={[{ pattern: /^\d{5}$/, message: 'الرمز البريدي يجب أن يتكون من 5 أرقام' }]}
                  >
                    <Input inputMode="numeric" maxLength={5} />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item name="address" label="العنوان الكامل (يظهر في الطباعة)">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  )
}