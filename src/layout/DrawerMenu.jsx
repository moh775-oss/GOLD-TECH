import { Drawer, Menu, Button } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { CloseOutlined } from '@ant-design/icons'
import { MENU_GROUPS } from '../config/menu'
import { useAuth } from '../contexts/AuthContext'

export default function DrawerMenu({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()

  const items = MENU_GROUPS.map((g) => ({
    key: g.key,
    icon: g.icon,
    label: g.label,
    children: g.items.map((it) => ({
      key: it.key,
      icon: it.icon,
      label: it.label,
    })),
  }))

  const handleClick = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key)
      onClose()
    }
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
      {/* رأس الدروار: اسم الشركة + زر إغلاق */}
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
        onClick={handleClick}
        style={{ background: '#0f0f0f', borderInlineEnd: 'none' }}
      />
    </Drawer>
  )
}