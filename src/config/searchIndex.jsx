// ============================================================
// فهرس البحث — مبني على الروتس الحقيقية الموجودة في النظام فقط
// ============================================================

export const SEARCH_INDEX = [
  // ===== الرئيسية =====
  {
    path: '/',
    label: 'لوحة التحكم',
    section: 'الرئيسية',
    icon: 'home',
    keywords: ['dashboard', 'home', 'الرئيسية', 'لوحة', 'رئيسية', 'homepage'],
  },

  // ===== التهيئة (الإعدادات الأساسية) =====
  {
    path: '/company',
    label: 'إدارة الشركات',
    section: 'التهيئة',
    keywords: ['company', 'companies', 'شركة', 'شركات', 'مؤسسة'],
  },
  {
    path: '/company-info',
    label: 'بيانات الشركة',
    section: 'التهيئة',
    keywords: ['company info', 'بيانات', 'معلومات الشركة', 'اعدادات الشركة'],
  },
  {
    path: '/branches',
    label: 'الفروع',
    section: 'التهيئة',
    keywords: ['branch', 'branches', 'فرع', 'فروع'],
  },
  {
    path: '/users',
    label: 'المستخدمون',
    section: 'التهيئة',
    keywords: ['user', 'users', 'مستخدم', 'مستخدمين', 'موظف', 'موظفين'],
  },
  {
    path: '/permissions',
    label: 'صلاحيات المستخدمين',
    section: 'التهيئة',
    keywords: ['permission', 'permissions', 'role', 'roles', 'صلاحية', 'صلاحيات', 'ادوار', 'أدوار'],
  },
  {
    path: '/accounts',
    label: 'دليل الحسابات',
    section: 'التهيئة',
    keywords: ['account', 'accounts', 'chart', 'حساب', 'حسابات', 'دليل', 'شجرة'],
  },
  {
    path: '/customers',
    label: 'العملاء',
    section: 'التهيئة',
    keywords: ['customer', 'customers', 'client', 'عميل', 'عملاء', 'زبون', 'زبان'],
  },
  {
    path: '/suppliers',
    label: 'الموردين',
    section: 'التهيئة',
    keywords: ['supplier', 'suppliers', 'vendor', 'مورد', 'موردين', 'موردون'],
  },
  {
    path: '/safes',
    label: 'الصناديق',
    section: 'التهيئة',
    keywords: ['safe', 'safes', 'cash', 'صندوق', 'صناديق', 'نقدية', 'كاش'],
  },
  {
    path: '/banks',
    label: 'البنوك',
    section: 'التهيئة',
    keywords: ['bank', 'banks', 'بنك', 'بنوك', 'حساب بنكي'],
  },
  {
    path: '/taxes',
    label: 'الضرائب',
    section: 'التهيئة',
    keywords: ['tax', 'taxes', 'vat', 'ضريبة', 'ضرائب', 'قيمة مضافة'],
  },
  {
    path: '/currencies',
    label: 'العملات',
    section: 'التهيئة',
    keywords: ['currency', 'currencies', 'money', 'عملة', 'عملات', 'ريال', 'دولار'],
  },
  {
    path: '/cost-centers',
    label: 'مراكز التكلفة',
    section: 'التهيئة',
    keywords: ['cost', 'center', 'cost center', 'تكلفة', 'مركز', 'مراكز'],
  },

  // ===== المخزون =====
  {
    path: '/items',
    label: 'الأصناف',
    section: 'المخزون',
    keywords: ['item', 'items', 'product', 'صنف', 'اصناف', 'أصناف', 'منتج', 'منتجات', 'ذهب'],
  },
  {
    path: '/itemCategories',
    label: 'مجموعة الأصناف',
    section: 'المخزون',
    keywords: ['category', 'categories', 'item category', 'مجموعة', 'مجموعات', 'تصنيف', 'تصنيفات'],
  },
  {
    path: '/karats',
    label: 'العيارات',
    section: 'المخزون',
    keywords: ['karat', 'karats', 'عيار', 'عيارات', '24', '22', '21', '18', '14'],
  },
  {
    path: '/gold-opening-balances',
    label: 'رصيد افتتاحي (ذهب)',
    section: 'المخزون',
    keywords: ['opening balance', 'gold', 'رصيد', 'افتتاحي', 'ذهب', 'بداية المدة'],
  },

  // ===== العمليات =====
  {
    path: '/journal-entries',
    label: 'القيود اليومية',
    section: 'العمليات',
    keywords: ['journal', 'entry', 'entries', 'قيد', 'قيود', 'يومية'],
  },
  {
    path: '/receipts',
    label: 'سندات القبض',
    section: 'العمليات',
    keywords: ['receipt', 'receipts', 'قبض', 'سند قبض', 'تحصيل'],
  },
  {
    path: '/payments',
    label: 'سندات الصرف',
    section: 'العمليات',
    keywords: ['payment', 'payments', 'صرف', 'سند صرف', 'دفع'],
  },
  {
    path: '/sales-closings',
    label: 'تسكير المبيعات',
    section: 'العمليات',
    keywords: ['sales closing', 'sale', 'تسكير', 'مبيعات', 'اقفال مبيعات'],
  },
  {
    path: '/purchase-closings',
    label: 'تسكير المشتريات',
    section: 'العمليات',
    keywords: ['purchase closing', 'purchase', 'تسكير', 'مشتريات', 'اقفال مشتريات'],
  },

  // ===== التقارير =====
  {
    path: '/reports/statement',
    label: 'كشف حساب',
    section: 'التقارير',
    keywords: ['statement', 'كشف', 'حساب', 'كشف حساب', 'حركة حساب'],
  },
  {
    path: '/companies/:id/report',
    label: 'تقرير شركة',
    section: 'التقارير',
    keywords: ['company report', 'تقرير', 'شركة', 'تقرير شركة'],
  }
]

// ✅ دالة البحث (لم يتم تغييرها)
export function searchPages(query, limit = 8) {
  if (!query || !query.trim()) return []
  const q = query.trim().toLowerCase()

  const scored = SEARCH_INDEX.map((item) => {
    let score = 0
    const label = item.label.toLowerCase()
    const section = (item.section || '').toLowerCase()
    const keywords = (item.keywords || []).map((k) => k.toLowerCase())

    if (label === q) score += 100
    if (label.startsWith(q)) score += 60
    if (label.includes(q)) score += 40
    if (section.includes(q)) score += 20
    
    keywords.forEach((k) => {
      if (k === q) score += 50
      if (k.startsWith(q)) score += 30
      if (k.includes(q)) score += 15
    })

    return { ...item, score }
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored
}