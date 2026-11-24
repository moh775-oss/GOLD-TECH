import { useState, useEffect, useRef } from 'react'
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

  // ✅ متغير لحفظ نقطة بداية اللمس
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth > 1000
      setIsDesktop(desktop)
      setSideOpen(desktop)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isSuperAdmin = String(user?.company_id) === '1'

  const visibleCards = homeCards.filter((c) => {
    if (c.superAdminOnly && !isSuperAdmin) return false
    if (c.permission && !c.superAdminOnly && !has(c.permission)) return false
    return true
  })

  // ✅ دوال السحب (Swipe) للفتح والإغلاق
  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - touchStart.current.x
    const deltaY = touchEndY - touchStart.current.y

    // التأكد من أن الحركة أفقية (لتجنب فتح القائمة أثناء التمرير لأسفل)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
      
      // إذا سحب لليسار (deltaX سالب) والقائمة مغلقة -> يفتحها
      if (deltaX < -60 && !sideOpen) {
        setSideOpen(true)
      } 
      // إذا سحب لليمين (deltaX موجب) والقائمة مفتوحة -> يغلقها
      else if (deltaX > 60 && sideOpen) {
        setSideOpen(false)
      }
    }
  }

  return (
    <div 
      className={`dashboard-wrap ${sideOpen && isDesktop ? 'with-side' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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