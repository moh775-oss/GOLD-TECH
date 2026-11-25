import { useEffect, useState } from 'react'
import { Modal, Form, Select, InputNumber, DatePicker, Input, Row, Col } from 'antd'
import dayjs from 'dayjs'
import notify from '../../lib/notify.jsx'
import { goldOpeningBalancesApi } from './goldOpeningBalancesApi.jsx'

const fmtMoney = (v) =>
    v != null
        ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00'

export default function GoldOpeningBalanceModal({
    open,
    onClose,
    onSuccess,
    onSaved,
    editingRecord,
    optionsData,
    defaultBranchId,
}) {
    const [form] = Form.useForm()
    const [submitting, setSubmitting] = useState(false)

    const branches = optionsData?.branches || []
    const stores = optionsData?.stores || []
    const karats = optionsData?.karats || []

    const weightVal = Form.useWatch('weight', form)
    const priceVal = Form.useWatch('price', form)
    const calculatedTotal = Number(((Number(weightVal || 0)) * (Number(priceVal || 0))).toFixed(2))

    // ✅ إعادة تعيين / تعبئة الحقول عند فتح المودال
    useEffect(() => {
        if (!open) return

        if (editingRecord) {
            form.setFieldsValue({
                branch_id: editingRecord.branch_id ?? defaultBranchId ?? undefined,
                store_id: editingRecord.store_id ?? undefined,
                opening_date: editingRecord.opening_date ? dayjs(editingRecord.opening_date) : dayjs(),
                weight: editingRecord.weight != null ? Number(editingRecord.weight) : undefined,
                karat_id: editingRecord.karat_id ?? undefined,
                price: editingRecord.price != null ? Number(editingRecord.price) : undefined,
                description: editingRecord.description || '',
            })
        } else {
            form.resetFields()
            form.setFieldsValue({
                branch_id: defaultBranchId || branches[0]?.id || undefined,
                store_id: undefined,
                opening_date: dayjs(),
                weight: undefined,
                karat_id: karats[0]?.id ?? undefined,   // ✅ أول عيار تلقائياً
                price: undefined,
                description: '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingRecord, form, karats.length])

    // ✅ ضمان اختيار أول عيار لو العيارات جاءت متأخرة (في وضع الإضافة فقط)
    useEffect(() => {
        if (!open) return
        if (editingRecord) return
        if (!karats.length) return

        const currentKarat = form.getFieldValue('karat_id')
        const stillValid = karats.some((k) => Number(k.id) === Number(currentKarat))
        if (!currentKarat || !stillValid) {
            form.setFieldsValue({ karat_id: karats[0].id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingRecord, karats])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            setSubmitting(true)

            const weight = Number(values.weight)
            const price = Number(values.price)
            const totalAmount = Number((weight * price).toFixed(2))
            const chosenStore = stores.find((s) => Number(s.id) === Number(values.store_id))

            const payload = {
                branch_id: values.branch_id || chosenStore?.branch_id || defaultBranchId,
                store_id: values.store_id,
                opening_date: values.opening_date
                    ? dayjs(values.opening_date).format('YYYY-MM-DD')
                    : dayjs().format('YYYY-MM-DD'),
                weight,
                karat_id: values.karat_id,
                price,
                total_amount: totalAmount,
                description: values.description?.trim() || '',
            }

            const res = editingRecord
                ? await goldOpeningBalancesApi.update(editingRecord.id, payload)
                : await goldOpeningBalancesApi.create(payload)

            if (res.data?.success) {
                notify.success(
                    res.data?.message ||
                    (editingRecord ? 'تم تحديث الرصيد الافتتاحي بنجاح' : 'تم حفظ الرصيد الافتتاحي بنجاح')
                )
                onSuccess?.()
                onSaved?.()
                onClose?.()
            } else {
                notify.error(res.data?.message || 'تعذر حفظ العملية')
            }
        } catch (err) {
            if (err?.errorFields) return
            notify.error(err?.response?.data?.message || err?.message || 'حدث خطأ أثناء الحفظ')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal
            open={Boolean(open)}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={submitting}
            destroyOnClose
            maskClosable={false}
            width={680}
            okText={editingRecord ? 'حفظ التعديل' : 'حفظ الرصيد'}
            cancelText="إلغاء"
            title={
                <div style={{ fontWeight: 900, color: '#7a5d00', fontSize: 16 }}>
                    {editingRecord ? 'تعديل رصيد افتتاحي ذهب' : 'إضافة رصيد افتتاحي ذهب'}
                </div>
            }
        >
            <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
                <Row gutter={[12, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="store_id"
                            label="الخزينة"
                            rules={[{ required: true, message: 'يرجى اختيار الخزينة' }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="label"
                                placeholder="اختر الخزينة"
                                options={stores.map((s) => ({ value: s.id, label: s.name }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="opening_date"
                            label="التاريخ"
                            rules={[{ required: true, message: 'يرجى تحديد التاريخ' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[12, 8]}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="weight"
                            label="الوزن (جم)"
                            rules={[
                                { required: true, message: 'يرجى إدخال الوزن' },
                                { type: 'number', min: 0.001, message: 'الوزن يجب أن يكون أكبر من صفر' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0.001}
                                step={0.001}
                                precision={3}
                                placeholder="0.000"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="karat_id"
                            label="العيار"
                            rules={[{ required: true, message: 'يرجى اختيار العيار' }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="label"
                                placeholder="اختر العيار"
                                options={karats.map((k) => ({ value: k.id, label: k.name }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="price"
                            label="السعر"
                            rules={[
                                { required: true, message: 'يرجى إدخال السعر' },
                                { type: 'number', min: 0, message: 'السعر لا يمكن أن يكون سالباً' },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                step={0.01}
                                precision={2}
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[12, 8]}>
                    <Col xs={24}>
                        <Form.Item name="description" label="البيان">
                            <Input.TextArea rows={2} placeholder="اكتب البيان..." />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[12, 8]}>
                    <Col xs={24}>
                        <div
                            style={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                background: 'rgba(184, 134, 11, 0.12)',
                                border: '1px solid rgba(184, 134, 11, 0.45)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontWeight: 800,
                                color: '#7a5d00',
                            }}
                        >
                            <span>الإجمالي</span>
                            <span style={{ fontSize: 16, fontWeight: 900 }}>{fmtMoney(calculatedTotal)}</span>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}