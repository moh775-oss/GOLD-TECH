import { Layout, Dropdown, Avatar, Space } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'

const { Header } = Layout

export default function Navbar() {
  const navigate = useNavigate()

  const accountMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'الحساب' },
      { key: 'settings', icon: <SettingOutlined />, label: 'الإعدادات' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'تسجيل الخروج', danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'settings') navigate('/settings')
      if (key === 'logout') {
        // منطق تسجيل الخروج لاحقاً
      }
    },
  }

  return (
    <Header className="app-navbar">
      {/* يمين: الشعار + الاسم */}
      <Link to="/" className="app-brand">
        <img src={logo} alt="جولد تاك" className="app-brand-logo" />
        <span className="app-brand-name"> اشرف التميمي</span>
      </Link>

      {/* يسار: الحساب */}
      <Dropdown menu={accountMenu} placement="bottomLeft" trigger={['click']}>
        <Space className="app-account" size={8}>
          <Avatar
            size={36}
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #b8860b',
              color: '#d4a017',
            }}
          />
        </Space>
      </Dropdown>
    </Header>
  )
}