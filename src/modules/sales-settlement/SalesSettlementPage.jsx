import { useState, useMemo } from 'react'
import {
  Card, Form, Input, Select, InputNumber, Button, Row, Col, Space,
  DatePicker, Divider, Statistic, message,
} from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { RiyalSymbol } from 'riyal/react'
import CustomerModal from '../customers/CustomerModal'

const GOLD_KARATS = [
  { value: 24, label: 'عيار 24' },
  { value: 22, label: 'عيار 22' },
  { value: 21, label: 'عيار 21' },
  { value: 18, label: 'عيار 18' },
  { value: 14, label: 'عيار 14' },
]

export default function SalesSettlementPage() {
  const [form] = Form.useForm()
  const [customerModalOpen, setCustomerModalOpen] = useState(false)

  const weight = Form.useWatch('weight', form) || 0
  const pricePerGram = Form.useWatch('pricePerGram', form) || 0

  const total = useMemo(
    () => (Number(weight) || 0) * (Number(pricePerGram) || 0),
    [weight, pricePerGram]
  )

  const handleAddCustomer = (customer) => {
    form.setFieldValue('customerId', customer.name)
    setCustomerModalOpen(false)
    message.success('تمت إضافة العميل')
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('بيانات تسكير مبيعات:', {
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
        total,
      })
      message.success('تم حفظ تسكير المبيعات (تجريبي)')
    } catch {
      message.error('تحقق من الحقول المطلوبة')
    }
  }

  return (
    <Card title="تسكير مبيعات" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{ date: dayjs() }}
        style={{ width: '100%' }}
      >
        {/* الصف الأول: العميل + التاريخ */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="العميل"
              name="customerId"
              rules={[{ required: true, message: 'اختر العميل' }]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="اختر العميل أو أضف جديداً"
                suffix={
                  <UserAddOutlined
                    style={{ cursor: 'pointer', color: '#d4a017', fontSize: 18 }}
                    onClick={() => setCustomerModalOpen(true)}
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="التاريخ"
              name="date"
              rules={[{ required: true, message: 'اختر التاريخ' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        {/* الصف الثاني: الوزن + العيار + سعر الجرام */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="الوزن (جرام)"
              name="weight"
              rules={[{ required: true, message: 'أدخل الوزن' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
                addonAfter="جم"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="العيار"
              name="karat"
              rules={[{ required: true, message: 'اختر العيار' }]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="اختر العيار"
                options={GOLD_KARATS}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="سعر الجرام"
              name="pricePerGram"
              rules={[{ required: true, message: 'أدخل سعر الجرام' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
                addonAfter={<RiyalSymbol />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col xs={24} md={12}>
            <Statistic
              title="الإجمالي"
              value={total}
              precision={2}
              suffix={<RiyalSymbol />}
              valueStyle={{ color: '#d4a017', fontWeight: 700 }}
            />
          </Col>
        </Row>

        <Space style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleSave}>
            حفظ تسكير المبيعات
          </Button>
          <Button onClick={() => form.resetFields()}>مسح</Button>
        </Space>
      </Form>

      <CustomerModal
        open={customerModalOpen}
        onCancel={() => setCustomerModalOpen(false)}
        onSave={handleAddCustomer}
      />
    </Card>
  )
}