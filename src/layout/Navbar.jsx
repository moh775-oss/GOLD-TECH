import { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Button, Tooltip } from 'antd'
import {
  MenuOutlined, LogoutOutlined, SettingOutlined, MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePermission } from '../hooks/usePermission'
import { MENU_GROUPS } from '../config/menu'
import DrawerMenu from './DrawerMenu'
import SearchModal from './SearchModal'
import NotificationsDropdown from './NotificationsDropdown' // ✅ استيراد مكون الإشعارات
import logo from '../assets/Logo.png'
import '../styles/nav.css'
import '../styles/SearchModal.css'

const { Header } = Layout

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, logout } = useAuth()
  const { has } = usePermission()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000)
  const [openKeys, setOpenKeys] = useState([])
  
  // ✅ حالة وهمية للإشعارات (مبدئياً صفر) - يمكنك جلبها من السيرفر لاحقاً
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1000)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ✅ Ctrl+K / Cmd+K لفتح البحث
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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
            label: <span className="menu-label-text">{it.label}</span>,
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

  const menuItems = buildItems(MENU_GROUPS)
  const firstLetter = (session?.name || '').trim().charAt(0)

  const accountMenu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '6px 4px', minWidth: 180 }}>
            <div style={{ fontWeight: 700, color: '#1a1a1a' }}>{session?.name || 'مستخدم'}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{session?.mobile || ''}</div>
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
      { key: 'logout', icon: <LogoutOutlined />, label: 'تسجيل الخروج', className: 'logout-menu-item', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'settings') navigate('/settings')
      if (key === 'logout') {
        try { await logout() } catch { }
        navigate('/login')
      }
    },
  }

  return (
    <>
      <Header className="erp-header">
        {!isMobile && (
          <div className="desktop-layout">
            <div className="company-section">
              <Link to="/" className="company-name">
                <img src={logo} alt="logo" className="company-logo" />
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
                selectedKeys={[location.pathname]}
                overflowedIndicator={<MoreOutlined />}
              />
            </div>

            <div className="icons-section">
              <div className="icons-container" style={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsDropdown count={unreadCount} items={notifications} />
                
                <Tooltip title="بحث (Ctrl+K)">
                  <button className="icon-btn search-btn" onClick={() => setSearchOpen(true)}>
                    <SearchOutlined />
                  </button>
                </Tooltip>

                
                

                {/* أيقونة المستخدم */}
                <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
                  <div className="avatar-btn" title={session?.name}>
                    {firstLetter}
                  </div>
                </Dropdown>
              </div>
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
                <span className="mobile-company-name">جولد تاك</span>
              </Link>

              <div className="mobile-icons" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div className="mobile-notif-wrap">
                  <NotificationsDropdown count={unreadCount} items={notifications} />
                </div>

                <button
                  type="button"
                  className="mobile-icon-btn"
                  onClick={() => setSearchOpen(true)}
                  style={{ width: 28, height: 28, fontSize: 13 }}
                >
                  <SearchOutlined />
                </button>

                <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
                  <div
                    className="avatar-btn avatar-sm"
                    title={session?.name}
                    style={{ width: 28, height: 28, fontSize: 12, lineHeight: '28px' }}
                  >
                    {firstLetter}
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        )}
      </Header>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}