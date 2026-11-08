import {
  DashboardOutlined,
  // DollarOutlined,
  // ShoppingCartOutlined,
  // TeamOutlined,
  // TruckOutlined,
  // FileTextOutlined,
  // SettingOutlined,
  // BgColorsOutlined,
  // BookOutlined,
  // ShopOutlined,
  // BankOutlined,
  // ApartmentOutlined,
  // CalculatorOutlined,
} from '@ant-design/icons'


import DashboardPage from '../modules/dashboard/DashboardPage'
import RegisterPage from '../modules/auth/RegisterPage'
import LoginPage from '../modules/auth/LoginPage'


// import SalesSettlementPage from '../modules/sales-settlement/SalesSettlementPage'
// import PurchasesSettlementPage from '../modules/purchases-settlement/PurchasesSettlementPage'
// import CustomersPage from '../modules/customers/CustomersPage'
// import SuppliersPage from '../modules/suppliers/SuppliersPage'
// import StatementPage from '../modules/statement/StatementPage'
// import SettingsPage from '../modules/settings/SettingsPage'
// import AccountsPage from '../modules/accounts'
// import ThemePage from '../theme/ThemePage'
// import ContactsPage from '../modules/contacts/ContactsPage'
// import JournalEntriesPage from '../modules/journal-entries/JournalEntriesPage'
// import SafesPage from '../modules/safes/SafesPage'
// import BanksPage from '../modules/banks/BanksPage'
// import BranchesPage from '../modules/branches/BranchesPage'
// import CostCentersPage from '../modules/cost-centers/CostCentersPage'

export const ROUTES = [
  { path: '/login', key: 'login', label: 'تسجيل الدخول', icon: null, component: LoginPage, showInMenu: false, public: true },
  { path: '/', key: 'dashboard', label: 'الرئيسية', icon: <DashboardOutlined />, component: DashboardPage, showInMenu: true },
{ path: '/register', key: 'register', label: 'إنشاء حساب', icon: null, component: RegisterPage, showInMenu: false, public: true },



  // { path: '/sales', key: 'sales', label: 'تسكير مبيعات', icon: <DollarOutlined />, component: SalesSettlementPage, showInMenu: true },
  // { path: '/purchases', key: 'purchases', label: 'تسكير مشتريات', icon: <ShoppingCartOutlined />, component: PurchasesSettlementPage, showInMenu: true },
  // { path: '/customers', key: 'customers', label: 'العملاء', icon: <TeamOutlined />, component: CustomersPage, showInMenu: true },
  // { path: '/suppliers', key: 'suppliers', label: 'الموردين', icon: <TruckOutlined />, component: SuppliersPage, showInMenu: true },
  // { path: '/contacts', key: 'contacts', label: 'العملاء والموردون', icon: <TeamOutlined />, component: ContactsPage, showInMenu: true },
  // { path: '/journal-entries', key: 'journal-entries', label: 'القيود', icon: <CalculatorOutlined />, component: JournalEntriesPage, showInMenu: true },
  // { path: '/accounts', key: 'accounts', label: 'دليل الحسابات', icon: <BookOutlined />, component: AccountsPage, showInMenu: true },
  // { path: '/cost-centers', key: 'cost-centers', label: 'مراكز التكلفة', icon: <ApartmentOutlined />, component: CostCentersPage, showInMenu: true },
  // { path: '/safes', key: 'safes', label: 'الصناديق', icon: <ShopOutlined />, component: SafesPage, showInMenu: true },
  // { path: '/banks', key: 'banks', label: 'البنوك', icon: <BankOutlined />, component: BanksPage, showInMenu: true },
  // { path: '/branches', key: 'branches', label: 'الفروع', icon: <ApartmentOutlined />, component: BranchesPage, showInMenu: true },
  // { path: '/statement', key: 'statement', label: 'كشف حساب', icon: <FileTextOutlined />, component: StatementPage, showInMenu: true },
  // { path: '/settings', key: 'settings', label: 'الإعدادات', icon: <SettingOutlined />, component: SettingsPage, showInMenu: true },
  // { path: '/theme', key: 'theme', label: 'الألوان', icon: <BgColorsOutlined />, component: ThemePage, showInMenu: false },
]