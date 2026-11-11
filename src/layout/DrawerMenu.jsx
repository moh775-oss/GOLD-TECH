import { Drawer, Menu, Button, Dropdown } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import { MENU_GROUPS } from '../config/menu'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/Logo.png'
import '../styles/nav.css'

// ✅ تحويل العناصر لروابط <Link>
const buildMenuItems = (items) => {
  return items.map((it) => {
    if (it.children && it.children.length > 0) {
      return {
        key: it.key,
        icon: it.icon,
        label: it.label,
        children: buildMenuItems(it.children),
      }
    }
    return {
      key: it.key,
      icon: it.icon,
      label: <Link to={it.key} onClick={(e) => e.stopPropagation()}>{it.label}</Link>,
    }
  })
}

export default function DrawerMenu({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, logout } = useAuth()

  const items = MENU_GROUPS.map((g) => ({
    key: g.key,
    icon: g.icon,
    label: g.label,
    children: buildMenuItems(g.items),
  }))

  const firstLetter = (session?.name || 'م').trim().charAt(0)

  const accountMenu = {
    items: [
      {
        key: 'header',
        disabled: true,
        label: (
          <div style={{ padding: '6px 4px', minWidth: 170 }}>
            <div style={{ fontWeight: 700, color: '#1a1a1a' }}>
              {session?.name || 'مستخدم'}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
              {session?.mobile || ''}
            </div>
          </div>
        ),
      },
      { type: 'divider' },
      { key: 'settings', label: 'الإعدادات' },
      { type: 'divider' },
      { key: 'logout', label: 'تسجيل الخروج', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'settings') { navigate('/settings'); onClose() }
      if (key === 'logout') {
        try { await logout() } catch {}
        navigate('/login')
        onClose()
      }
    },
  }

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
      {/* رأس الدروار */}
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

      {/* معلومات المستخدم */}
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
        onClick={({ key }) => {
          // لو العنصر مش رابط (submenu)، مفيش حاجة
          // لو رابط، <Link> هيتولى الأمر
          if (key.startsWith('/')) {
            onClose()
          }
        }}
        style={{ background: '#0f0f0f', borderInlineEnd: 'none' }}
      />
    </Drawer>
  )
}