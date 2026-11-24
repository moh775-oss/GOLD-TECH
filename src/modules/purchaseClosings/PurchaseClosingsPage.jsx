import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, Col, Row, Button, DatePicker } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import dayjs from 'dayjs'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { purchaseClosingsApi } from './purchaseClosingsApi.jsx'
import PurchaseClosingPrint from './purchaseClosingsPrint.jsx'
import { buildPurchaseClosingColumns } from './purchaseClosingsConfig.jsx'

const fmtMoney = (v) =>
  v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')

export default function PurchaseClosingsPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [totals, setTotals] = useState(null)
  const [loading, setLoading] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [printing, setPrinting] = useState(null)
  const [contacts, setContacts] = useState([])
  const [karats, setKarats] = useState([])
  const [users, setUsers] = useState([])
  const today = dayjs()

  const [filters, setFilters] = useState({
    branch_id: session?.branch_id,
    contact_id: undefined,
    karat_id: undefined,
    user_id: undefined,
    transaction_type: undefined,
    from: today.startOf('month').format('YYYY-MM-DD'),
    to: today.format('YYYY-MM-DD'),
    q: undefined,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await purchaseClosingsApi.options()
        if (res.data?.success) {
          const d = res.data.data || {}
          setContacts(d.contacts || [])
          setKarats(d.karats || [])
          setUsers(d.users || [])
        }
      } catch (e) {
        console.error('options:', e)
      }
    })()
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      if (params.from) params.from = dayjs(params.from).format('YYYY-MM-DD')
      if (params.to) params.to = dayjs(params.to).format('YYYY-MM-DD')
      Object.keys(params).forEach((k) => params[k] == null && delete params[k])
      const res = await purchaseClosingsApi.list(params)
      if (res.data?.success) {
        setData(res.data.data || [])
        setTotals(res.data.totals || null)
      } else {
        notify.error(res.data?.message || 'فشل الجلب')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => navigate('/purchase-closings/new')
  const openEdit = (row) => navigate(`/purchase-closings/${row.id}/edit`)
  const openView = (row) => navigate(`/purchase-closings/${row.id}/edit`)

  const openPrint = async (row) => {
    try {
      const res = await purchaseClosingsApi.print(row.id)
      if (res.data?.success) {
        setPrinting(res.data.data)
        setPrintOpen(true)
      }
    } catch {
      notify.error('فشل جلب بيانات الطباعة')
    }
  }

  const onDelete = async (row) => {
    try {
      const res = await purchaseClosingsApi.remove(row.id)
      if (res.data?.success) {
        notify.success(res.data.message || 'تم الحذف')
        fetchData()
      } else {
        notify.error(res.data?.message || 'فشل الحذف')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحذف')
    }
  }

  const resetFilters = () =>
    setFilters({
      branch_id: session?.branch_id,
      contact_id: undefined,
      karat_id: undefined,
      user_id: undefined,
      transaction_type: undefined,
      from: today.startOf('month').format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
      q: undefined,
    })

  const columns = useMemo(
    () =>
      buildPurchaseClosingColumns({
        onEdit: openEdit,
        onDelete,
        onView: openView,
        onPrint: openPrint,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  )

  const hasFilters =
    filters.contact_id ||
    filters.karat_id ||
    filters.user_id ||
    filters.transaction_type ||
    filters.from !== today.startOf('month').format('YYYY-MM-DD') ||
    filters.to !== today.format('YYYY-MM-DD') ||
    filters.q

  const summaryItems = [
    {
      label: 'إجمالي الوزن',
      value: `${fmtWeight(totals?.total_net_weight)} جم`,
      color: '#b8860b',
      bg: '#fffdf6',
      border: '#e6c35c',
    },
    {
      label: 'إجمالي قيمة الذهب',
      value: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {fmtMoney(totals?.total_net_amount)}
          <RiyalIcon width={15} height={15} />
        </span>
      ),
      color: '#8f6200',
      bg: '#fef9e7',
      border: '#e6c35c',
    },
    // {
    //   label: 'إجمالي الأجور الإضافية',
    //   value: (
    //     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
    //       {fmtMoney(totals?.total_jewelry_amount)}
    //       <RiyalIcon width={15} height={15} />
    //     </span>
    //   ),
    //   color: '#7a5d00',
    //   bg: '#fdf2d0',
    //   border: '#d4a017',
    // },
    // {
    //   label: 'الإجمالي الكلي',
    //   value: (
    //     <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
    //       {fmtMoney(totals?.grand_total_amount)}
    //       <RiyalIcon width={15} height={15} />
    //     </span>
    //   ),
    //   color: '#389e0d',
    //   bg: '#f6ffed',
    //   border: '#95de64',
    // },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="page-header-banner" >
         إدارة تسكير مشتريات
        </div>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[8, 8]}>
            <Col xs={12} md={6}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="المورد"
                style={{ width: '100%' }}
                value={filters.contact_id}
                onChange={(v) => setFilters({ ...filters, contact_id: v })}
                options={contacts.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Col>
            <Col xs={12} md={6}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="المستخدم"
                style={{ width: '100%' }}
                value={filters.user_id}
                onChange={(v) => setFilters({ ...filters, user_id: v })}
                options={users.map((u) => ({ value: u.id, label: u.name }))}
              />
            </Col>
            {/* <Col xs={12} md={4}>
              <Select
                allowClear
                placeholder="النوع"
                style={{ width: '100%' }}
                value={filters.transaction_type}
                onChange={(v) => setFilters({ ...filters, transaction_type: v })}
                options={[
                  { value: 'both', label: 'ذهب وريال' },
                  { value: 'gold', label: 'ذهب' },
                  { value: 'cash', label: 'ريال (نقدي)' },
                ]}
              />
            </Col> */}
            <Col xs={12} md={4}>
              <Select
                allowClear
                placeholder="العيار"
                style={{ width: '100%' }}
                value={filters.karat_id}
                onChange={(v) => setFilters({ ...filters, karat_id: v })}
                options={karats.map((k) => ({ value: k.id, label: k.name }))}
              />
            </Col>
            <Col xs={12} md={4}>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="من تاريخ"
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(d) => setFilters({ ...filters, from: d ? d.format('YYYY-MM-DD') : undefined })}
              />
            </Col>
            <Col xs={12} md={4}>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="إلى تاريخ"
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

        <Row gutter={[10, 10]} align="stretch" style={{ marginBottom: 18 }}>
          {summaryItems.map((item) => (
            <Col xs={12} md={12} key={item.label} style={{ display: 'flex' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                  borderRadius: 8,
                  padding: '5px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>{item.label}</span>
                <span style={{ fontSize: 17, fontWeight: 900, color: item.color }}>{item.value}</span>
              </div>
            </Col>
          ))}
        </Row>

        <DataTable
          title="تسكير المشتريات"
          columns={columns}
          data={data}
          loading={loading}
          searchable
          searchPlaceholder="بحث برقم المستند أو المورد أو البيان"
          showReload
          onReload={fetchData}
          extraActions={
            <button
              onClick={openCreate}
              style={{
                background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)',
              }}
            >
              إضافة تسكير مشتريات
            </button>
          }
        />
      </Card>

      <PurchaseClosingPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        payload={printing}
      />
    </div>
  )
}