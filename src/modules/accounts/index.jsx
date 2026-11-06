
import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Input, Spin, Table, Tag, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const API_URL = 'https://cd-gold-tech-api.ethiodeploy.app/api/accounts-template'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadAccounts() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('تعذر جلب دليل الحسابات')

        const result = await response.json()

        if (!result.success) throw new Error('تعذر تحميل البيانات')

        setAccounts(result.data || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadAccounts()

    return () => controller.abort()
  }, [])

  const filteredAccounts = useMemo(() => {
    const value = search.trim().toLowerCase()

    if (!value) return accounts

    return accounts.filter((account) =>
      [
        account.acc_no,
        account.name,
        account.father_acc_no,
        account.account_type,
        account.account_nature,
      ].some((item) => String(item ?? '').toLowerCase().includes(value)),
    )
  }, [accounts, search])

  const columns = [
    {
      title: 'رقم الحساب',
      dataIndex: 'acc_no',
      key: 'acc_no',
      width: 120,
    },
    {
      title: 'اسم الحساب',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'الحساب الأب',
      dataIndex: 'father_acc_no',
      key: 'father_acc_no',
      width: 120,
    },
    {
      title: 'نوع الحساب',
      dataIndex: 'account_type',
      key: 'account_type',
      width: 130,
    },
    {
      title: 'المستوى',
      dataIndex: 'account_level',
      key: 'account_level',
      width: 90,
    },
    {
      title: 'طبيعة الحساب',
      dataIndex: 'account_nature',
      key: 'account_nature',
      width: 120,
    },
    {
      title: 'القائمة المالية',
      dataIndex: 'final_account',
      key: 'final_account',
      width: 180,
    },
    {
      title: 'الحالة',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (value) => (
        <Tag color={value ? 'success' : 'default'}>
          {value ? 'نشط' : 'غير نشط'}
        </Tag>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            دليل الحسابات
          </Typography.Title>
          <Typography.Text type="secondary">
            إجمالي الحسابات: {accounts.length}
          </Typography.Text>
        </div>

        <Input
          placeholder="ابحث برقم الحساب أو اسم الحساب..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 300, maxWidth: '100%' }}
        />
      </div>

      {error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Spin spinning={loading}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredAccounts}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1100 }}
            locale={{ emptyText: 'لا توجد حسابات' }}
          />
        </Spin>
      )}
    </Card>
  )
}
