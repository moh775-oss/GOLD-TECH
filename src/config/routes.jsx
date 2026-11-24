import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { DashboardOutlined, BookOutlined, TeamOutlined, TruckOutlined, ApartmentOutlined, UserOutlined, SafetyOutlined, AppstoreOutlined, ShopOutlined, BankOutlined, CalculatorOutlined, DollarOutlined, InboxOutlined, ShoppingCartOutlined, WalletOutlined, FileTextOutlined, BarChartOutlined, SettingOutlined, AuditOutlined, TagsOutlined, HomeOutlined, FileDoneOutlined, FileExcelOutlined } from '@ant-design/icons'

import DashboardPage from '../modules/dashboard/DashboardPage'
import RegisterPage from '../modules/auth/RegisterPage'
import LoginPage from '../modules/auth/LoginPage'
import CompanyPage from '../modules/companies/CompaniesPage'
import CompanyInfoPage from '../modules/settings/CompanyInfoPage'
import CompanyReportPage from '../modules/companies/CompanyReportPage'
import AccountsPage from '../modules/accounts/ChartOfAccounts'
import CustomersPage from '../modules/contacts/CustomersPage'
import SuppliersPage from '../modules/contacts/SuppliersPage'
import SafesPage from '../modules/safes/SafesPage'
import BanksPage from '../modules/banks/BanksPage'
import TaxesPage from '../modules/taxes/TaxesPage'
import CurrenciesPage from '../modules/currencies/CurrenciesPage'
import CostCentersPage from '../modules/costCenters/CostCentersPage'
import ItemsPage from '../modules/items/ItemsPage'
import ItemCategoriesPage from '../modules/itemCategories/ItemCategoriesPage'
import KaratsPage from '../modules/karats/KaratsPage'
import Branches from '../modules/branches/BranchesPage'
import UsersPage from '../modules/users/UsersPage'
import UsersPermissionsPage from '../modules/permissions/UsersPermissionsPage'
import JournalEntriesPage from '../modules/journalEntries/JournalEntriesPage'
import ReceiptVouchersPage from '../modules/vouchers/receipt/ReceiptVouchersPage'
import PaymentVouchersPage from '../modules/vouchers/payment/PaymentVouchersPage'
import SalesClosingsPage from '../modules/salesClosings/SalesClosingsPage.jsx'
import SalesClosingForm from '../modules/salesClosings/SalesClosingForm.jsx'
import PurchaseClosingsPage from '../modules/purchaseClosings/PurchaseClosingsPage.jsx'
import PurchaseClosingForm from '../modules/purchaseClosings/PurchaseClosingForm.jsx'
import AccountStatementPage from '../modules/accountStatement/AccountStatementPage'
import GoldOpeningBalancesPage from '../modules/goldOpeningBalances/GoldOpeningBalancesPage'


const CompanyGuard = ({ children }) => {
  const { user } = useAuth()
  const { id } = useParams()
  if (id && String(id) !== '1') return <Navigate to="/" replace />
  if (!id && String(user?.company_id) !== '1') return <Navigate to="/" replace />
  return children
}

export const ROUTES = [
  { path: '/login', key: 'login', label: 'تسجيل الدخول', icon: null, component: LoginPage, showInMenu: false, public: true, withLayout: false },
  { path: '/register', key: 'register', label: 'إنشاء حساب', icon: null, component: RegisterPage, showInMenu: false, public: true, withLayout: false },
  { path: '/', key: 'dashboard', label: 'الرئيسية', icon: <DashboardOutlined />, component: DashboardPage, showInMenu: true, public: false, withLayout: true },
  
  // الشركات (محمية بـ CompanyGuard)
  { path: '/company', key: 'company', label: 'إدارة الشركات', icon: <ApartmentOutlined />, component: () => <CompanyGuard><CompanyPage /></CompanyGuard>, showInMenu: true, public: false, withLayout: false },
  { path: '/companies/:id/report', key: 'company-report', label: 'تقرير شركة', icon: <BarChartOutlined />, component: () => <CompanyGuard><CompanyReportPage /></CompanyGuard>, showInMenu: false, public: false, withLayout: false },
  { path: '/company-info', key: 'company-info', label: 'بيانات الشركة', icon: <ApartmentOutlined />, component: CompanyInfoPage, showInMenu: true, public: false, withLayout: false, permission: 'company_info.manage' },
  
  // المستخدمون والأدوار
  { path: '/users', key: 'users', label: 'المستخدمون', icon: <UserOutlined />, component: UsersPage, showInMenu: true, public: false, withLayout: false, permission: 'users.view' },
  { path: '/permissions', key: 'permissions', label: 'صلاحيات المستخدمين', icon: <SafetyOutlined />, component: UsersPermissionsPage, showInMenu: true, public: false, withLayout: false, permission: 'roles.view' },
  
  // الحسابات والعملاء
  { path: '/accounts', key: 'accounts', label: 'دليل الحسابات', icon: <BookOutlined />, component: AccountsPage, showInMenu: true, public: false, withLayout: false, permission: 'accounts.view' },
  { path: '/customers', key: 'customers', label: 'العملاء', icon: <TeamOutlined />, component: CustomersPage, showInMenu: true, public: false, withLayout: false, permission: 'contacts.view' },
  { path: '/suppliers', key: 'suppliers', label: 'الموردين', icon: <TruckOutlined />, component: SuppliersPage, showInMenu: true, public: false, withLayout: false, permission: 'contacts.view' },
  
  // الصناديق والبنوك والضرائب والعملات
  { path: '/safes', key: 'safes', label: 'الصناديق', icon: <ShopOutlined />, component: SafesPage, showInMenu: true, public: false, withLayout: false, permission: 'safes.view' },
  { path: '/banks', key: 'banks', label: 'البنوك', icon: <BankOutlined />, component: BanksPage, showInMenu: true, public: false, withLayout: false, permission: 'banks.view' },
  { path: '/taxes', key: 'taxes', label: 'الضرائب', icon: null, component: TaxesPage, showInMenu: true, public: false, withLayout: false, permission: 'taxes.view' },
  { path: '/currencies', key: 'currencies', label: 'العملات', icon: null, component: CurrenciesPage, showInMenu: true, public: false, withLayout: false, permission: 'currencies.view' },
  { path: '/cost-centers', key: 'cost-centers', label: 'مراكز التكلفة', icon: <ApartmentOutlined />, component: CostCentersPage, showInMenu: true, public: false, withLayout: false, permission: 'cost_centers.view' },
  { path: '/branches', key: 'branches', label: 'الفروع', icon: <ApartmentOutlined />, component: Branches, showInMenu: true, public: false, withLayout: false, permission: 'branches.view' },
  
  // الأصناف
  { path: '/items', key: 'items', label: 'الأصناف', icon: <AppstoreOutlined />, component: ItemsPage, showInMenu: true, public: false, withLayout: false, permission: 'items.view' },
  { path: '/itemCategories', key: 'itemCategories', label: 'مجموعة الأصناف', icon: <AppstoreOutlined />, component: ItemCategoriesPage, showInMenu: true, public: false, withLayout: false, permission: 'item_categories.view' },
  { path: '/karats', key: 'karats', label: 'العيارات', icon: null, component: KaratsPage, showInMenu: true, public: false, withLayout: false, permission: 'karats.view' },
  
  // التقارير والقيود
  { path: '/reports/statement', key: 'account-statement', label: 'كشف حساب', icon: <FileTextOutlined />, component: AccountStatementPage, showInMenu: true, public: false, withLayout: false, permission: 'reports.contacts' },
  { path: '/journal-entries', key: 'journal-entries', label: 'القيود اليومية', icon: <FileTextOutlined />, component: JournalEntriesPage, showInMenu: true, public: false, withLayout: false, permission: 'journal.view' },
  { path: '/gold-opening-balances', key: 'gold-opening-balances', label: 'رصيد افتتاحي', icon: <FileDoneOutlined />, component: GoldOpeningBalancesPage, showInMenu: true, public: false, withLayout: false, permission: 'gold_opening_balances.view' },
  
  // السندات
  { path: '/receipts', key: 'receipt', label: 'سندات القبض', icon: <AuditOutlined />, component: ReceiptVouchersPage, showInMenu: true, public: false, withLayout: false, permission: 'receipt_vouchers.view' },
  { path: '/payments', key: 'payment', label: 'سندات الصرف', icon: <WalletOutlined />, component: PaymentVouchersPage, showInMenu: true, public: false, withLayout: false, permission: 'payment_vouchers.view' },
  
  // تسكير المبيعات والمشتريات
  { path: '/sales-closings', key: 'sales-closings', label: 'تسكير المبيعات', icon: <DollarOutlined />, component: SalesClosingsPage, showInMenu: true, public: false, withLayout: false, permission: 'sales_closing.view' },
  { path: '/sales-closings/new', key: 'sales-closings-new', label: 'إضافة تسكير مبيعات', icon: null, component: SalesClosingForm, showInMenu: false, public: false, withLayout: false, permission: 'sales_closing.view' },
  { path: '/sales-closings/:id/edit', key: 'sales-closings-edit', label: 'تعديل تسكير مبيعات', icon: null, component: SalesClosingForm, showInMenu: false, public: false, withLayout: false, permission: 'sales_closing.view' },
  { path: '/purchase-closings', key: 'purchase-closings', label: 'تسكير المشتريات', icon: <ShoppingCartOutlined />, component: PurchaseClosingsPage, showInMenu: true, public: false, withLayout: false, permission: 'purchase_closing.view' },
  { path: '/purchase-closings/new', key: 'purchase-closings-new', label: 'إضافة تسكير مشتريات', icon: null, component: PurchaseClosingForm, showInMenu: false, public: false, withLayout: false, permission: 'purchase_closing.view' },
  { path: '/purchase-closings/:id/edit', key: 'purchase-closings-edit', label: 'تعديل تسكير مشتريات', icon: null, component: PurchaseClosingForm, showInMenu: false, public: false, withLayout: false, permission: 'purchase_closing.view' },
]








// import {
//   DashboardOutlined,
//   BookOutlined,
//   DollarOutlined,
//   ShoppingCartOutlined,
//   TeamOutlined,
//   TruckOutlined,
//   FileTextOutlined,
//   SettingOutlined,
//   BgColorsOutlined,
//   ShopOutlined,
//   BankOutlined,
//   ApartmentOutlined,
//   CalculatorOutlined,
// } from '@ant-design/icons'


// import DashboardPage from '../modules/dashboard/DashboardPage'
// import RegisterPage from '../modules/auth/RegisterPage'
// import LoginPage from '../modules/auth/LoginPage'
// import CompanyPage from '../modules/companies/CompaniesPage'
// import AccountsPage from '../modules/accounts/ChartOfAccounts'
// import CustomersPage from '../modules/contacts/CustomersPage'
// import SuppliersPage from '../modules/contacts/SuppliersPage'
// import SafesPage from '../modules/safes/SafesPage'
// import BanksPage from '../modules/banks/BanksPage'
// import TaxesPage from '../modules/taxes/TaxesPage'
// import CurrenciesPage from '../modules/currencies/CurrenciesPage'
// import CostCentersPage from '../modules/costCenters/CostCentersPage'
// import ItemsPage from '../modules/items/ItemsPage'
// import ItemCategoriesPage from '../modules/itemCategories/ItemCategoriesPage'
// import Branches from '../modules/branches/BranchesPage'


// // import SalesSettlementPage from '../modules/sales-settlement/SalesSettlementPage'
// // import PurchasesSettlementPage from '../modules/purchases-settlement/PurchasesSettlementPage'

// // import StatementPage from '../modules/statement/StatementPage'
// // import SettingsPage from '../modules/settings/SettingsPage'
// // import AccountsPage from '../modules/accounts'
// // import ThemePage from '../theme/ThemePage'
// // import ContactsPage from '../modules/contacts/ContactsPage'
// // import JournalEntriesPage from '../modules/journal-entries/JournalEntriesPage'
// // import SafesPage from '../modules/safes/SafesPage'
// // import BanksPage from '../modules/banks/BanksPage'
// // import BranchesPage from '../modules/branches/BranchesPage'


// export const ROUTES = [
//   { path: '/login', key: 'login', label: 'تسجيل الدخول', icon: null, component: LoginPage, showInMenu: false, public: true , withLayout: false },
//   { path: '/', key: 'dashboard', label: 'الرئيسية', icon: <DashboardOutlined />, component: DashboardPage, showInMenu: true, public: false, withLayout: true },
//   { path: '/register', key: 'register', label: 'إنشاء حساب', icon: null, component: RegisterPage, showInMenu: false, public: true , withLayout: false },
//   { path: '/company', key: 'company', label: 'إدارة الشركات', icon: null, component: CompanyPage , showInMenu: false, public: false, withLayout: false,  },
//   { path: '/accounts', key: 'accounts', label: 'دليل الحسابات', icon: <BookOutlined />, component: AccountsPage, showInMenu: true , public: false, withLayout: false,  },
//   { path: '/customers', key: 'customers', label: 'العملاء', icon: <TeamOutlined />, component: CustomersPage, showInMenu: true , public: false, withLayout: false,  },
//   { path: '/suppliers', key: 'suppliers', label: 'الموردين', icon: <TruckOutlined />, component: SuppliersPage, showInMenu: true , public: false, withLayout: false,  },
//   { path: '/safes',      key: 'safes',      label: 'الصناديق', icon: null, component: SafesPage,      showInMenu: true, public: false , withLayout: false,  },
//   { path: '/banks',      key: 'banks',      label: 'البنوك',   icon: null, component: BanksPage,      showInMenu: true, public: false, withLayout: false,  },
//   { path: '/taxes',      key: 'taxes',      label: 'الضرائب',  icon: null, component: TaxesPage,      showInMenu: true, public: false, withLayout: false },
//   { path: '/currencies', key: 'currencies', label: 'العملات',  icon: null, component: CurrenciesPage, showInMenu: true, public: false, withLayout: false },
//   { path: '/cost-centers', key: 'cost-centers', label: 'مراكز التكلفة', icon: <ApartmentOutlined />, component: CostCentersPage, showInMenu: true ,public: false, withLayout: false },
//   { path: '/branches', key: 'branches', label: 'الفروع', icon: <ApartmentOutlined />, component: Branches, showInMenu: true ,public: false, withLayout: false },

//   { path: '/items', key: 'items', label: 'الاصناف',  icon: null, component: ItemsPage, showInMenu: true, public: false, withLayout: false },
//   { path: '/itemCategories', key: 'itemCategories', label: 'مجموعة الاصناف', icon: null, component: ItemCategoriesPage, showInMenu: true ,public: false, withLayout: false },

//   // { path: '/sales', key: 'sales', label: 'تسكير مبيعات', icon: <DollarOutlined />, component: SalesSettlementPage, showInMenu: true ,public: false, withLayout: false },
//   // { path: '/purchases', key: 'purchases', label: 'تسكير مشتريات', icon: <ShoppingCartOutlined />, component: PurchasesSettlementPage, showInMenu: true,public: false, withLayout: false  },
  
  



//   // { path: '/customers', key: 'customers', label: 'العملاء', icon: <TeamOutlined />, component: CustomersPage, showInMenu: true },
//   // { path: '/suppliers', key: 'suppliers', label: 'الموردين', icon: <TruckOutlined />, component: SuppliersPage, showInMenu: true },
//   // { path: '/contacts', key: 'contacts', label: 'العملاء والموردون', icon: <TeamOutlined />, component: ContactsPage, showInMenu: true },
//   // { path: '/journal-entries', key: 'journal-entries', label: 'القيود', icon: <CalculatorOutlined />, component: JournalEntriesPage, showInMenu: true },
//   // { path: '/accounts', key: 'accounts', label: 'دليل الحسابات', icon: <BookOutlined />, component: AccountsPage, showInMenu: true },
  

//   // { path: '/safes', key: 'safes', label: 'الصناديق', icon: <ShopOutlined />, component: SafesPage, showInMenu: true },
//   // { path: '/banks', key: 'banks', label: 'البنوك', icon: <BankOutlined />, component: BanksPage, showInMenu: true },
//   // { path: '/branches', key: 'branches', label: 'الفروع', icon: <ApartmentOutlined />, component: BranchesPage, showInMenu: true },
//   // { path: '/statement', key: 'statement', label: 'كشف حساب', icon: <FileTextOutlined />, component: StatementPage, showInMenu: true },
//   // { path: '/settings', key: 'settings', label: 'الإعدادات', icon: <SettingOutlined />, component: SettingsPage, showInMenu: true },
//   // { path: '/theme', key: 'theme', label: 'الألوان', icon: <BgColorsOutlined />, component: ThemePage, showInMenu: false },
// ]