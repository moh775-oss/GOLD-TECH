import { useState, useEffect, useCallback } from 'react'
import { Card, Select, Col, Row, Button, DatePicker } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { journalEntriesApi } from './journalEntriesApi.jsx'
import JournalEntryFormModal from './JournalEntryFormModal.jsx'
import JournalEntryViewModal from './JournalEntryViewModal.jsx'
import JournalEntryPrintModal from './JournalEntryPrintModal.jsx'
import { buildJournalEntryColumns } from './journalEntriesConfig.jsx'

export default function JournalEntriesPage() {
  const { session } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [printing, setPrinting] = useState(null)

  const [accounts, setAccounts] = useState([])
  const [costCenters, setCostCenters] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [karats, setKarats] = useState([])

  const today = dayjs()

  const [filters, setFilters] = useState({
    branch_id: session?.branch_id,
    account_id: undefined,
    transaction_type: undefined,   // ✅ بدل status
    from: today.format('YYYY-MM-DD'),
    to: today.format('YYYY-MM-DD'),
    q: undefined,
  })

  useEffect(() => {
    (async () => {
      try {
        const res = await journalEntriesApi.options()
        if (res.data.success) {
          const d = res.data.data
          setAccounts(d.accounts || [])
          setCostCenters(d.cost_centers || [])
          setCurrencies(d.currencies || [])
          setKarats(d.karats || [])
        }
      } catch (e) { console.error('options:', e) }
    })()
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      if (params.from) params.from = dayjs(params.from).format('YYYY-MM-DD')
      if (params.to)   params.to   = dayjs(params.to).format('YYYY-MM-DD')
      Object.keys(params).forEach(k => params[k] == null && delete params[k])

      const res = await journalEntriesApi.list(params)
      if (res.data.success) setData(res.data.data || [])
      else notify.error(res.data.message || 'فشل الجلب')
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit   = (row) => { setEditing(row); setFormOpen(true) }
  const openView   = async (row) => {
    try {
      const res = await journalEntriesApi.show(row.id, filters)
      if (res.data.success) { setViewing(res.data.data); setViewOpen(true) }
    } catch { notify.error('فشل جلب القيد') }
  }
  const openPrint = async (row) => {
    try {
      const res = await journalEntriesApi.print(row.id)
      if (res.data.success) { setPrinting(res.data.data); setPrintOpen(true) }
    } catch { notify.error('فشل جلب بيانات الطباعة') }
  }
  const onDelete = async (row) => {
    try {
      const res = await journalEntriesApi.remove(row.id)
      if (res.data.success) { notify.success(res.data.message || 'تم الحذف'); fetchData() }
      else notify.error(res.data.message || 'فشل الحذف')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل الحذف') }
  }
  const onReverse = async (row) => {
    const reason = window.prompt('سبب العكس:') || ''
    if (!reason) return
    try {
      const res = await journalEntriesApi.reverse(row.id, reason)
      if (res.data.success) { notify.success(res.data.message || 'تم العكس'); fetchData() }
      else notify.error(res.data.message || 'فشل العكس')
    } catch (e) { notify.error(e.response?.data?.message || 'فشل العكس') }
  }
  const onSaved = () => { setFormOpen(false); fetchData() }

  const resetFilters = () => setFilters({
    branch_id: session?.branch_id,
    account_id: undefined,
    transaction_type: undefined,
    from: today.format('YYYY-MM-DD'),
    to: today.format('YYYY-MM-DD'),
    q: undefined,
  })

  const columns = buildJournalEntryColumns({
    onEdit: openEdit, onDelete, onView: openView, onPrint: openPrint, onReverse,
  })

  const hasFilters =
    filters.account_id || filters.transaction_type ||
    filters.from !== today.format('YYYY-MM-DD') ||
    filters.to !== today.format('YYYY-MM-DD') || filters.q

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="page-header-banner" >
         إدارة القيود اليومية
        </div>
        <div style={{ marginBottom: 20 }}>
          <Row gutter={[8, 8]}>
            <Col xs={12} md={6}>
              <Select
                allowClear showSearch optionFilterProp="label" placeholder="الحساب" style={{ width: '100%' }}
                value={filters.account_id}
                onChange={(v) => setFilters({ ...filters, account_id: v })}
                options={accounts.map(a => ({ value: a.id, label: `${a.acc_no} - ${a.name}` }))}
              />
            </Col>


            <Col xs={12} md={6}>
              <Select
                allowClear placeholder="النوع" style={{ width: '100%' }}
                value={filters.transaction_type}
                onChange={(v) => setFilters({ ...filters, transaction_type: v })}
                options={[
                  { value: 'cash', label: ' نقدي' },
                  { value: 'gold', label: ' ذهب' },
                ]}
              />
            </Col>

            <Col xs={12} md={6}>
              <DatePicker
                style={{ width: '100%' }} placeholder="من تاريخ"
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(d) => setFilters({ ...filters, from: d ? d.format('YYYY-MM-DD') : undefined })}
              />
            </Col>
            <Col xs={12} md={6}>
              <DatePicker
                style={{ width: '100%' }} placeholder="إلى تاريخ"
                value={filters.to ? dayjs(filters.to) : null}
                onChange={(d) => setFilters({ ...filters, to: d ? d.format('YYYY-MM-DD') : undefined })}
              />
            </Col>
            {hasFilters && (
              <Col xs={24}>
                <Button icon={<ClearOutlined />} onClick={resetFilters} size="small" danger>
                  مسح الفلاتر
                </Button>
              </Col>
            )}
          </Row>
        </div>

        <DataTable
          title="القيود اليومية"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث برقم المستند أو الوصف"
          showReload
          onReload={fetchData}
          extraActions={
            <button onClick={openCreate} style={{
              background: 'linear-gradient(135deg, #d4a017, #b8860b)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 16px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)',
            }}>إضافة قيد</button>
          }
        />
      </Card>

      <JournalEntryFormModal
        open={formOpen} onClose={() => setFormOpen(false)}
        entry={editing}
        helpers={{ accounts, costCenters, currencies, karats }}
        onSaved={onSaved}
      />

      <JournalEntryViewModal
        open={viewOpen} onClose={() => setViewOpen(false)}
        entry={viewing}
        helpers={{ accounts, costCenters, currencies, karats }}
        onEdit={(v) => { setViewOpen(false); openEdit(v) }}
        onPrint={(v) => { setViewOpen(false); openPrint(v) }}
        onNavigate={async (navId) => {
          if (!navId) return
          try {
            const res = await journalEntriesApi.show(navId, filters)
            if (res.data.success) setViewing(res.data.data)
          } catch {}
        }}
      />

      <JournalEntryPrintModal
        open={printOpen} onClose={() => setPrintOpen(false)} payload={printing}
      />
    </div>
  )
}