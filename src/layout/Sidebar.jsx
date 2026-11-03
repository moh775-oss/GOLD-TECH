import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

const { Sider } = Layout

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = ROUTES.filter((r) => r.showInMenu).map((r) => ({
    key: r.path,
    icon: r.icon,
    label: r.label,
  }))

  return (
    <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          color: '#d4a017',
          padding: 16,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        نظام الذهب
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}