import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, Select, Col, Row, Button, DatePicker, Switch, Tag, Space } from 'antd'
import { ClearOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons'
import { RiyalIcon } from 'riyal/react'
import dayjs from 'dayjs'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { accountStatementApi } from './accountStatementApi.jsx'
import AccountStatementPrint from './AccountStatementPrint.jsx'

const fmtMoney = (v) =>
  v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')

const fmtDate = (v) => {
  if (!v) return '—'
  const d = dayjs(v)
  return d.isValid() ? d.format('YYYY-MM-DD') : '—'
}

const renderRiyal = (v, color = '#1d4ed8', bold = true) => (
  <span
    style={{
      color,
      fontWeight: bold ? 800 : 700,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      direction: 'ltr',
    }}
  >
    {fmtMoney(Math.abs(Number(v || 0)))}
    <RiyalIcon width={14} height={14} />
  </span>
)

const renderGold = (v, color = '#8f6200', bold = true) => (
  <span style={{ color, fontWeight: bold ? 800 : 700 }}>
    {`${fmtWeight(Math.abs(Number(v || 0)))} جم`}
  </span>
)

const balanceSideLabel = (val, isCreditNature) => {
  const num = Number(val || 0)
  if (Math.abs(num) < 0.0001) return 'متزن'
  if (isCreditNature) {
    return num > 0 ? 'له' : 'عليه'
  }
  return num > 0 ? 'عليه' : 'له'
}

// ✅ label بين قوسين (له)/(عليه)
const balanceSideLabelParens = (val, isCreditNature) => {
  const label = balanceSideLabel(val, isCreditNature)
  return label === 'متزن' ? label : `(${label})`
}

export default function AccountStatementPage() {
  const { session } = useAuth()
  const today = dayjs()

  const [accounts, setAccounts] = useState([])
  const [branches, setBranches] = useState([])
  const [docTypes, setDocTypes] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const [rows, setRows] = useState([])
  const [accountInfo, setAccountInfo] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [printOpen, setPrintOpen] = useState(false)

  const [filters, setFilters] = useState({
    account_id: undefined,
    branch_id: session?.branch_id || undefined,
    transaction_type: 'all',
    document_type_id: undefined,
    from: today.startOf('month').format('YYYY-MM-DD'),
    to: today.format('YYYY-MM-DD'),
    with_opening: true,
    q: undefined,
  })

  useEffect(() => {
    ;(async () => {
      setLoadingOptions(true)
      try {
        const res = await accountStatementApi.options()
        if (res.data?.success) {
          const d = res.data.data || {}
          setAccounts(d.accounts || [])
          setBranches(d.branches || [])
          setDocTypes(d.document_types || [])
        }
      } catch (e) {
        console.error('statement options:', e)
      } finally {
        setLoadingOptions(false)
      }
    })()
  }, [])

  const fetchStatement = useCallback(async () => {
    if (!filters.account_id) {
      setRows([])
      setAccountInfo(null)
      setSummary(null)
      return
    }

    setLoading(true)
    try {
      const params = {
        account_id: filters.account_id,
        branch_id: filters.branch_id,
        transaction_type: filters.transaction_type || 'all',
        document_type_id: filters.document_type_id,
        from: filters.from ? dayjs(filters.from).format('YYYY-MM-DD') : undefined,
        to: filters.to ? dayjs(filters.to).format('YYYY-MM-DD') : undefined,
        with_opening: filters.with_opening ? 1 : 0,
        q: filters.q,
      }
      Object.keys(params).forEach((k) => {
        if (params[k] === undefined || params[k] === null || params[k] === '') {
          delete params[k]
        }
      })

      const res = await accountStatementApi.statement(params)
      if (res.data?.success) {
        setRows(res.data.data || [])
        setAccountInfo(res.data.account || null)
        setSummary(res.data.summary || null)
      } else {
        notify.error(res.data?.message || 'فشل جلب كشف الحساب')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل جلب كشف الحساب')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchStatement()
  }, [fetchStatement])

  const resetFilters = () => {
    setFilters((prev) => ({
      account_id: prev.account_id,
      branch_id: session?.branch_id || undefined,
      transaction_type: 'all',
      document_type_id: undefined,
      from: today.startOf('month').format('YYYY-MM-DD'),
      to: today.format('YYYY-MM-DD'),
      with_opening: true,
      q: undefined,
    }))
  }

  const showCash = filters.transaction_type === 'all' || filters.transaction_type === 'cash'
  const showGold = filters.transaction_type === 'all' || filters.transaction_type === 'gold'
  const isCreditNature = String(accountInfo?.account_nature || 'debit').toLowerCase() === 'credit'

  const columns = useMemo(() => {
    const cols = [
      {
        key: 'journal_date',
        label: 'التاريخ',
        width: 108,
        align: 'center',
        render: (v) => <span style={{ fontWeight: 700 }}>{fmtDate(v)}</span>,
      },
      {
        key: 'doc_type_name',
        label: 'نوع المستند',
        width: 135,
        align: 'center',
        render: (v, row) => (
          <Tag color="gold" style={{ fontWeight: 700 }}>
            {v || row.doc_type_code || 'قيد'}
          </Tag>
        ),
      },
      {
        key: 'doc_no',
        label: 'رقم المستند',
        width: 105,
        align: 'center',
        render: (v) => <code style={{ color: '#8f6200', fontWeight: 800, fontSize: 12 }}>{v || '—'}</code>,
      },
      {
        key: 'branch_name',
        label: 'الفرع',
        width: 115,
        align: 'center',
        render: (v) => <span style={{ fontWeight: 600 }}>{v || '—'}</span>,
      },
    ]

    if (showCash) {
      cols.push(
        {
          key: 'debit_amount',
          label: 'مدين (ريال)',
          width: 125,
          align: 'center',
          render: (v) =>
            Number(v || 0) > 0 ? renderRiyal(v, '#15803d', true) : <span style={{ color: '#ccc' }}>—</span>,
        },
        {
          key: 'credit_amount',
          label: 'دائن (ريال)',
          width: 125,
          align: 'center',
          render: (v) =>
            Number(v || 0) > 0 ? renderRiyal(v, '#b91c1c', true) : <span style={{ color: '#ccc' }}>—</span>,
        },
        {
          key: 'running_cash_balance',
          label: 'الرصيد النقدي',
          width: 165,
          align: 'center',
          render: (v) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {renderRiyal(v, '#1d4ed8', true)}
              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#4b5563' }}>
                {balanceSideLabelParens(v, isCreditNature)}
              </span>
            </div>
          ),
        }
      )
    }

    if (showGold) {
      cols.push(
        {
          key: 'karat_name',
          label: 'العيار',
          width: 90,
          align: 'center',
          render: (v) =>
            v ? <span style={{ fontWeight: 800, color: '#8f6200' }}>{v}</span> : <span style={{ color: '#ccc' }}>—</span>,
        },
        {
          key: 'gold_debit',
          label: 'مدين ذهب (جم)',
          width: 125,
          align: 'center',
          render: (v) =>
            Number(v || 0) > 0 ? renderGold(v, '#8f6200', true) : <span style={{ color: '#ccc' }}>—</span>,
        },
        {
          key: 'gold_credit',
          label: 'دائن ذهب (جم)',
          width: 125,
          align: 'center',
          render: (v) =>
            Number(v || 0) > 0 ? renderGold(v, '#b45309', true) : <span style={{ color: '#ccc' }}>—</span>,
        },
        {
          key: 'running_gold_balance',
          label: 'رصيد الذهب',
          width: 165,
          align: 'center',
          render: (v) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {renderGold(v, '#7a5d00', true)}
              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#7a5d00' }}>
                {balanceSideLabelParens(v, isCreditNature)}
              </span>
            </div>
          ),
        }
      )
    }

    cols.push({
      key: 'description',
      label: 'البيان / التفاصيل',
      width: 260,
      align: 'right',
      render: (v) =>
        v ? (
          <span
            title={v}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.45,
              fontWeight: 600,
              fontSize: 12.5,
            }}
          >
            {v}
          </span>
        ) : (
          <span style={{ color: '#ccc' }}>—</span>
        ),
    })

    return cols
  }, [showCash, showGold, isCreditNature])

  const opening = summary?.opening_balance || { cash: 0, gold: 0 }
  const period = summary?.period_totals || {
    debit_amount: 0,
    credit_amount: 0,
    gold_debit: 0,
    gold_credit: 0,
  }
  const closing = summary?.closing_balance || { cash: 0, gold: 0 }

  const summaryCards = useMemo(() => {
    if (!summary) return []
    const cards = []

    if (showCash) {
      cards.push(
        {
          key: 'open_cash',
          title: filters.with_opening
            ? `رصيد نقدي قبل الفترة (${balanceSideLabel(opening.cash, isCreditNature)})`
            : 'رصيد نقدي افتتاحي (بدون سابق)',
          bg: 'rgba(29, 78, 216, 0.06)',
          border: 'rgba(29, 78, 216, 0.35)',
          color: '#1e3a8a',
          content: renderRiyal(opening.cash, '#1d4ed8', true),
        },
        {
          key: 'period_cash',
          title: 'حركة الفترة النقدية (مدين / دائن)',
          bg: 'rgba(29, 78, 216, 0.04)',
          border: 'rgba(29, 78, 216, 0.25)',
          color: '#374151',
          content: (
            <div style={{ fontSize: 13, fontWeight: 800, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span>مدين: {renderRiyal(period.debit_amount, '#15803d', true)}</span>
              <span>دائن: {renderRiyal(period.credit_amount, '#b91c1c', true)}</span>
            </div>
          ),
        },
        {
          key: 'close_cash',
          title: `الرصيد النقدي الختامي (${balanceSideLabel(closing.cash, isCreditNature)})`,
          bg: 'rgba(29, 78, 216, 0.10)',
          border: 'rgba(29, 78, 216, 0.5)',
          color: '#1e3a8a',
          content: renderRiyal(closing.cash, '#1d4ed8', true),
        }
      )
    }

    if (showGold) {
      cards.push(
        {
          key: 'open_gold',
          title: filters.with_opening
            ? `رصيد ذهب قبل الفترة (${balanceSideLabel(opening.gold, isCreditNature)})`
            : 'رصيد ذهب افتتاحي (بدون سابق)',
          bg: 'rgba(184, 134, 11, 0.08)',
          border: 'rgba(184, 134, 11, 0.35)',
          color: '#7a5d00',
          content: renderGold(opening.gold, '#8f6200', true),
        },
        {
          key: 'period_gold',
          title: 'حركة الفترة الذهبية (مدين / دائن)',
          bg: 'rgba(184, 134, 11, 0.05)',
          border: 'rgba(184, 134, 11, 0.25)',
          color: '#374151',
          content: (
            <div style={{ fontSize: 13, fontWeight: 800, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span>مدين: {renderGold(period.gold_debit, '#8f6200', true)}</span>
              <span>دائن: {renderGold(period.gold_credit, '#b45309', true)}</span>
            </div>
          ),
        },
        {
          key: 'close_gold',
          title: `رصيد الذهب الختامي (${balanceSideLabel(closing.gold, isCreditNature)})`,
          bg: 'rgba(184, 134, 11, 0.14)',
          border: 'rgba(184, 134, 11, 0.5)',
          color: '#7a5d00',
          content: renderGold(closing.gold, '#7a5d00', true),
        }
      )
    }

    return cards
  }, [summary, showCash, showGold, filters.with_opening, opening, period, closing, isCreditNature])

  const printPayload = useMemo(() => {
    if (!accountInfo) return null
    return {
      account: accountInfo,
      filters,
      summary,
      rows,
      printed_at: dayjs().format('YYYY-MM-DD HH:mm'),
      printed_by: session?.name || '—',
    }
  }, [accountInfo, filters, summary, rows, session?.name])

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div className="page-header-banner">كشف حساب</div>

        {filtersOpen && (
          <div style={{ marginBottom: 16 }}>
            <Row gutter={[8, 8]} align="middle">
              <Col xs={24} md={6}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  loading={loadingOptions}
                  placeholder="اختر الحساب (مطلوب)"
                  value={filters.account_id}
                  onChange={(v) => setFilters({ ...filters, account_id: v })}
                  options={accounts.map((a) => ({
                    value: a.id,
                    label: a.acc_no ? `${a.acc_no} — ${a.name}` : a.name,
                  }))}
                />
              </Col>

              <Col xs={12} md={4}>
                <Select
                  allowClear
                  placeholder="الفرع"
                  value={filters.branch_id}
                  onChange={(v) => setFilters({ ...filters, branch_id: v })}
                  options={branches.map((b) => ({ value: b.id, label: b.name }))}
                />
              </Col>

              <Col xs={12} md={4}>
                <Select
                  placeholder="النوع"
                  value={filters.transaction_type}
                  onChange={(v) => setFilters({ ...filters, transaction_type: v || 'all' })}
                  options={[
                    { value: 'all', label: 'الكل (ذهب وريال)' },
                    { value: 'gold', label: 'ذهب فقط' },
                    { value: 'cash', label: 'ريال (نقدي) فقط' },
                  ]}
                />
              </Col>

              <Col xs={12} md={4}>
                <DatePicker
                  placeholder="من تاريخ"
                  value={filters.from ? dayjs(filters.from) : null}
                  onChange={(d) =>
                    setFilters({ ...filters, from: d ? d.format('YYYY-MM-DD') : undefined })
                  }
                />
              </Col>

              <Col xs={12} md={4}>
                <DatePicker
                  placeholder="إلى تاريخ"
                  value={filters.to ? dayjs(filters.to) : null}
                  onChange={(d) =>
                    setFilters({ ...filters, to: d ? d.format('YYYY-MM-DD') : undefined })
                  }
                />
              </Col>
            </Row>
          </div>
        )}

        <DataTable
          title="تفاصيل كشف الحساب"
          columns={columns}
          data={rows}
          loading={loading}
          searchable
          searchPlaceholder="بحث برقم المستند أو البيان"
          showReload
          onReload={fetchStatement}
          hideExportButton={true}
          extraActions={
            <Button
              icon={<PrinterOutlined />}
              disabled={!printPayload}
              onClick={() => setPrintOpen(true)}
            >
              طباعة الكشف
            </Button>
          }
        />
        {summaryCards.length > 0 && (
          <Row gutter={[10, 10]} align="stretch" style={{ marginBottom: 18, marginTop: 10 }}>
            {summaryCards.map((card) => (
              <Col xs={24} sm={12} md={4} key={card.key} style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: card.color }}>{card.title}</span>
                  <div style={{ fontSize: 16, fontWeight: 900 }}>{card.content}</div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <AccountStatementPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        payload={printPayload}
      />
    </div>
  )
}