import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  )
}