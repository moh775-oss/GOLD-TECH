import { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { homeCards } from './data'
import BottomBar from '../../layout/BottomBar'
import QuickSidebar from './QuickSidebar'
import { usePermission } from '../../hooks/usePermission'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardPage() {
  const { has } = usePermission()
  const { user } = useAuth()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1000)
  const [sideOpen, setSideOpen] = useState(window.innerWidth > 1000)

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth > 1000
      setIsDesktop(desktop)
      setSideOpen(desktop)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isSuperAdmin = user?.role === 'admin'

  const visibleCards = homeCards.filter((c) => {
    if (c.superAdminOnly && !isSuperAdmin) return false
    if (c.permission && !has(c.permission)) return false
    return true
  })

  return (
    <div className={`dashboard-wrap ${sideOpen && isDesktop ? 'with-side' : ''}`}>
      <QuickSidebar open={sideOpen} isDesktop={isDesktop} onOpenChange={setSideOpen} />
      <div className="dashboard-content">
        <Row gutter={[20, 20]} className="home-cards-row" style={{ paddingBottom: 90, paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
          {visibleCards.map((item) => (
            <Col xs={12} sm={12} lg={6} key={item.path}>
              <Link to={item.path} className="home-card">
                <span className="home-card-shine" />
                <div className="home-card-inner">
                  <div className="home-card-icon">{item.icon}</div>
                  <div className="home-card-title">{item.title}</div>
                  <div className="home-card-desc">{item.desc}</div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      <BottomBar />
    </div>
  )
}