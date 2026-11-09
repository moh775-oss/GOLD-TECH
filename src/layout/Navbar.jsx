import { useState } from 'react'
import { Layout, Dropdown, Avatar, Space, Button } from 'antd'
import { MenuOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/Logo.png'
import DrawerMenu from './DrawerMenu'

const { Header } = Layout

export default function Navbar() {
  const navigate = useNavigate()
  const { session, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const accountMenu = {
    items: [
      { key: 'profile',  icon: <UserOutlined />,    label: 'الحساب' },
      { key: 'settings', icon: <SettingOutlined />, label: 'الإعدادات' },
      { type: 'divider' },
      { key: 'logout',   icon: <LogoutOutlined />,  label: 'تسجيل الخروج', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'settings') navigate('/settings')
      if (key === 'logout') { await logout(); navigate('/login') }
    },
  }

  return (
    <>
      <Header className="app-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            className="app-burger"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20, color: '#d4a017' }} />}
            onClick={() => setDrawerOpen(true)}
          />
          <Link to="/" className="app-brand">
            <img src={logo} alt="جولد تاك" className="app-brand-logo" />
            <span className="app-brand-name">جولد تاك</span>
          </Link>
        </div>

        <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
          <Space className="app-account" size={8}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1a1a1a', border: '1px solid #b8860b', color: '#d4a017' }}
            />
          </Space>
        </Dropdown>
      </Header>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}