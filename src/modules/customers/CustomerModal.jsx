import { Modal, Form, Input, InputNumber, Row, Col } from 'antd'

export default function CustomerModal({ open, onCancel, onSave }) {
  const [form] = Form.useForm()

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onSave?.(values)
      form.resetFields()
    } catch {
      // أخطاء التحقق تظهر تلقائياً
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel?.()
  }

  return (
    <Modal
      title="إضافة عميل جديد"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="حفظ"
      cancelText="إلغاء"
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'أدخل الاسم' }]}>
              <Input placeholder="اسم العميل" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="رقم الهوية" name="idNumber">
              <Input placeholder="رقم الهوية الوطنية" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="الرقم الضريبي" name="taxNumber">
              <Input placeholder="الرقم الضريبي إن وجد" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="السجل التجاري" name="commercialRegister">
              <Input placeholder="رقم السجل التجاري إن وجد" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="المدينة" name="city">
              <Input placeholder="مثال: الرياض، جدة، الدمام" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="الحي" name="district">
              <Input placeholder="اسم الحي" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="العنوان" name="address">
              <Input placeholder="العنوان التفصيلي" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="الرصيد الافتتاحي" name="openingBalance">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                step={0.01}
                addonAfter="ر.س"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}