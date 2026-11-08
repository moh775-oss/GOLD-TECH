import { Layout, Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from "../config/routes";
import { useAuth } from '../contexts/AuthContext'

const { Sider, Header, Content } = Layout

export default function AppLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = ROUTES.filter((r) => r.showInMenu).map((r) => ({
    key: r.path,
    icon: r.icon,
    label: <Link to={r.path}>{r.label}</Link>,
  }))

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={240}>
        <div style={{ color: '#fff', padding: 16, fontWeight: 700, fontSize: 18 }}>
          نظام الذهب
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          <div>
            {user?.name} — {user?.branch_name} — {user?.fiscal_year}
          </div>
          <a onClick={() => { logout(); navigate('/login') }} style={{ cursor: 'pointer' }}>
            خروج
          </a>
        </Header>

        <Content style={{ padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}