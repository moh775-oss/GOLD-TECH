import { Layout, Menu } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { MENU_GROUPS } from '../config/menu'

const { Sider, Content } = Layout

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const sideItems = MENU_GROUPS.map((g) => ({
    key: g.key,
    icon: g.icon,
    label: g.label,
    children: g.items.map((it) => ({
      key: it.key,
      icon: it.icon,
      label: it.label,
    })),
  }))

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar — يظهر فقط على الشاشات الكبيرة */}
      <Sider
        theme="dark"
        breakpoint="lg"
        collapsedWidth={0}
        width={260}
        className="app-sider"
        trigger={null}
      >
        <div
          style={{
            color: '#d4a017',
            padding: '20px 16px',
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 18,
            borderBottom: '1px solid #2a2a2a',
          }}
        >
          نظام الذهب
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={MENU_GROUPS.map((g) => g.key)}
          items={sideItems}
          onClick={({ key }) => key.startsWith('/') && navigate(key)}
          style={{ background: '#0f0f0f', borderInlineEnd: 'none' }}
        />
      </Sider>

      <Layout>
        <Navbar />
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}