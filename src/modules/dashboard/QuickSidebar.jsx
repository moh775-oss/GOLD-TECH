import { Link } from 'react-router-dom'
import {
  LeftOutlined, RightOutlined,
  DollarOutlined, ShoppingCartOutlined,
  WalletOutlined, InboxOutlined,AuditOutlined,
} from '@ant-design/icons'
import { usePermission } from '../../hooks/usePermission'
import './quick-sidebar.css'

const quickLinks = [
  { key: '/sales',            label: 'مبيعات أجور',       icon: <DollarOutlined />,         permission: 'sales_wages.view' },
  { key: '/purchases',        label: 'مشتريات أجور',      icon: <ShoppingCartOutlined />,   permission: 'purchase_wages.view' },
  { key: '/receipts',         label: 'سند قبض ذهب / ريال', icon: <AuditOutlined />,         permission: 'receipt_vouchers.view' },
  { key: '/payments',         label: 'سند صرف ذهب / ريال', icon: <WalletOutlined />,         permission: 'payment_vouchers.view' },
  { key: '/gold',             label: 'أسعار الذهب',        icon: <InboxOutlined />,          permission: 'gold_prices.view' },
  { key: '/warehouse-rack',   label: 'صرف مخزني',          icon: <InboxOutlined />,          permission: 'stock_movements.view' },
  { key: '/warehouse-supply', label: 'توريد مخزني',        icon: <InboxOutlined />,          permission: 'stock_movements.view' },
]

export default function QuickSidebar({ open, onOpenChange, isDesktop }) {
  const { has } = usePermission()

  const visible = quickLinks.filter((q) => !q.permission || has(q.permission))

  return (
    <>
      <button
        type="button"
        className={`quick-side-trigger ${open ? 'is-open' : ''}`}
        onClick={() => onOpenChange(!open)}
        aria-label="فتح الروابط السريعة"
      >
        {open ? <RightOutlined /> : <LeftOutlined />}
      </button>

      <aside
        className={`quick-side-panel ${open ? 'is-open' : ''} ${isDesktop ? 'desktop' : 'mobile'}`}
      >
        <div className="quick-side-title">روابط سريعة</div>
        <div className="quick-side-list">
          {visible.map((q) => (
            <Link
              key={q.key}
              to={q.key}
              className="quick-side-item"
              onClick={() => onOpenChange(false)}
            >
              <span className="quick-side-item-icon">{q.icon}</span>
              <span className="quick-side-item-label">{q.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}