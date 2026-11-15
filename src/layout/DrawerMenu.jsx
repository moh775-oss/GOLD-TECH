import { useEffect } from 'react'
import { Drawer, Menu, Button } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import { MENU_GROUPS } from '../config/menu'
import { useAuth } from '../contexts/AuthContext'
import { usePermission } from '../hooks/usePermission'
import '../styles/nav.css'

export default function DrawerMenu({ open, onClose }) {
  const location = useLocation()
  const { session } = useAuth()
  const { has } = usePermission()

  useEffect(() => {
    if (open) onClose()
  }, [location.pathname])

  const canSee = (permission) => !permission || has(permission)

  const buildItems = (items) =>
    (items || [])
      .filter((it) => canSee(it.permission))
      .map((it) => {
        if (it.items && it.items.length > 0) {
          const children = buildItems(it.items)
          if (children.length === 0) return null
          return {
            key: it.key,
            icon: it.icon,
            label: it.label,
            children,
          }
        }
        return {
          key: it.key,
          icon: it.icon,
          label: <Link to={it.key}>{it.label}</Link>,
        }
      })
      .filter(Boolean)

  const items = buildItems(MENU_GROUPS)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={320}
      closable={false}
      styles={{
        header: { display: 'none' },
        body: { padding: 0, background: '#0f0f0f', overflowY: 'auto' },
      }}
      rootClassName="app-drawer"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #2a2a2a',
          position: 'sticky',
          top: 0,
          background: '#0f0f0f',
          zIndex: 2,
        }}
      >
        <span style={{ color: '#d4a017', fontWeight: 800, fontSize: 17 }}>
          {session?.company_name || 'جولد تاك'}
        </span>
        <Button
          type="text"
          icon={<CloseOutlined style={{ color: '#d4a017', fontSize: 18 }} />}
          onClick={onClose}
        />
      </div>

      <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
          {session?.name || 'مستخدم'}
        </div>
        <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
          {session?.branch_name} — {session?.fiscal_year}
        </div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ background: '#0f0f0f', borderInlineEnd: 'none' }}
      />
    </Drawer>
  )
}