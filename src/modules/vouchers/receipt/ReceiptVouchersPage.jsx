import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, Select, Col, Row, Button, DatePicker } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import DataTable from '../../../components/ReportGenerator.jsx'
import notify from '../../../lib/notify.jsx'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { receiptVouchersApi } from './receiptVouchersApi.jsx'
import ReceiptVoucherFormModal from './ReceiptVoucherFormModal.jsx'
import ReceiptVoucherViewModal from './ReceiptVoucherViewModal.jsx'
import ReceiptVoucherPrintModal from './ReceiptVoucherPrintModal.jsx'
import { buildReceiptVoucherColumns } from './receiptVouchersConfig.jsx'

const getDefaultDateRange = () => ({
  from: dayjs().startOf('month').format('YYYY-MM-DD'),
  to: dayjs().format('YYYY-MM-DD'),
})

export default function ReceiptVouchersPage() {
  const { session } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [printing, setPrinting] = useState(null)

  const [contacts, setContacts] = useState([])
  const [safes, setSafes] = useState([])
  const [banks, setBanks] = useState([])
  const [stores, setStores] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [karats, setKarats] = useState([])
  const [costCenters, setCostCenters] = useState([])

  const [filters, setFilters] = useState(() => ({
    branch_id: session?.branch_id,
    contact_id: undefined,
    safe_id: undefined,
    bank_id: undefined,
    store_id: undefined,
    payment_method: undefined,
    currency_id: undefined,
    karat_id: undefined,
    status: undefined,
    ...getDefaultDateRange(),
    q: undefined,
  }))

  // جلب كل الـ helpers من endpoint واحد
  useEffect(() => {
    (async () => {
      try {
        const res = await receiptVouchersApi.options()
        if (res.data.success) {
          const d = res.data.data
          setContacts(d.contacts || [])
          setSafes(d.safes || [])
          setBanks(d.banks || [])
          setStores(d.stores || [])
          setCurrencies(d.currencies || [])
          setKarats(d.karats || [])
          setCostCenters(d.cost_centers || [])
        }
      } catch (e) { console.error('options:', e) }
    })()
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      if (params.from) params.from = dayjs(params.from).format('YYYY-MM-DD')
      if (params.to) params.to = dayjs(params.to).format('YYYY-MM-DD')
      Object.keys(params).forEach(k => params[k] == null && delete params[k])
      const res = await receiptVouchersApi.list(params)
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message || 'فشل الجلب')
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (row) => { setEditing(row); setFormOpen(true) }
  const openView = async (row) => {
    try {
      const res = await receiptVouchersApi.show(row.id, filters)
      if (res.data.success) { setViewing(res.data.data); setViewOpen(true) }
    } catch { notify.error('فشل جلب السند') }
  }
  const openPrint = async (row) => {
    try {
      const res = await receiptVouchersApi.print(row.id)
      if (res.data.success) { setPrinting(res.data.data); setPrintOpen(true) }
    } catch { notify.error('فشل جلب بيانات الطباعة') }
  }
  const onDelete = async (row) => {
    try {
      const res = await receiptVouchersApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الحذف'); fetchData() }
      else notify.error(res.data.message || 'فشل الحذف')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }
  const onPost = async (row) => {
    try {
      const res = await receiptVouchersApi.post(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الترحيل'); fetchData() }
      else notify.error(res.data.message || 'فشل الترحيل')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الترحيل') }
  }
  const onSaved = () => { setFormOpen(false); fetchData() }

  const resetFilters = () => setFilters({
    branch_id: session?.branch_id,
    contact_id: undefined, safe_id: undefined, bank_id: undefined, store_id: undefined,
    payment_method: undefined, currency_id: undefined, karat_id: undefined,
    status: undefined, ...getDefaultDateRange(), q: undefined,
  })

  const columns = useMemo(
    () => buildReceiptVoucherColumns({ onEdit: openEdit, onDelete, onView: openView, onPrint: openPrint, onPost }),
    []
  )

  const defaultRange = getDefaultDateRange()
  const hasFilters =
    filters.contact_id || filters.safe_id || filters.bank_id || filters.store_id ||
    filters.payment_method || filters.currency_id || filters.karat_id ||
    filters.status || filters.q ||
    (filters.from && dayjs(filters.from).format('YYYY-MM-DD') !== defaultRange.from) ||
    (filters.to && dayjs(filters.to).format('YYYY-MM-DD') !== defaultRange.to)

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="page-header-banner" >
          إدارة  سندات القبض
        </div>
        <div style={{ marginBottom: 20 }}>
          <Row gutter={[8, 8]}>
            <Col xs={12} md={4}>
              <Select allowClear showSearch optionFilterProp="label" placeholder="الحساب" style={{ width: '100%' }}
                value={filters.contact_id} onChange={(v) => setFilters({ ...filters, contact_id: v })}
                options={contacts.map(c => ({ value: c.id, label: c.name }))} />
            </Col>
            <Col xs={12} md={4}>
              <Select allowClear placeholder="الصندوق" style={{ width: '100%' }}
                value={filters.safe_id} onChange={(v) => setFilters({ ...filters, safe_id: v })}
                options={safes.map(s => ({ value: s.id, label: s.name }))} />
            </Col>
            <Col xs={12} md={4}>
              <Select allowClear placeholder="الخزينة" style={{ width: '100%' }}
                value={filters.store_id} onChange={(v) => setFilters({ ...filters, store_id: v })}
                options={stores.map(s => ({ value: s.id, label: s.name }))} />
            </Col>
            <Col xs={12} md={4}>
              <Select allowClear placeholder="طريقة الدفع" style={{ width: '100%' }}
                value={filters.payment_method} onChange={(v) => setFilters({ ...filters, payment_method: v })}
                options={[
                  { value: 'cash', label: 'نقدي' }, { value: 'bank', label: 'تحويل بنكي' },
                ]} />
            </Col>

            <Col xs={12} md={4}>
              <DatePicker style={{ width: '100%' }} placeholder="من تاريخ"
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(d) => setFilters({ ...filters, from: d ? d.format('YYYY-MM-DD') : undefined })} />
            </Col>
            <Col xs={12} md={4}>
              <DatePicker style={{ width: '100%' }} placeholder="إلى تاريخ"
                value={filters.to ? dayjs(filters.to) : null}
                onChange={(d) => setFilters({ ...filters, to: d ? d.format('YYYY-MM-DD') : undefined })} />
            </Col>
            {hasFilters && (
              <Col xs={24}>
                <Button icon={<ClearOutlined />} onClick={resetFilters} size="small" danger>مسح الفلاتر</Button>
              </Col>
            )}
          </Row>
        </div>

        <DataTable
          title="سندات القبض"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث بالرقم أو الوصف أو اسم الحساب"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)' }}>
              إضافة سند قبض
            </button>
          }
        />
      </Card>

      <ReceiptVoucherFormModal
        open={formOpen} onClose={() => setFormOpen(false)}
        voucher={editing}
        helpers={{ contacts, safes, banks, stores, currencies, karats, costCenters }}
        onSaved={onSaved}
      />

      <ReceiptVoucherViewModal
        open={viewOpen} onClose={() => setViewOpen(false)}
        voucher={viewing}
        helpers={{ contacts, safes, banks, stores, currencies, karats, costCenters }}
        onEdit={(v) => { setViewOpen(false); openEdit(v) }}
        onPrint={(v) => { setViewOpen(false); openPrint(v) }}
        onNavigate={async (navId) => {
          if (!navId) return
          try {
            const res = await receiptVouchersApi.show(navId, filters)
            if (res.data.success) setViewing(res.data.data)
          } catch { }
        }}
      />

      <ReceiptVoucherPrintModal
        open={printOpen} onClose={() => setPrintOpen(false)} payload={printing}
      />
    </div>
  )
}