import {
  DollarOutlined, ShoppingCartOutlined,
  TeamOutlined, FileTextOutlined, SettingOutlined,
  BookOutlined, ShopOutlined, BankOutlined, ApartmentOutlined,
  CalculatorOutlined, UserOutlined, BuildOutlined, HomeOutlined,
  BarChartOutlined, BellOutlined, AppstoreOutlined,
  WalletOutlined, AuditOutlined, InboxOutlined,
  TagsOutlined, SafetyOutlined,
} from '@ant-design/icons'

export const MENU_GROUPS = [
  {
    key: '/',
    label: 'الرئيسية',
    icon: <HomeOutlined />,
    permission: null,
  },
  {
    key: 'setup',
    label: 'التهيئة',
    icon: <BuildOutlined />,
    items: [
      { key: '/company', label: 'الشركات', icon: <ApartmentOutlined />, permission: 'companies.view' },
      { key: '/branches',     label: 'الفروع',         icon: <ApartmentOutlined />, permission: 'branches.view' },
      { key: '/users',        label: 'المستخدمون',     icon: <UserOutlined />,      permission: 'users.view' },
      { key: '/accounts',     label: 'دليل الحسابات',  icon: <BookOutlined />,      permission: 'accounts.view' },
      { key: '/customers',    label: 'العملاء',        icon: <TeamOutlined />,      permission: 'contacts.view' },
      { key: '/suppliers',    label: 'الموردون',       icon: <TeamOutlined />,      permission: 'contacts.view' },
      { key: '/safes',        label: 'الصناديق',       icon: <ShopOutlined />,      permission: 'safes.view' },
      { key: '/banks',        label: 'البنوك',         icon: <BankOutlined />,      permission: 'banks.view' },
      { key: '/taxes',        label: 'الضرائب',        icon: <CalculatorOutlined />,permission: 'taxes.view' },
      { key: '/currencies',   label: 'العملات',        icon: <DollarOutlined />,    permission: 'currencies.view' },
      { key: '/cost-centers', label: 'مراكز التكلفة',  icon: <ApartmentOutlined />, permission: 'cost_centers.view' },
    ],
  },
  {
    key: 'inventory',
    label: 'المخزون',
    icon: <InboxOutlined />,
    items: [
      { key: '/stores',           label: 'المخازن',          icon: <ShopOutlined />,       permission: 'stores.view' },
      { key: '/items',            label: 'الأصناف',           icon: <AppstoreOutlined />,   permission: 'items.view' },
      { key: '/itemCategories',   label: 'مجموعة الأصناف',    icon: <TagsOutlined />,       permission: 'item_categories.view' },
      { key: '/karats',           label: 'العيارات',          icon: <DollarOutlined />,     permission: 'karats.view' },
      { key: '/warehouse-stock',  label: 'أرصدة المخزون',     icon: <InboxOutlined />,      permission: 'warehouse_stock.view' },
      { key: '/stock-movements',  label: 'حركات المخزون',     icon: <ShoppingCartOutlined />, permission: 'stock_movements.view' },
    ],
  },
  {
    key: 'operations',
    label: 'العمليات',
    icon: <ShoppingCartOutlined />,
    items: [
      { key: '/sales',           label: 'تسكير مبيعات',   icon: <DollarOutlined />,       permission: 'sales_closing.view' },
      { key: '/purchases',       label: 'تسكير مشتريات',  icon: <ShoppingCartOutlined />, permission: 'purchase_closing.view' },
      { key: '/journal-entries', label: 'القيود',          icon: <CalculatorOutlined />,   permission: 'journal.view' },
      { key: '/receipts',        label: 'سندات القبض',     icon: <WalletOutlined />,       permission: 'receipt_vouchers.view' },
      { key: '/payments',        label: 'سندات الصرف',     icon: <WalletOutlined />,       permission: 'payment_vouchers.view' },
    ],
  },
  {
    key: 'reports',
    label: 'التقارير',
    icon: <BarChartOutlined />,
    items: [
      { key: '/reports/statement',   label: 'كشف حساب',        icon: <FileTextOutlined />, permission: 'reports.contacts' },
      { key: '/reports/balance',     label: 'الميزانية',        icon: <BarChartOutlined />, permission: 'reports.accounts' },
      { key: '/reports/profit-loss', label: 'الأرباح والخسائر', icon: <BarChartOutlined />, permission: 'reports.accounts' },
    ],
  },
  {
    key: 'settings',
    label: 'الإعدادات',
    icon: <SettingOutlined />,
    items: [
      { key: '/settings',    label: 'الإعدادات',    icon: <SettingOutlined />, permission: 'settings.manage' },
      { key: '/audit-logs',  label: 'سجل التدقيق',  icon: <AuditOutlined />,   permission: null },
      { key: '/theme',       label: 'الألوان',      icon: <SettingOutlined />, permission: null },
    ],
  },
  {
    key: 'notifications',
    label: 'الإشعارات',
    icon: <BellOutlined />,
    items: [
      { key: '/notifications', label: 'الإشعارات', icon: <BellOutlined />, permission: null },
    ],
  },
]