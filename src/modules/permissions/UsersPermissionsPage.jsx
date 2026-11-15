import { useState, useEffect } from 'react'
import { Card, Tree, Button, Row, Col, Tag, Space, Spin, Empty, Input , Tooltip } from 'antd'
import {
  SaveOutlined, ReloadOutlined, UserOutlined, SafetyOutlined,
  SearchOutlined, PlusSquareOutlined, MinusSquareOutlined,NodeExpandOutlined,NodeCollapseOutlined,
} from '@ant-design/icons'
import notify from '../../lib/notify.jsx'
import { permissionsApi } from './permissionsApi.jsx'
import { usersApi } from '../users/usersApi.jsx'
import './UsersPermissionsPage.css'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function UsersPermissionsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [treeData, setTreeData] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [searchText, setSearchText] = useState('')
  const { user: currentUser, refreshPermissions } = useAuth()

  useEffect(() => {
    loadUsers()
    loadTree()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await usersApi.list()
      if (res.data.success) {
        const data = res.data.data || []
        setUsers(data)
        setFilteredUsers(data)
      }
    } catch (e) {
      console.error('loadUsers:', e)
    }
  }

  const loadTree = async () => {
    setLoading(true)
    try {
      const res = await permissionsApi.tree()
      if (res.data.success) {
        setTreeData(res.data.data || [])
        setExpandedKeys([])
      }
    } catch (e) {
      console.error('loadTree:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSearch = (value) => {
    setSearchText(value)
    const filtered = users.filter(u =>
      String(u.name || '').toLowerCase().includes(value.toLowerCase()) ||
      String(u.mobile || '').includes(value)
    )
    setFilteredUsers(filtered)
  }

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId)
    setLoading(true)
    try {
      const res = await permissionsApi.getUserPermissions(userId)
      if (res.data.success) {
        const ids = res.data.data.user_permission_ids || []
        const keys = ids.map(id => `perm_${id}`)
        setCheckedKeys(keys)
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الجلب')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedUser) {
      notify.warning('اختر مستخدم أولاً')
      return
    }
    setSaving(true)
    try {
      const ids = checkedKeys
        .filter(k => String(k).startsWith('perm_'))
        .map(k => Number(String(k).replace('perm_', '')))

      const res = await permissionsApi.saveUserPermissions(selectedUser, {
        permission_ids: ids,
      })

      if (res.data.success) {
        notify.success(res.data.message || 'تم الحفظ')
        if (selectedUser === currentUser?.id) {
            await refreshPermissions()
        }
      } else {
        notify.error(res.data.message || 'فشل الحفظ')
      }
    } catch (e) {
      notify.error(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const expandAll = () => setExpandedKeys(treeData.map(g => g.key))
  const collapseAll = () => setExpandedKeys([])

  const toggleModuleAll = (module) => {
    const childrenKeys = (module.children || []).map(c => `perm_${c.permissionId}`)
    const allChecked = childrenKeys.length > 0 && childrenKeys.every(k => checkedKeys.includes(k))

    if (allChecked) {
      setCheckedKeys(prev => prev.filter(k => !childrenKeys.includes(k)))
    } else {
      setCheckedKeys(prev => {
        const next = [...prev]
        childrenKeys.forEach(k => { if (!next.includes(k)) next.push(k) })
        return next
      })
    }
  }

  const renderTreeTitle = (node) => {
    if (node.isParent) {
      const childrenKeys = (node.children || []).map(c => `perm_${c.permissionId}`)
      const checkedCount = childrenKeys.filter(k => checkedKeys.includes(k)).length
      const allChecked = childrenKeys.length > 0 && checkedCount === childrenKeys.length
      const someChecked = checkedCount > 0 && checkedCount < childrenKeys.length

      return (
        <label className="rg-native-check-label perm-parent-label">
          <input
            type="checkbox"
            className="rg-native-check"
            checked={allChecked}
            ref={(el) => {
              if (el) el.indeterminate = someChecked
            }}
            onChange={() => toggleModuleAll(node)}
          />
          <span className="perm-parent-name">{node.title}</span>
          <span className="perm-parent-count">{checkedCount}/{childrenKeys.length}</span>
        </label>
      )
    }

    return (
      <div className="perm-node">
        <label className="rg-native-check-label">
          <input
            type="checkbox"
            className="rg-native-check"
            checked={checkedKeys.includes(`perm_${node.permissionId}`)}
            onChange={(e) => {
              const key = `perm_${node.permissionId}`
              if (e.target.checked) {
                setCheckedKeys(prev => [...prev, key])
              } else {
                setCheckedKeys(prev => prev.filter(k => k !== key))
              }
            }}
          />
          <span className="rg-native-check-text perm-name">{node.title}</span>
        </label>
      </div>
    )
  }

  return (
    <div className="users-permissions-page">
      <Row gutter={16} className="users-permissions-container">

        <Col xs={24} md={7} style={{ height: '100%' }}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>المستخدمون</span>
              </Space>
            }
            className="users-permissions-card"
          >
            <div className="up-users-search">
              <Input
                placeholder="بحث بالاسم أو الجوال"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleUserSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="up-users-list">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  className={`up-user-item ${selectedUser === u.id ? 'up-user-item-active' : ''}`}
                  onClick={() => handleUserSelect(u.id)}
                >
                  <div className="up-user-avatar">
                    {String(u.name || 'U').charAt(0)}
                  </div>
                  <div className="up-user-info">
                    <span className="up-user-name">{u.name}</span>
                    <span className="up-user-role">{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={17} style={{ height: '100%' }}>
          <Card
            title={
              <div className="up-permissions-header">
                <Space>
                  <SafetyOutlined />
                  <span>الصلاحيات</span>
                  {selectedUser && (
                    <Tag color="gold">
                      {users.find(u => u.id === selectedUser)?.name}
                    </Tag>
                  )}
                </Space>
                <Space>
      
                <Tooltip title="توسيع الكل"><Button size="small" icon={<NodeExpandOutlined />} onClick={expandAll} /></Tooltip>
                <Tooltip title="طي الكل"><Button size="small" icon={<NodeCollapseOutlined />} onClick={collapseAll} /></Tooltip>
                <Tooltip title="تحدبث"><Button size="small" icon={<ReloadOutlined />} onClick={() => handleUserSelect(selectedUser)} /></Tooltip>
                <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSave} loading={saving} disabled={!selectedUser}>حفظ</Button>
                </Space>
              </div>
            }
            className="users-permissions-card"
            >
            {loading ? (
              <div className="up-loading"><Spin size="large" /></div>
            ) : !selectedUser ? (
              <div className="up-empty">
                <Empty description="اختر مستخدماً لعرض صلاحياته" />
              </div>
            ) : (
              <div className="up-tree-wrapper">
                <Tree
                  selectable={false}
                  showLine={{ showLeafIcon: false }}
                  expandedKeys={expandedKeys}
                  onExpand={setExpandedKeys}
                  treeData={treeData}
                  titleRender={renderTreeTitle}
                  className="up-permissions-tree"
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}