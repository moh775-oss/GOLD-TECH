import {
  DollarOutlined, ShoppingCartOutlined, AppstoreOutlined,
  FileTextOutlined, TeamOutlined, TruckOutlined,
  BookOutlined, SettingOutlined, DashboardOutlined, ApartmentOutlined,
} from '@ant-design/icons'

export const homeCards = [
  // {
  //   path: '/',
  //   title: 'لوحة التحكم',
  //   desc: 'نظرة عامة على النظام',
  //   icon: <DashboardOutlined />,
  //   permission: null,
  // },
  {
    path: '/company',
    title: 'إدارة الشركات',
    desc: 'إدارة الشركات المشتركة',
    icon: <ApartmentOutlined />,
    permission: 'companies.view',
    superAdminOnly: true,   // ← تظهر فقط لمدير النظام
  },
  {
    path: '/sales',
    title: 'تسكير مبيعات',
    desc: 'إغلاق وتسوية المبيعات',
    icon: <DollarOutlined />,
    permission: 'sales_closing.view',
  },
  {
    path: '/purchases',
    title: 'تسكير مشتريات',
    desc: 'إغلاق وتسوية المشتريات',
    icon: <ShoppingCartOutlined />,
    permission: 'purchase_closing.view',
  },
  {
    path: '/items',
    title: 'الأصناف',
    desc: 'إدارة الأصناف والوحدات',
    icon: <AppstoreOutlined />,
    permission: 'items.view',
  },
  {
    path: '/statement',
    title: 'كشف حساب',
    desc: 'عرض حركة الحساب',
    icon: <FileTextOutlined />,
    permission: 'reports.contacts',
  },
  {
    path: '/customers',
    title: 'العملاء',
    desc: 'إدارة بيانات العملاء',
    icon: <TeamOutlined />,
    permission: 'contacts.view',
  },
  {
    path: '/suppliers',
    title: 'الموردين',
    desc: 'إدارة بيانات الموردين',
    icon: <TruckOutlined />,
    permission: 'contacts.view',
  },
  {
    path: '/accounts',
    title: 'دليل الحسابات',
    desc: 'إدارة دليل الحسابات',
    icon: <BookOutlined />,
    permission: 'accounts.view',
  },
  {
    path: '/settings',
    title: 'الإعدادات',
    desc: 'إعدادات النظام',
    icon: <SettingOutlined />,
    permission: 'settings.manage',
  },
]