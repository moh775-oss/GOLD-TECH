import { Dropdown, Badge } from 'antd'
import { BellOutlined } from '@ant-design/icons'

export default function NotificationsDropdown({ count = 0, items = [] }) {
  // القائمة المنسدلة للإشعارات
  const menu = {
    items: items.length > 0 
      ? items // هنا سيتم عرض الإشعارات الحقيقية لاحقاً
      : [
          {
            key: 'empty',
            label: (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontWeight: 'bold' }}>
                لا توجد إشعارات
              </div>
            ),
            disabled: true,
          }
        ],
  }

  return (
    <Dropdown 
      menu={menu} 
      placement="bottomLeft" 
      trigger={['click']} 
      overlayStyle={{ width: 280, minWidth: 280 }}
    >
      {/* ✅ زر شفاف بدون خلفية، مع أيقونة ذهبية */}
      <button
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginRight: 8,
          marginLeft: 8,
          outline: 'none'
        }}
      >
        {/* ✅ showZero لإظهار الصفر، واللون الأحمر للتنبيه */}
        <Badge count={count} showZero size="small" offset={[2, -2]} color="#ff4d4f">
          <BellOutlined style={{ fontSize: 20, color: '#d4a017' }} />
        </Badge>
      </button>
    </Dropdown>
  )
}