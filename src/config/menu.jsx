import {
  DashboardOutlined, DollarOutlined, ShoppingCartOutlined,
  TeamOutlined, TruckOutlined, FileTextOutlined, SettingOutlined,
  BookOutlined, ShopOutlined, BankOutlined, ApartmentOutlined,
  CalculatorOutlined, UserOutlined, BuildOutlined, HomeOutlined,
  BarChartOutlined, BellOutlined, AppstoreOutlined,
  WalletOutlined, AuditOutlined, InboxOutlined,
} from '@ant-design/icons'

export const MENU_GROUPS = [
  {
    key: 'main',
    label: 'الرئيسية',
    icon: <HomeOutlined />,
    items: [
      { key: '/', label: 'لوحة التحكم', icon: <DashboardOutlined /> },
    ],
  },
  {
    key: 'setup',
    label: 'التهيئة',
    icon: <BuildOutlined />,
    items: [
      // ===== البيانات الأساسية (submenu) =====
      {
        key: 'setup_basic',
        label: 'البيانات الأساسية',
        icon: <BookOutlined />,
        children: [
          // الأساسيات
          { key: '/companies',    label: 'الشركات',           icon: <HomeOutlined /> },
          { key: '/branches',     label: 'الفروع',            icon: <ApartmentOutlined /> },
          { key: '/users',        label: 'المستخدمون',        icon: <UserOutlined /> },
          { key: '/accounts',     label: 'دليل الحسابات',     icon: <BookOutlined /> },
          { key: '/contacts',     label: 'العملاء والموردون', icon: <TeamOutlined /> },
          { key: '/items',        label: 'الأصناف',           icon: <AppstoreOutlined /> },
          { key: '/karats',       label: 'العيارات',          icon: <DollarOutlined /> },

          // الخزائن والبنوك
          { key: '/safes',        label: 'الصناديق',          icon: <ShopOutlined /> },
          { key: '/banks',        label: 'البنوك',            icon: <BankOutlined /> },

          // الضرائب والعملات
          { key: '/taxes',        label: 'الضرائب',           icon: <CalculatorOutlined /> },
          { key: '/currencies',   label: 'العملات',           icon: <DollarOutlined /> },

          // مراكز التكلفة
          { key: '/cost-centers', label: 'مراكز التكلفة',     icon: <ApartmentOutlined /> },
        ],
      },
    ],
  },
  {
    key: 'inventory',
    label: 'المخزون',
    icon: <InboxOutlined />,
    items: [
      { key: '/stores',           label: 'المخازن',       icon: <ShopOutlined /> },
      { key: '/warehouse-stock',  label: 'أرصدة المخزون', icon: <InboxOutlined /> },
      { key: '/stock-movements',  label: 'حركات المخزون', icon: <ShoppingCartOutlined /> },
    ],
  },
  {
    key: 'operations',
    label: 'العمليات',
    icon: <ShoppingCartOutlined />,
    items: [
      { key: '/sales',           label: 'تسكير مبيعات',  icon: <DollarOutlined /> },
      { key: '/purchases',       label: 'تسكير مشتريات', icon: <ShoppingCartOutlined /> },
      { key: '/journal-entries', label: 'القيود',         icon: <CalculatorOutlined /> },
      { key: '/receipts',        label: 'سندات القبض',    icon: <WalletOutlined /> },
      { key: '/payments',        label: 'سندات الصرف',    icon: <WalletOutlined /> },
    ],
  },
  {
    key: 'reports',
    label: 'التقارير',
    icon: <BarChartOutlined />,
    items: [
      { key: '/reports/statement',   label: 'كشف حساب',       icon: <FileTextOutlined /> },
      { key: '/reports/balance',     label: 'الميزانية',      icon: <BarChartOutlined /> },
      { key: '/reports/profit-loss', label: 'الأرباح والخسائر', icon: <BarChartOutlined /> },
    ],
  },
  {
    key: 'settings',
    label: 'الإعدادات',
    icon: <SettingOutlined />,
    items: [
      { key: '/settings',    label: 'الإعدادات',    icon: <SettingOutlined /> },
      { key: '/audit-logs',  label: 'سجل التدقيق',  icon: <AuditOutlined /> },
      { key: '/theme',       label: 'الألوان',      icon: <SettingOutlined /> },
    ],
  },
  {
    key: 'notifications',
    label: 'الإشعارات',
    icon: <BellOutlined />,
    items: [
      { key: '/notifications', label: 'الإشعارات', icon: <BellOutlined /> },
    ],
  },
]