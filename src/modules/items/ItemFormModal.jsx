import { useEffect, useState, useRef } from 'react'
import { Form, Input, Switch, InputNumber, Select, Row, Col, Button, Tooltip } from 'antd'
import { ReloadOutlined, PrinterFilled } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext.jsx'
import notify from '../../lib/notify.jsx'
import { itemsApi } from './itemsApi.jsx'
import AppModal from '../../components/AppModal.jsx'
import ItemPrintModal from './ItemPrintModal.jsx'
import './ItemFormModal.css'

export default function ItemFormModal({ open, onClose, item, onSaved }) {
  const { session } = useAuth()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [printData, setPrintData] = useState({ barcode: '', name: '', price: '', unit: '' })
  const barcodeRef = useRef(null)

  const [options, setOptions] = useState({
    categories: [], karats: [], taxes: [], currencies: [], stores: [],
    units: [], item_types: [], gold_types: [],
  })

  const loadOptions = async () => {
    try {
      const res = await itemsApi.meta()
      if (res.data.success) {
        setOptions(res.data.data)
        return res.data.data
      }
    } catch (e) {
      console.error('meta:', e.response?.data || e.message)
    }
    return null
  }

  useEffect(() => {
    if (!open) return
    loadOptions().then((data) => {
      if (item) {
        form.setFieldsValue({
          ...item,
          is_active: item.is_active === 1 || item.is_active === true,
          is_sellable: item.is_sellable === 1 || item.is_sellable === true,
          is_purchasable: item.is_purchasable === 1 || item.is_purchasable === true,
          is_trackable: item.is_trackable === 1 || item.is_trackable === true,
        })
      } else {
        resetForm(data)
        fetchNextBarcode()
      }
      setTimeout(() => barcodeRef.current?.focus(), 300)
    })
  }, [open, item])

  const resetForm = (data) => {
    const firstTax = data?.taxes?.[0] || null
    const firstKarat = data?.karats?.[0] || null
    form.resetFields()
    form.setFieldsValue({
      item_type: 'worked',
      gold_type: 'worked',
      unit: 'جرام',
      is_active: true, is_sellable: true, is_purchasable: true, is_trackable: true,
      tax_id: firstTax?.id || null,
      tax_rate: firstTax ? Number(firstTax.rate) : 0,
      karat_id: firstKarat?.id || null,
    })
  }

  const fetchNextBarcode = async () => {
    try {
      const res = await itemsApi.nextBarcode()
      if (res.data.success) {
        form.setFieldValue('barcode', res.data.data.barcode)
      }
    } catch (e) {
      console.error('nextBarcode:', e.response?.data || e.message)
    }
  }

  const handleBarcodeBlur = async () => {
    const current = form.getFieldValue('barcode')
    if (!current || String(current).trim() === '') {
      await fetchNextBarcode()
    }
  }

  const handleOk = async () => {
    let values
    try { values = await form.validateFields() } catch { return }

    setSaving(true)
    try {
      const payload = {
        ...values,
        branch_id: session?.branch_id,
        is_active: values.is_active ? 1 : 0,
        is_sellable: values.is_sellable ? 1 : 0,
        is_purchasable: values.is_purchasable ? 1 : 0,
        is_trackable: values.is_trackable ? 1 : 0,
      }

      const res = item?.id ? await itemsApi.update(item.id, payload) : await itemsApi.create(payload)
      if (res.data.success) {
        notify.success(res.data.message)
        onSaved?.(res.data.data)
        if (!item) {
          const data = await loadOptions()
          resetForm(data)
          fetchNextBarcode()
          setTimeout(() => barcodeRef.current?.focus(), 200)
        }
      } else {
        notify.error(res.data.message)
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const openPrint = () => {
    setPrintData({
      barcode: form.getFieldValue('barcode') || '',
      name: form.getFieldValue('name') || '',
      price: form.getFieldValue('sale_price_with_tax') || '',
      unit: form.getFieldValue('unit') || '',
    })
    setPrintOpen(true)
  }

  const currentTaxRate = Form.useWatch('tax_rate', form) || 0
  const saleWithTax = Form.useWatch('sale_price_with_tax', form) || 0
  const purchaseWithTax = Form.useWatch('purchase_price_with_tax', form) || 0
  const makingSale = Form.useWatch('making_charge_sale', form) || 0
  const makingPurchase = Form.useWatch('making_charge_purchase', form) || 0

  const totalSale = Number(saleWithTax) + Number(makingSale)
  const totalPurchase = Number(purchaseWithTax) + Number(makingPurchase)

  return (
    <AppModal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title={item ? 'تعديل صنف' : 'إضافة صنف'}
      okText="حفظ"
      cancelText="إغلاق"
      confirmLoading={saving}
      width={980}
    >
      <Form form={form} layout="vertical" dir="rtl" size="small">

        <Row gutter={10}>
          <Col xs={24} md={14}>
            <Row gutter={6}>
              <Col xs={24} md={10}>
                <Form.Item label="الباركود" style={{ marginBottom: 6 }}>
                  <div className="barcode-input-wrap">
                    <Form.Item name="barcode" noStyle>
                      <Input
                        ref={barcodeRef}
                        placeholder="تلقائياً"
                        onBlur={handleBarcodeBlur}
                      />
                    </Form.Item>
                    <Tooltip title="توليد جديد">
                      <Button size="small" icon={<ReloadOutlined />} onClick={fetchNextBarcode} />
                    </Tooltip>
                    <Tooltip title="طباعة ملصق">
                      <Button size="small" icon={<PrinterFilled />} onClick={openPrint} />
                    </Tooltip>
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} md={14}>
                <Form.Item name="category_id" label="المجموعة" rules={[{ required: true }]} style={{ marginBottom: 6 }}>
                  <Select
                    allowClear
                    placeholder="اختر المجموعة"
                    options={options.categories.map(c => ({ value: c.id, label: c.parent_id ? `— ${c.name}` : c.name }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={6}>
              <Col xs={12}>
                <Form.Item name="name" label="اسم الصنف (عربي)" rules={[{ required: true }]} style={{ marginBottom: 6 }}>
                  <Input placeholder="اسم الصنف" />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="name_en" label="اسم الصنف (إنجليزي)" style={{ marginBottom: 6 }}>
                  <Input placeholder="English name" />
                </Form.Item>
              </Col>
            </Row>

            <div className="info-card">
              <div className="info-card-title">الأسعار والأجور</div>

              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name="sale_price_with_tax" label="إجمالي سعر البيع" style={{ marginBottom: 6 }}>
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="purchase_price_with_tax" label="إجمالي سعر الشراء" style={{ marginBottom: 6 }}>
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name="making_charge_sale" label="أجرة البيع" style={{ marginBottom: 6 }}>
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="making_charge_purchase" label="أجرة الشراء" style={{ marginBottom: 6 }}>
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <div className="totals-box">
                <div className="total-item">
                  <span className="total-label">إجمالي البيع</span>
                  <span className="total-value green">{Number(totalSale).toFixed(2)}</span>
                </div>
                <div className="total-divider" />
                <div className="total-item">
                  <span className="total-label">إجمالي الشراء</span>
                  <span className="total-value blue">{Number(totalPurchase).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div className="info-card">
              <div className="info-card-title">النوع والتصنيف</div>

              <Form.Item label="الضريبة" style={{ marginBottom: 6 }}>
                <div className="tax-wrap">
                  <Form.Item name="tax_id" noStyle>
                    <Select
                      allowClear
                      placeholder="اختر الضريبة"
                      className="tax-select"
                      onChange={(id) => {
                        const tax = options.taxes.find(t => t.id === id)
                        form.setFieldValue('tax_rate', tax ? Number(tax.rate) : 0)
                      }}
                      options={options.taxes.map(t => ({ value: t.id, label: t.name }))}
                    />
                  </Form.Item>
                  <span className="tax-rate-text">{Number(currentTaxRate).toFixed(0)}%</span>
                </div>
              </Form.Item>

              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name="item_type" label="نوع الصنف" rules={[{ required: true }]} style={{ marginBottom: 6 }}>
                    <Select options={options.item_types.map(t => ({ value: t.value, label: t.label }))} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="gold_type" label="نوع الذهب" style={{ marginBottom: 6 }}>
                    <Select allowClear options={options.gold_types.map(t => ({ value: t.value, label: t.label }))} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name="unit" label="الوحدة" style={{ marginBottom: 6 }}>
                    <Select options={options.units.map(u => ({ value: u, label: u }))} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name="karat_id" label="العيار" style={{ marginBottom: 6 }}>
                    <Select allowClear options={options.karats.map(k => ({
                      value: k.id,
                      label: `${k.name} (${Number(k.the_value).toFixed(3)})`,
                    }))} />
                  </Form.Item>
                </Col>
              </Row>

              <div className="status-row">
                <span className="status-label">الحالة:</span>
                <Form.Item name="is_active" valuePropName="checked" noStyle>
                  <Switch checkedChildren="نشط" unCheckedChildren="موقوف" size="small" />
                </Form.Item>
                <Form.Item name="is_sellable" valuePropName="checked" noStyle>
                  <Switch checkedChildren="بيع" unCheckedChildren="بيع" size="small" />
                </Form.Item>
                <Form.Item name="is_purchasable" valuePropName="checked" noStyle>
                  <Switch checkedChildren="شراء" unCheckedChildren="شراء" size="small" />
                </Form.Item>
                <Form.Item name="is_trackable" valuePropName="checked" noStyle>
                  <Switch checkedChildren="تتبع" unCheckedChildren="تتبع" size="small" />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>

      </Form>

      <ItemPrintModal open={printOpen} onClose={() => setPrintOpen(false)} data={printData} />
    </AppModal>
  )
}