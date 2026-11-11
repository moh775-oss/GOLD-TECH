import { useState, useEffect, useRef } from 'react'
import {
  Card, Tree, Form, Input, Select, Button, Row, Col, Space, Switch,
  Tag, Divider, Spin, Popconfirm, InputNumber, DatePicker, Empty, Tooltip,
} from 'antd'
import {
  SaveOutlined, DeleteOutlined, PlusOutlined, BankOutlined,
  SearchOutlined, ReloadOutlined, InfoCircleOutlined, ApartmentOutlined,
  NodeExpandOutlined, NodeCollapseOutlined,
} from '@ant-design/icons'
import api from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import notify from '../../lib/notify.jsx'
import dayjs from 'dayjs'
import '../../styles/ChartOfAccounts.css'

const { Option } = Select
const NATURE_LABEL = { debit: 'مدين', credit: 'دائن' }

export default function ChartOfAccounts() {
  const { session } = useAuth()
  const [form] = Form.useForm()

  const [allAccounts, setAllAccounts] = useState([])
  const [treeData, setTreeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [expandedKeys, setExpandedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [isNewMode, setIsNewMode] = useState(false)

  const addingRef = useRef(false)
  const branchId = session?.branch_id

  useEffect(() => { loadAccounts() }, [branchId])

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const treeRes = await api.get('/accounts/tree', { params: { branch_id: branchId } })
      if (treeRes.data.success) {
        setTreeData(treeRes.data.data || [])
        setExpandedKeys([])
      }
      const flatRes = await api.get('/accounts', { params: { branch_id: branchId } })
      if (flatRes.data.success) setAllAccounts(flatRes.data.data || [])
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل تحميل الحسابات')
    } finally {
      setLoading(false)
    }
  }

  const getAllKeys = (tree) => {
    const keys = []
    const walk = (nodes) => nodes.forEach((n) => {
      keys.push(n.acc_no)
      if (n.children?.length) walk(n.children)
    })
    walk(tree)
    return keys
  }

  const filterTree = (nodes, text) => {
    if (!text) return nodes
    const term = text.toLowerCase()
    return nodes.map((n) => {
      const children = n.children ? filterTree(n.children, text) : []
      const match = (n.name || '').toLowerCase().includes(term) || String(n.acc_no || '').includes(text)
      if (match || children.length) return { ...n, children }
      return null
    }).filter(Boolean)
  }

  const handleSearch = (e) => {
    const v = e.target.value
    setSearchText(v)
    if (!v) { loadAccounts(); return }
    const filtered = filterTree(treeData, v)
    setTreeData(filtered)
    setExpandedKeys(getAllKeys(filtered))
  }

  const expandAll = () => { setExpandedKeys(getAllKeys(treeData)); setAutoExpandParent(false) }
  const collapseAll = () => { setExpandedKeys([]); setAutoExpandParent(false) }

  const handleSelect = async (keys) => {
    if (addingRef.current) return
    if (!keys.length) return
    const accNo = keys[0]
    try {
      const res = await api.get(`/accounts/acc-no/${accNo}`, { params: { branch_id: branchId } })
      if (res.data.success) {
        const acc = res.data.data
        setSelectedAccount(acc)
        setIsNewMode(false)
        form.setFieldsValue({
          acc_no: acc.acc_no,
          name: acc.name,
          father_acc_no: acc.father_acc_no,
          account_nature: acc.account_nature === 'credit' ? 'credit' : 'debit',
          final_account: acc.final_account,
          account_level: acc.account_level,
          is_active: acc.is_active === 1 || acc.is_active === true,
          notes: acc.notes,
        })
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل تحميل الحساب')
    }
  }

  const handleAddChild = async (parentAccNo) => {
    try {
      const res = await api.get('/accounts/create', {
        params: { father_acc_no: parentAccNo, branch_id: branchId },
      })
      if (!res.data.success) { notify.error(res.data.message); return }
      const info = res.data.data
      if (info.level > 4) {
        notify.error('لا يمكن إضافة حساب في المستوى الخامس أو أعمق')
        return
      }

      addingRef.current = true

      setIsNewMode(true)
      setSelectedAccount(null)
      form.resetFields()
      form.setFieldsValue({
        acc_no: info.acc_no,
        father_acc_no: parentAccNo,
        account_nature: info.account_nature === 'credit' ? 'credit' : 'debit',
        final_account: info.final_account === 'الأرباح والخسائر' ? 'الأرباح والخسائر' : 'الميزانية العمومية',
        account_level: info.level,
        is_active: true,
      })
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل توليد رقم الحساب')
    }
  }

  const handleAddRoot = async (parentAccNo) => {
    try {
      let newLevel = 1
      let nature = 'debit'
      let finalAcc = 'الميزانية العمومية'

      if (parentAccNo && parentAccNo !== '0') {
        const parent = allAccounts.find((a) => a.acc_no === parentAccNo)
        if (!parent) {
          notify.error('الحساب الأب غير موجود')
          return
        }
        newLevel = (Number(parent.account_level) || 1) + 1
        nature = parent.account_nature === 'credit' ? 'credit' : 'debit'
        finalAcc = parent.final_account === 'الأرباح والخسائر' ? 'الأرباح والخسائر' : 'الميزانية العمومية'
      } else {
        const maxRootLevel = allAccounts
          .filter((a) => !a.father_acc_no || a.father_acc_no === '0')
          .reduce((m, a) => Math.max(m, Number(a.account_level) || 1), 0)
        newLevel = maxRootLevel + 1
      }

      if (newLevel > 3) {
        notify.error('لا يمكن إضافة حساب رئيسي في المستوى الرابع أو أعمق')
        return
      }

      const res = await api.get('/accounts/create', {
        params: { father_acc_no: parentAccNo || '0', branch_id: branchId },
      })

      let accNo = ''
      if (res.data.success) {
        accNo = res.data.data.acc_no
      }

      addingRef.current = true

      setIsNewMode(true)
      setSelectedAccount(null)
      form.resetFields()
      form.setFieldsValue({
        acc_no: accNo,
        father_acc_no: parentAccNo || '0',
        account_nature: nature,
        final_account: finalAcc,
        account_level: newLevel,
        is_active: true,
      })
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل توليد رقم الحساب')
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      const payload = {
        branch_id: branchId,
        acc_no: values.acc_no,
        name: values.name,
        father_acc_no: values.father_acc_no || '0',
        account_nature: values.account_nature === 'credit' ? 'credit' : 'debit',
        final_account: values.final_account || 'الميزانية العمومية',
        is_active: values.is_active ? 1 : 0,
        notes: values.notes || null,
      }
      const res = isNewMode
        ? await api.post('/accounts', payload)
        : await api.put(`/accounts/${selectedAccount.id}`, payload)

      if (res.data.success) {
        notify.success(res.data.message)

        addingRef.current = false

        setSelectedAccount(null)
        setIsNewMode(false)
        form.resetFields()

        await loadAccounts()

        setSelectedAccount(null)
        setIsNewMode(false)
        form.resetFields()
      } else {
        notify.error(res.data.message)
      }
    } catch (e) {
      if (e.response?.data?.message) notify.error(e.response.data.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAccount) return
    setSaving(true)
    try {
      const res = await api.delete(`/accounts/${selectedAccount.id}`)
      if (res.data.success) {
        notify.success(res.data.message)
        addingRef.current = false
        setSelectedAccount(null)
        setIsNewMode(false)
        form.resetFields()
        await loadAccounts()
      } else {
        notify.error(res.data.message)
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحذف')
    } finally {
      setSaving(false)
    }
  }

  const renderTreeTitle = (node) => {
    const level = Number(node.account_level) || 1
    const canAddRoot = level >= 1 && level <= 2
    const canAddChild = level === 3

    return (
      <div className={`acc-node ${node.account_type === 'رئيسي' ? 'acc-node-parent' : 'acc-node-leaf'}`}>
        <span className="acc-code">{node.acc_no}</span>
        <span className="acc-name">{node.name}</span>
        <Tag color={node.account_nature === 'debit' ? 'red' : 'green'} style={{ fontSize: 10, margin: 0 }}>
          {NATURE_LABEL[node.account_nature] || node.account_nature}
        </Tag>

        {(canAddChild || canAddRoot) && (
          <Popconfirm
            title="إضافة حساب"
            description={
              <div className="acc-add-buttons">
                {canAddChild && (
                  <Button
                    size="small"
                    type="primary"
                    className="acc-add-choice"
                    onClick={(e) => { e.stopPropagation(); handleAddChild(node.acc_no) }}
                  >
                    حساب فرعي
                  </Button>
                )}
                {canAddRoot && (
                  <Button
                    size="small"
                    className="acc-add-choice"
                    onClick={(e) => { e.stopPropagation(); handleAddRoot(node.acc_no) }}
                  >
                    حساب رئيسي
                  </Button>
                )}
              </div>
            }
            okButtonProps={{ style: { display: 'none' } }}
            cancelText="إلغاء"
            icon={null}
          >
            <Button
              type="text"
              size="small"
              className="acc-add-btn"
              icon={<PlusOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        )}
      </div>
    )
  }

  return (
    <div className="coa-page">
      <Card className="coa-toolbar" size="small">
        <Row gutter={12}>
          <Col xs={24} lg={10}>
            <Card
              className="coa-tree-card"
              size="small"
              title={<Space><ApartmentOutlined /> شجرة الحسابات</Space>}
              extra={
                <Space size={4}>
                  <Tooltip title="توسيع الكل"><Button size="small" icon={<NodeExpandOutlined />} onClick={expandAll} /></Tooltip>
                  <Tooltip title="طي الكل"><Button size="small" icon={<NodeCollapseOutlined />} onClick={collapseAll} /></Tooltip>
                  <Tooltip title="تحديث"><Button size="small" icon={<ReloadOutlined />} onClick={loadAccounts} /></Tooltip>
                </Space>
              }
            >
              <div className="coa-search">
                <Input
                  size="small"
                  placeholder="بحث برقم أو اسم الحساب"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={handleSearch}
                  allowClear
                />
              </div>
              {loading ? (
                <div className="coa-loading"><Spin /></div>
              ) : treeData.length === 0 ? (
                <Empty description="لا توجد حسابات" />
              ) : (
                <div className="coa-tree-wrapper">
                  <Tree
                    showLine={{ showLeafIcon: false }}
                    blockNode
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onExpand={(keys) => { setExpandedKeys(keys); setAutoExpandParent(false) }}
                    onSelect={handleSelect}
                    selectedKeys={selectedAccount ? [selectedAccount.acc_no] : []}
                    treeData={treeData}
                    fieldNames={{ title: 'name', key: 'acc_no', children: 'children' }}
                    titleRender={renderTreeTitle}
                    className="coa-tree"
                  />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card
              className="coa-form-card"
              size="small"
              title={
                <Space>
                  <BankOutlined />
                  <span>{isNewMode ? 'حساب جديد' : selectedAccount ? 'تعديل حساب' : 'تفاصيل الحساب'}</span>
                  {selectedAccount && <Tag color="gold">{selectedAccount.acc_no}</Tag>}
                </Space>
              }
              extra={
                (selectedAccount || isNewMode) && (
                  <Space>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>حفظ</Button>
                    {selectedAccount && !isNewMode && (
                      <Popconfirm
                        title="تأكيد الحذف"
                        description="هل تريد حذف هذا الحساب؟"
                        okText="نعم، احذف"
                        cancelText="إلغاء"
                        okButtonProps={{ danger: true }}
                        onConfirm={handleDelete}
                      >
                        <Button danger icon={<DeleteOutlined />}>حذف</Button>
                      </Popconfirm>
                    )}
                  </Space>
                )
              }
            >
              {(selectedAccount || isNewMode) ? (
                <Form form={form} layout="vertical" size="small" dir="rtl">
                  <Row gutter={8}>
                    <Col xs={24} md={8}>
                      <Form.Item name="acc_no" label="رقم الحساب"><Input disabled placeholder="تلقائي" /></Form.Item>
                    </Col>
                    <Col xs={24} md={16}>
                      <Form.Item name="name" label="اسم الحساب" rules={[{ required: true, message: 'مطلوب' }]}>
                        <Input placeholder="أدخل اسم الحساب" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={24} md={8}>
                      <Form.Item name="father_acc_no" label="الحساب الأب">
                        <Select
                          placeholder="اختر الحساب الأب"
                          showSearch
                          optionFilterProp="label"
                          options={allAccounts.map((a) => ({ value: a.acc_no, label: `${a.acc_no} - ${a.name}` }))}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="account_nature" label="طبيعة الحساب">
                        <Select placeholder="اختر الطبيعة">
                          <Option value="debit">مدين</Option>
                          <Option value="credit">دائن</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="final_account" label="الحساب الختامي">
                        <Select placeholder="اختر الحساب الختامي" allowClear>
                          <Option value="الميزانية العمومية">الميزانية العمومية</Option>
                          <Option value="الأرباح والخسائر">الأرباح والخسائر</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={8}>
                    <Col xs={12} md={8}>
                      <Form.Item name="account_level" label="المستوى"><InputNumber className="w-full" disabled /></Form.Item>
                    </Col>
                    <Col xs={12} md={8}>
                      <Form.Item name="is_active" label="الحالة" valuePropName="checked">
                        <Switch checkedChildren="نشط" unCheckedChildren="موقوف" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="notes" label="ملاحظات">
                    <Input.TextArea rows={2} placeholder="ملاحظات اختيارية" />
                  </Form.Item>

                  {selectedAccount && (
                    <>
                      <Divider className="my-2">معلومات إضافية</Divider>
                      <Row gutter={8}>
                        <Col xs={24} md={8}>
                          <Form.Item label="تاريخ الإنشاء">
                            <DatePicker className="w-full" disabled value={selectedAccount.created_at ? dayjs(selectedAccount.created_at) : null} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item label="تاريخ التعديل">
                            <DatePicker className="w-full" disabled value={selectedAccount.updated_at ? dayjs(selectedAccount.updated_at) : null} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item label="أدخله"><Input disabled value={selectedAccount.user_id || ''} /></Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
              ) : (
                <div className="coa-empty">
                  <InfoCircleOutlined style={{ fontSize: 48, color: '#b8860b' }} />
                  <p>اختر حساباً من الشجرة أو أضف حساباً جديداً</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}