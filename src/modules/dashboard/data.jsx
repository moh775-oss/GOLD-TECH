import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  TruckOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons'

export const homeCards = [
  { path: '/sales', title: 'تسكير مبيعات', desc: 'إغلاق وتسوية المبيعات', icon: <DollarOutlined /> },
  { path: '/purchases', title: 'تسكير مشتريات', desc: 'إغلاق وتسوية المشتريات', icon: <ShoppingCartOutlined /> },
  { path: '/customers', title: 'العملاء', desc: 'إدارة بيانات العملاء', icon: <TeamOutlined /> },
  { path: '/suppliers', title: 'الموردين', desc: 'إدارة بيانات الموردين', icon: <TruckOutlined /> },
  { path: '/statement', title: 'كشف حساب', desc: 'عرض حركة الحساب', icon: <FileTextOutlined /> },
  { path: '/settings', title: 'الإعدادات', desc: 'إعدادات النظام', icon: <SettingOutlined /> },
]