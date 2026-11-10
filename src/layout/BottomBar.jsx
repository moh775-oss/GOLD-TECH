import { useState, useEffect } from 'react'
import { Dropdown, Button } from 'antd'
import {
  ShopOutlined, UserOutlined, ClockCircleOutlined, MoreOutlined,
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import '../styles/layout.css'

export default function BottomBar() {
  const { session } = useAuth()
  const [now, setNow] = useState(new Date())
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => {
      clearInterval(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  if (!session) return null

  const formattedDate = now.toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const formattedTime = now.toLocaleTimeString('ar-SA', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const mobileMenu = {
    items: [
      {
        key: 'user',
        icon: <UserOutlined />,
        label: (
          <div style={{ padding: '4px 0' }}>
            <strong>المستخدم:</strong> {session.name || '-'}
          </div>
        ),
      },
      {
        key: 'branch',
        icon: <ShopOutlined />,
        label: `الفرع: ${session.branch_name || '-'}`,
      },
      {
        key: 'fiscal',
        icon: <ClockCircleOutlined />,
        label: `السنة المالية: ${session.fiscal_year || '-'}`,
      },
      { type: 'divider' },
      {
        key: 'datetime',
        icon: <ClockCircleOutlined />,
        label: (
          <div>
            <div>{formattedDate}</div>
            <div style={{ color: '#d4a017', fontWeight: 700, marginTop: 2 }}>
              {formattedTime}
            </div>
          </div>
        ),
      },
    ],
  }

  return (
    <div className="app-bottom-bar">
      <div className="bb-right">
        <ShopOutlined className="bb-icon" />
        <span className="bb-company">
          {session.company_name || '-'} — {session.branch_name || '-'}
        </span>
      </div>

      <div className="bb-left">
        {!isMobile ? (
          <>
            <div className="bb-item">
              <UserOutlined className="bb-icon" />
              <span>{session.name || '-'}</span>
            </div>
            <div className="bb-divider" />
            <div className="bb-item">
              <ClockCircleOutlined className="bb-icon" />
              <span>{formattedDate}</span>
              <span className="bb-time">{formattedTime}</span>
            </div>
          </>
        ) : (
          <Dropdown
            trigger={['click']}
            placement="topRight"
            menu={mobileMenu}
          >
            <Button
              type="text"
              className="bb-more-btn"
              icon={<MoreOutlined style={{ fontSize: 22, color: '#d4a017' }} />}
            />
          </Dropdown>
        )}
      </div>
    </div>
  )
}