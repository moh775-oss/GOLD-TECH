import { Drawer, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { MENU_GROUPS } from '../config/menu'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function DrawerMenu({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

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
        body: { padding: 0, background: '#0f0f0f' },
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
        }}
      >
        <span style={{ color: '#d4a017', fontWeight: 800, fontSize: 18 }}>نظام الذهب</span>
        <Button
          type="text"
          icon={<CloseOutlined style={{ color: '#d4a017', fontSize: 18 }} />}
          onClick={onClose}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={MENU_GROUPS.map((g) => g.key)}
        items={items}
        onClick={handleClick}
        style={{ background: '#0f0f0f', borderInlineEnd: 'none' }}
      />
    </Drawer>
  )
}