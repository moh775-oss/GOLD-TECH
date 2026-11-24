import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Spin, Button, Space, Empty, Progress, Divider } from 'antd'
import {
  ArrowRightOutlined, ShopOutlined, TeamOutlined, FileTextOutlined,
  WalletOutlined, GoldOutlined, RiseOutlined, FallOutlined,
  BankOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined,
  AuditOutlined, AppstoreOutlined, LineChartOutlined, TrophyOutlined,
  CalendarOutlined, CheckCircleFilled, CloseCircleFilled, ClockCircleOutlined,
  SafetyCertificateOutlined, BarChartOutlined, PieChartOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { LineChart } from '@mui/x-charts/LineChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import api from '../../lib/api'
import notify from '../../lib/notify.jsx'
import './CompanyReportPage.css'

const fmtMoney = (v) => v != null ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'
const fmtInt   = (v) => v != null ? Number(v).toLocaleString('en-US') : '—'

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
const fmtMonth = (ym) => {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  return `${MONTHS_AR[parseInt(m) - 1] || m} ${y}`
}

const GOLD = {
  primary: '#b8860b',
  light: '#d4a017',
  dark: '#8b6508',
  gradient: 'linear-gradient(135deg, #b8860b 0%, #d4a017 50%, #f0c040 100%)',
}

export default function CompanyReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/companies/${id}/report`)
        if (res.data.success) setData(res.data.data)
        else notify.error(res.data.message)
      } catch (e) {
        notify.error(e.response?.data?.message || 'فشل الجلب')
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="crp-loading">
      <Spin size="large" />
      <div className="crp-loading-text">جاري تحميل التقرير الشامل...</div>
    </div>
  )
  if (!data) return <Empty description="لا توجد بيانات" style={{ marginTop: 80 }} />

  const { company, summary, documents, amounts, balances, branches, users, charts = {} } = data

  // ======== تجهيز بيانات الشارت ========
  const salesMonthly = (charts.sales_monthly || []).map(x => ({
    name: fmtMonth(x.ym),
    sales: Number(x.total || 0),
    count: Number(x.cnt || 0),
  }))
  const purchaseMonthly = (charts.purchase_monthly || []).map(x => ({
    name: fmtMonth(x.ym),
    purchases: Number(x.total || 0),
    count: Number(x.cnt || 0),
  }))

  const monthMap = {}
  salesMonthly.forEach(x => { monthMap[x.name] = { ...monthMap[x.name], name: x.name, sales: x.sales || 0 } })
  purchaseMonthly.forEach(x => { monthMap[x.name] = { ...monthMap[x.name], name: x.name, purchases: x.purchases || 0 } })
  const monthlyMerged = Object.values(monthMap).map(m => ({
    name: m.name, sales: m.sales || 0, purchases: m.purchases || 0
  }))

  const branchesChart = (charts.branches_chart || []).map(b => ({
    name: b.name,
    sales: Number(b.sales || 0),
    purchases: Number(b.purchases || 0),
  }))

  // Pie chart: مستخدمون نشطون vs معطّلون
  const pieUsers = [
    { id: 0, value: summary.active_users || 0, label: 'نشط' },
    { id: 1, value: (summary.users - (summary.active_users || 0)) || 0, label: 'معطّل' },
  ]

  // Pie chart: عملاء vs موردون
  const pieContacts = [
    { id: 0, value: summary.customers || 0, label: 'عملاء' },
    { id: 1, value: summary.suppliers || 0, label: 'موردون' },
  ]

  // ======== أعمدة الفروع ========
  const branchColumns = [
    {
      title: 'الفرع', dataIndex: 'name', key: 'name', width: 200,
      render: (v, r) => (
        <Space>
          {r.is_main ? <Tag color="gold" style={{ fontWeight: 700 }}>الرئيسي</Tag> : null}
          <span style={{ fontWeight: 600 }}>{r.info_name || v}</span>
        </Space>
      )
    },
    { title: 'الكود', dataIndex: 'code', key: 'code', align: 'center', width: 90 },
    { title: 'الجوال', dataIndex: 'info_mobile', key: 'mobile', align: 'center', render: (v, r) => v || r.phone || '—' },
    { title: 'المدينة', dataIndex: 'info_city', key: 'city', align: 'center', render: (v, r) => v || r.city || '—' },
    { title: 'المستخدمون', dataIndex: 'users_count', key: 'users_count', align: 'center', width: 100 },
    { title: 'المخازن', dataIndex: 'stores_count', key: 'stores_count', align: 'center', width: 90 },
    { title: 'الصناديق', dataIndex: 'safes_count', key: 'safes_count', align: 'center', width: 90 },
    { title: 'البنوك', dataIndex: 'banks_count', key: 'banks_count', align: 'center', width: 80 },
    {
      title: 'المبيعات', dataIndex: 'sales_count', key: 'sales_count', align: 'center', width: 100,
      render: (v) => <span style={{ color: '#389e0d', fontWeight: 700 }}>{fmtInt(v)}</span>
    },
    {
      title: 'المشتريات', dataIndex: 'purchases_count', key: 'purchases_count', align: 'center', width: 100,
      render: (v) => <span style={{ color: '#cf1322', fontWeight: 700 }}>{fmtInt(v)}</span>
    },
    { title: 'سندات قبض', dataIndex: 'receipts_count', key: 'receipts_count', align: 'center', width: 100 },
    { title: 'سندات صرف', dataIndex: 'payments_count', key: 'payments_count', align: 'center', width: 100 },
    {
      title: 'الحالة', dataIndex: 'is_active', key: 'is_active', align: 'center', width: 100,
      render: (v) => v ? <Tag color="green">مفعّل</Tag> : <Tag color="red">معطّل</Tag>
    },
  ]

  // ======== أعمدة المستخدمين ========
  const userColumns = [
    {
      title: 'الاسم', dataIndex: 'name', key: 'name',
      render: (v) => <Space><UserOutlined style={{ color: GOLD.primary }} /><span style={{ fontWeight: 600 }}>{v}</span></Space>
    },
    { title: 'الجوال', dataIndex: 'mobile', key: 'mobile', align: 'center' },
    { title: 'البريد', dataIndex: 'email', key: 'email', align: 'center', render: (v) => v || '—' },
    {
      title: 'الدور', dataIndex: 'role', key: 'role', align: 'center',
      render: (v) => <Tag className="crp-role-tag">{v}</Tag>
    },
    { title: 'الفرع', dataIndex: 'branch_name', key: 'branch_name', align: 'center', render: (v) => v || '—' },
    { title: 'آخر دخول', dataIndex: 'last_login_at', key: 'last_login_at', align: 'center', render: (v) => v ? String(v).slice(0, 16) : '—' },
    {
      title: 'الحالة', dataIndex: 'is_active', key: 'is_active', align: 'center',
      render: (v) => v
        ? <Tag color="green" icon={<CheckCircleFilled />}>مفعّل</Tag>
        : <Tag color="red" icon={<CloseCircleFilled />}>معطّل</Tag>
    },
  ]

  const usersUsagePct = company.max_users ? Math.min(100, Math.round((summary.users / company.max_users) * 100)) : 0
  const branchesUsagePct = company.max_branches ? Math.min(100, Math.round((summary.branches / company.max_branches) * 100)) : 0

  return (
    <div className="crp-wrap" dir="rtl">

      {/* ======== الشريط العلوي ======== */}
      <div className="crp-topbar">
        <Button
          icon={<ArrowRightOutlined />}
          onClick={() => navigate('/company')}
          size="large"
          className="crp-back-btn"
        >
          رجوع للشركات
        </Button>
        <Tag className="crp-date-tag">
          <CalendarOutlined /> {new Date().toLocaleDateString('ar-SA')}
        </Tag>
      </div>

      {/* ======== بطاقة الهيدر الفخمة ======== */}
      <Card className="crp-hero" bordered={false}>
        <div className="crp-hero-body">
          <div className="crp-hero-content">
            <div className="crp-hero-crown">
              <TrophyOutlined />
            </div>
            <h1 className="crp-hero-title">{company.name}</h1>
            {company.name_en && <div className="crp-hero-sub">{company.name_en}</div>}
            <div className="crp-hero-meta">
              <div className="crp-hero-chip"><WalletOutlined /> {company.mobile}</div>
              {company.phone && <div className="crp-hero-chip"><BankOutlined /> {company.phone}</div>}
              {company.email && <div className="crp-hero-chip"><FileTextOutlined /> {company.email}</div>}
              {company.tax_number && <div className="crp-hero-chip"><SafetyCertificateOutlined /> {company.tax_number}</div>}
              {company.city && <div className="crp-hero-chip"><ShopOutlined /> {company.city}</div>}
            </div>
          </div>
          <div className="crp-hero-badges">
            <div className={`crp-status-badge ${company.is_active ? 'active' : 'inactive'}`}>
              {company.is_active ? <CheckCircleFilled /> : <CloseCircleFilled />}
              {company.is_active ? 'مفعّلة' : 'معطّلة'}
            </div>
            <div className="crp-plan-badge">
              <GoldOutlined /> {company.subscription_plan || 'تجريبي'}
            </div>
            {company.subscription_end && (
              <div className="crp-expiry-badge">
                <ClockCircleOutlined /> ينتهي: {String(company.subscription_end).slice(0, 10)}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ======== بطاقات الإحصائيات الرئيسية ======== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': '#197fdd' }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #197fdd, #52a8ff)' }}>
              <ShopOutlined />
            </div>
            <Statistic title="الفروع" value={summary.branches} className="crp-stat-custom" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': '#389e0d' }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #389e0d, #52c41a)' }}>
              <TeamOutlined />
            </div>
            <Statistic title="المستخدمون" value={summary.users} className="crp-stat-custom" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': GOLD.primary }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: GOLD.gradient }}>
              <UserOutlined />
            </div>
            <Statistic title="العملاء" value={summary.customers} className="crp-stat-custom" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': '#cf1322' }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #cf1322, #ff4d4f)' }}>
              <ShoppingCartOutlined />
            </div>
            <Statistic title="الموردون" value={summary.suppliers} className="crp-stat-custom" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': '#722ed1' }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #722ed1, #9254de)' }}>
              <AppstoreOutlined />
            </div>
            <Statistic title="الأصناف" value={summary.items} className="crp-stat-custom" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="crp-stat-card" style={{ '--accent': '#13c2c2' }} bordered={false}>
            <div className="crp-stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #13c2c2, #36cfc9)' }}>
              <BankOutlined />
            </div>
            <Statistic title="المخازن" value={summary.stores} className="crp-stat-custom" />
          </Card>
        </Col>
      </Row>

      {/* ======== استخدام الباقة ======== */}
      <Card className="crp-usage-card" bordered={false}>
        <Row gutter={[32, 24]}>
          <Col xs={24} md={12}>
            <div className="crp-usage-head">
              <span className="crp-usage-label"><TeamOutlined /> استخدام المستخدمين</span>
              <span className="crp-usage-count">{summary.users} / {company.max_users || '∞'}</span>
            </div>
            <Progress
              percent={usersUsagePct}
              strokeColor={{ '0%': GOLD.primary, '100%': GOLD.light }}
              strokeWidth={14}
              showInfo={false}
              trailColor="#f5f5f5"
            />
          </Col>
          <Col xs={24} md={12}>
            <div className="crp-usage-head">
              <span className="crp-usage-label"><ShopOutlined /> استخدام الفروع</span>
              <span className="crp-usage-count">{summary.branches} / {company.max_branches || '∞'}</span>
            </div>
            <Progress
              percent={branchesUsagePct}
              strokeColor={{ '0%': '#197fdd', '100%': '#52a8ff' }}
              strokeWidth={14}
              showInfo={false}
              trailColor="#f5f5f5"
            />
          </Col>
        </Row>
      </Card>

      {/* ======== المستندات ======== */}
      <Card
        className="crp-section-card"
        bordered={false}
        title={
          <div className="crp-section-title">
            <div className="crp-section-icon" style={{ background: GOLD.gradient }}>
              <FileTextOutlined />
            </div>
            <span>المستندات</span>
          </div>
        }
      >
        <Row gutter={[12, 12]}>
          {[
            { title: 'فواتير بيع', value: documents.sales_invoices, color: '#389e0d' },
            { title: 'فواتير شراء', value: documents.purchase_invoices, color: '#cf1322' },
            { title: 'مرتجعات بيع', value: documents.sales_returns, color: '#6b7280' },
            { title: 'مرتجعات شراء', value: documents.purchase_returns, color: '#6b7280' },
            { title: 'سندات قبض', value: documents.receipt_vouchers, color: '#389e0d' },
            { title: 'سندات صرف', value: documents.payment_vouchers, color: '#cf1322' },
            { title: 'القيود', value: documents.journal_entries, color: GOLD.primary },
            { title: 'تفاصيل القيود', value: documents.journal_details, color: '#6b7280' },
            { title: 'أجور بيع', value: documents.sales_wages, color: '#6b7280' },
            { title: 'أجور شراء', value: documents.purchase_wages, color: '#6b7280' },
          ].map((d, i) => (
            <Col xs={12} sm={8} md={6} lg={4} key={i}>
              <div className="crp-doc-tile">
                <div className="crp-doc-title">{d.title}</div>
                <div className="crp-doc-value" style={{ color: d.color }}>{fmtInt(d.value)}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* ======== المبالغ والأرصدة ======== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={12}>
          <Card
            className="crp-section-card"
            bordered={false}
            title={
              <div className="crp-section-title">
                <div className="crp-section-icon" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
                  <DollarOutlined />
                </div>
                <span>المبالغ المالية</span>
              </div>
            }
          >
            <div className="crp-amount-row">
              <span className="crp-amount-label"><RiseOutlined style={{ color: '#389e0d' }} /> إجمالي المبيعات</span>
              <span className="crp-amount-value" style={{ color: '#389e0d' }}>{fmtMoney(amounts.sales_total)} <small>ر.س</small></span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div className="crp-amount-row">
              <span className="crp-amount-label"><FallOutlined style={{ color: '#cf1322' }} /> إجمالي المشتريات</span>
              <span className="crp-amount-value" style={{ color: '#cf1322' }}>{fmtMoney(amounts.purchase_total)} <small>ر.س</small></span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div className="crp-amount-row">
              <span className="crp-amount-label"><RiseOutlined style={{ color: '#197fdd' }} /> إجمالي المقبوضات</span>
              <span className="crp-amount-value" style={{ color: '#197fdd' }}>{fmtMoney(amounts.receipts_total)} <small>ر.س</small></span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div className="crp-amount-row">
              <span className="crp-amount-label"><FallOutlined style={{ color: GOLD.primary }} /> إجمالي المدفوعات</span>
              <span className="crp-amount-value" style={{ color: GOLD.primary }}>{fmtMoney(amounts.payments_total)} <small>ر.س</small></span>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            className="crp-section-card"
            bordered={false}
            title={
              <div className="crp-section-title">
                <div className="crp-section-icon" style={{ background: GOLD.gradient }}>
                  <GoldOutlined />
                </div>
                <span>الأرصدة الحالية</span>
              </div>
            }
          >
            <div className="crp-amount-row">
              <span className="crp-amount-label"><WalletOutlined style={{ color: '#197fdd' }} /> نقدية الصناديق</span>
              <span className="crp-amount-value" style={{ color: '#197fdd' }}>{fmtMoney(balances.safes_cash)} <small>ر.س</small></span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div className="crp-amount-row">
              <span className="crp-amount-label"><BankOutlined style={{ color: '#722ed1' }} /> أرصدة البنوك</span>
              <span className="crp-amount-value" style={{ color: '#722ed1' }}>{fmtMoney(balances.banks_total)} <small>ر.س</small></span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div className="crp-amount-row">
              <span className="crp-amount-label"><GoldOutlined style={{ color: GOLD.primary }} /> وزن الذهب</span>
              <span className="crp-amount-value" style={{ color: GOLD.primary }}>{fmtInt(balances.gold_weight)} <small>جم</small></span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ======== الشارت الشهري (MUI X) ======== */}
      {monthlyMerged.length > 0 && (
        <Card
          className="crp-section-card"
          bordered={false}
          style={{ marginBottom: 20 }}
          title={
            <div className="crp-section-title">
              <div className="crp-section-icon" style={{ background: GOLD.gradient }}>
                <LineChartOutlined />
              </div>
              <span>الأداء المالي — آخر 6 أشهر</span>
            </div>
          }
        >
          <div className="crp-chart-container" dir="ltr">
            <LineChart
              height={340}
              series={[
                {
                  data: monthlyMerged.map(m => m.sales),
                  label: 'المبيعات',
                  color: '#389e0d',
                  area: true,
                  showMark: true,
                  curve: 'monotoneX',
                },
                {
                  data: monthlyMerged.map(m => m.purchases),
                  label: 'المشتريات',
                  color: '#cf1322',
                  area: true,
                  showMark: true,
                  curve: 'monotoneX',
                },
              ]}
              xAxis={[{
                scaleType: 'point',
                data: monthlyMerged.map(m => m.name),
                tickLabelStyle: { fontSize: 12, fill: '#6b7280' },
              }]}
              yAxis={[{
                tickLabelStyle: { fontSize: 12, fill: '#6b7280' },
                valueFormatter: (v) => fmtMoney(v),
              }]}
              margin={{ top: 20, bottom: 40, left: 80, right: 20 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'top', horizontal: 'middle' },
                  itemMarkWidth: 14,
                  itemMarkHeight: 14,
                  labelStyle: { fontSize: 13, fontWeight: 600 },
                },
              }}
              sx={{
                '& .MuiChartsAxis-line': { stroke: '#e5e7eb' },
                '& .MuiChartsAxis-tick': { stroke: '#e5e7eb' },
                '& .MuiChartsGrid-line': { stroke: '#f3f4f6' },
              }}
            />
          </div>
        </Card>
      )}

      {/* ======== شارت الفروع (MUI X Bar) ======== */}
      {branchesChart.length > 0 && (
        <Card
          className="crp-section-card"
          bordered={false}
          style={{ marginBottom: 20 }}
          title={
            <div className="crp-section-title">
              <div className="crp-section-icon" style={{ background: 'linear-gradient(135deg, #197fdd, #52a8ff)' }}>
                <BarChartOutlined />
              </div>
              <span>مقارنة الفروع</span>
            </div>
          }
        >
          <div className="crp-chart-container" dir="ltr">
            <BarChart
              height={340}
              series={[
                { data: branchesChart.map(b => b.sales), label: 'مبيعات', color: '#389e0d' },
                { data: branchesChart.map(b => b.purchases), label: 'مشتريات', color: '#cf1322' },
              ]}
              xAxis={[{
                scaleType: 'band',
                data: branchesChart.map(b => b.name),
                tickLabelStyle: { fontSize: 12, fill: '#6b7280' },
              }]}
              yAxis={[{
                tickLabelStyle: { fontSize: 12, fill: '#6b7280' },
              }]}
              margin={{ top: 20, bottom: 60, left: 60, right: 20 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'top', horizontal: 'middle' },
                  itemMarkWidth: 14,
                  itemMarkHeight: 14,
                  labelStyle: { fontSize: 13, fontWeight: 600 },
                },
              }}
              sx={{
                '& .MuiChartsAxis-line': { stroke: '#e5e7eb' },
                '& .MuiChartsAxis-tick': { stroke: '#e5e7eb' },
                '& .MuiChartsGrid-line': { stroke: '#f3f4f6' },
              }}
            />
          </div>
        </Card>
      )}

      {/* ======== شارتات دائرية (Pie) ======== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} md={12}>
          <Card
            className="crp-section-card"
            bordered={false}
            title={
              <div className="crp-section-title">
                <div className="crp-section-icon" style={{ background: 'linear-gradient(135deg, #389e0d, #52c41a)' }}>
                  <PieChartOutlined />
                </div>
                <span>حالة المستخدمين</span>
              </div>
            }
          >
            <div className="crp-chart-container" dir="ltr" style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart
                series={[{
                  data: pieUsers,
                  innerRadius: 50,
                  outerRadius: 90,
                  paddingAngle: 3,
                  cornerRadius: 6,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 40, additionalRadius: -10, color: 'gray' },
                }]}
                height={240}
                colors={['#389e0d', '#cf1322']}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    labelStyle: { fontSize: 13, fontWeight: 600 },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            className="crp-section-card"
            bordered={false}
            title={
              <div className="crp-section-title">
                <div className="crp-section-icon" style={{ background: GOLD.gradient }}>
                  <TeamOutlined />
                </div>
                <span>العملاء والموردون</span>
              </div>
            }
          >
            <div className="crp-chart-container" dir="ltr" style={{ display: 'flex', justifyContent: 'center' }}>
              <PieChart
                series={[{
                  data: pieContacts,
                  innerRadius: 50,
                  outerRadius: 90,
                  paddingAngle: 3,
                  cornerRadius: 6,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 40, additionalRadius: -10, color: 'gray' },
                }]}
                height={240}
                colors={[GOLD.primary, '#cf1322']}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    labelStyle: { fontSize: 13, fontWeight: 600 },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* ======== جدول الفروع ======== */}
      <Card
        className="crp-section-card"
        bordered={false}
        style={{ marginBottom: 20 }}
        title={
          <div className="crp-section-title">
            <div className="crp-section-icon" style={{ background: 'linear-gradient(135deg, #197fdd, #52a8ff)' }}>
              <ShopOutlined />
            </div>
            <span>الفروع ({branches.length})</span>
          </div>
        }
      >
        <Table
          className="crp-table"
          dataSource={branches}
          columns={branchColumns}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* ======== جدول المستخدمين ======== */}
      <Card
        className="crp-section-card"
        bordered={false}
        title={
          <div className="crp-section-title">
            <div className="crp-section-icon" style={{ background: 'linear-gradient(135deg, #389e0d, #52c41a)' }}>
              <TeamOutlined />
            </div>
            <span>المستخدمون ({users.length})</span>
          </div>
        }
      >
        <Table
          className="crp-table"
          dataSource={users}
          columns={userColumns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}