import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <Navbar />
      <Content
        style={{
          marginTop: 68,
          padding: 0,
          minHeight: 'calc(100vh - 68px)',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}