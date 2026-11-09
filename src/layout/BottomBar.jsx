
import { useState } from 'react'
import { Dropdown } from 'antd'
import {
  MoreOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import '../styles/layout.css'

export default function BottomBar() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)

  if (!session) return null

  const items = [
    {
      key: 'branch',
      icon: <BankOutlined />,
      label: `الفرع: ${session.branch_name || '-'}`,
    },
    {
      key: 'year',
      icon: <CalendarOutlined />,
      label: `السنة المالية: ${session.fiscal_year || '-'}`,
    },
  ]

  return (
    <div className="app-bottom-bar">
      <div className="bottom-bar-company">
        <AppstoreOutlined />
        <b>{session.company_name || '-'}</b>
      </div>

      <div className="bottom-bar-user">
        <UserOutlined />
        <span>{session.name || '-'}</span>
      </div>

      <div className="bottom-bar-details">
        <div>
          <BankOutlined />
          <span>{session.branch_name || '-'}</span>
        </div>
        <div>
          <CalendarOutlined />
          <span>{session.fiscal_year || '-'}</span>
        </div>
      </div>

      <div className="bottom-bar-more">
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="topRight"
          open={open}
          onOpenChange={setOpen}
        >
          <button type="button" className="bottom-bar-more-button">
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>
    </div>
  )
}
