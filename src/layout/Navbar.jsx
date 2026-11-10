import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Button } from 'antd'
import {
  MenuOutlined, LogoutOutlined, SettingOutlined, MoreOutlined,
} from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MENU_GROUPS } from '../config/menu'
import DrawerMenu from './DrawerMenu'
import logo from '../assets/Logo.png'
import '../styles/nav.css'

const { Header } = Layout

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000)
  const [openKeys, setOpenKeys] = useState([])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1000)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const menuItems = MENU_GROUPS.map((g) => ({
    key: g.key,
    icon: g.icon,
    label: g.label,
    children: g.items.map((it) => ({
      key: it.key,
      icon: it.icon,
      label: it.label,
    })),
  }))

  const firstLetter = (session?.name || '').trim().charAt(0)

  const accountMenu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '6px 4px', minWidth: 180 }}>
            <div style={{ fontWeight: 700, color: '#1a1a1a' }}>
              {session?.name || 'مستخدم'}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
              {session?.mobile || ''}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
              {session?.branch_name} — {session?.fiscal_year}
            </div>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' },
      { key: 'settings', icon: <SettingOutlined />, label: 'الإعدادات' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'تسجيل الخروج', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'settings') navigate('/settings')
      if (key === 'logout') {
        try { await logout() } catch {}
        navigate('/login')
      }
    },
  }

  const handleMenuClick = ({ key }) => {
    if (key?.startsWith('/')) {
      navigate(key)
      setOpenKeys([])
    }
  }

  return (
    <>
      <Header className="erp-header">
        {!isMobile && (
          <div className="desktop-layout">
            <div className="company-section">
              <Link to="/" className="company-name">
                <img src={logo} alt="logo" className="company-logo" />
                <span className="company-text">
                  {session?.company_name || 'جولد تاك'}
                </span>
              </Link>
            </div>

            <div className="menu-center">
              <Menu
                mode="horizontal"
                theme="dark"
                items={menuItems}
                className="main-menu"
                triggerSubMenuAction="click"
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                onClick={handleMenuClick}
                selectedKeys={[location.pathname]}
                overflowedIndicator={<MoreOutlined />}
              />
            </div>

            <div className="icons-section">
              <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
                <div className="avatar-btn" title={session?.name}>
                  {firstLetter}
                </div>
              </Dropdown>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="mobile-layout">
            <div className="mobile-header">
              <Button
                className="mobile-menu-btn"
                type="text"
                icon={<MenuOutlined style={{ fontSize: 20 }} />}
                onClick={() => setDrawerOpen(true)}
              />

              <Link to="/" className="mobile-brand">
                <span className="mobile-company-name"> جولد تاك</span>
              </Link>

              <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
                <div className="avatar-btn avatar-sm" title={session?.name}>
                  {firstLetter}
                </div>
              </Dropdown>
            </div>
          </div>
        )}
      </Header>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}