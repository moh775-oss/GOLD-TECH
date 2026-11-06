import {
  DashboardOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  TruckOutlined,
  FileTextOutlined,
  SettingOutlined,
  BgColorsOutlined,
  BookOutlined,
} from '@ant-design/icons'

import DashboardPage from '../modules/dashboard/DashboardPage'
import SalesSettlementPage from '../modules/sales-settlement/SalesSettlementPage'
import PurchasesSettlementPage from '../modules/purchases-settlement/PurchasesSettlementPage'
import CustomersPage from '../modules/customers/CustomersPage'
import SuppliersPage from '../modules/suppliers/SuppliersPage'
import StatementPage from '../modules/statement/StatementPage'
import SettingsPage from '../modules/settings/SettingsPage'
import AccountsPage from '../modules/accounts'
import ThemePage from '../theme/ThemePage'

export const ROUTES = [
  {
    path: '/',
    key: 'dashboard',
    label: 'الرئيسية',
    icon: <DashboardOutlined />,
    component: DashboardPage,
    showInMenu: true,
  },
  {
    path: '/sales',
    key: 'sales',
    label: 'تسكير مبيعات',
    icon: <DollarOutlined />,
    component: SalesSettlementPage,
    showInMenu: true,
  },
  {
    path: '/purchases',
    key: 'purchases',
    label: 'تسكير مشتريات',
    icon: <ShoppingCartOutlined />,
    component: PurchasesSettlementPage,
    showInMenu: true,
  },
  {
    path: '/customers',
    key: 'customers',
    label: 'العملاء',
    icon: <TeamOutlined />,
    component: CustomersPage,
    showInMenu: true,
  },
  {
    path: '/suppliers',
    key: 'suppliers',
    label: 'الموردين',
    icon: <TruckOutlined />,
    component: SuppliersPage,
    showInMenu: true,
  },
  {
    path: '/statement',
    key: 'statement',
    label: 'كشف حساب',
    icon: <FileTextOutlined />,
    component: StatementPage,
    showInMenu: true,
  },
  {
    path: '/settings',
    key: 'settings',
    label: 'الإعدادات',
    icon: <SettingOutlined />,
    component: SettingsPage,
    showInMenu: true,
  },
  {
    path: '/theme',
    key: 'theme',
    label: 'الألوان',
    icon: <BgColorsOutlined />,
    component: ThemePage,
    showInMenu: false,
  },
  {
    path: '/accounts',
    key: 'accounts',
    label: 'دليل الحسابات',
    icon: <BookOutlined />,
    component: AccountsPage,
    showInMenu: true,
  },
]