// ============================================================
// فهرس البحث — كل صفحة مع كلمات مفتاحية عربية وإنجليزية
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

  // ===== التهيئة =====
  {
    path: '/company',
    label: 'الشركات',
    section: 'التهيئة',
    keywords: ['company', 'companies', 'شركة', 'شركات', 'مؤسسة'],
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
    label: 'صلاحية المستخدمين',
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
    label: 'الموردون',
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
    path: '/stores',
    label: 'المخازن',
    section: 'المخزون',
    keywords: ['store', 'stores', 'warehouse', 'مخزن', 'مخازن', 'مستودع'],
  },
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
    keywords: ['category', 'categories', 'item category', 'مجموعة', 'مجموعات', 'تصنيف', 'تصنيفات', 'اصناف', 'أصناف'],
  },
  {
    path: '/karats',
    label: 'العيارات',
    section: 'المخزون',
    keywords: ['karat', 'karats', 'عيار', 'عيارات', '24', '22', '21', '18', '14'],
  },
  {
    path: '/warehouse-stock',
    label: 'أرصدة المخزون',
    section: 'المخزون',
    keywords: ['stock', 'balance', 'رصيد', 'ارصدة', 'أرصدة', 'مخزون'],
  },
  {
    path: '/stock-movements',
    label: 'حركات المخزون',
    section: 'المخزون',
    keywords: ['movement', 'movements', 'حركة', 'حركات', 'تحويل', 'توريد', 'صرف'],
  },

  // ===== العمليات — مبيعات =====
  {
    path: '/sales',
    label: 'مبيعات',
    section: 'العمليات / مبيعات',
    keywords: ['sale', 'sales', 'بيع', 'مبيعات', 'فاتورة بيع', 'فواتير بيع'],
  },
  {
    path: '/sales/net',
    label: 'مبيعات صافي',
    section: 'العمليات / مبيعات',
    keywords: ['net sales', 'صافي', 'مبيعات صافي', 'صافي المبيعات', 'net', 'صافي بيع'],
  },
  {
    path: '/sales/wages',
    label: 'مبيعات أجور',
    section: 'العمليات / مبيعات',
    keywords: ['wages', 'sales wages', 'اجور', 'أجور', 'مبيعات اجور', 'مبيعات أجور', 'اجور المبيعات', 'أجور المبيعات', 'اجرة', 'أجرة', 'اجور بيع', 'أجور بيع'],
  },
  {
    path: '/sales/jewelry',
    label: 'مبيعات مصاغ',
    section: 'العمليات / مبيعات',
    keywords: ['jewelry', 'jewellery', 'مصاغ', 'مبيعات مصاغ', 'ذهب', 'مشغولات', 'حلي'],
  },
  {
    path: '/sales/returns',
    label: 'مبيعات مرتجعات',
    section: 'العمليات / مبيعات',
    keywords: ['return', 'returns', 'sales return', 'مرتجع', 'مرتجعات', 'مبيعات مرتجعات', 'مرتجعات المبيعات', 'ارجاع', 'إرجاع'],
  },

  // ===== العمليات — مشتريات =====
  {
    path: '/purchases',
    label: 'مشتريات',
    section: 'العمليات / مشتريات',
    keywords: ['purchase', 'purchases', 'شراء', 'مشتريات', 'فاتورة شراء', 'فواتير شراء'],
  },
  {
    path: '/purchases/net',
    label: 'مشتريات صافي',
    section: 'العمليات / مشتريات',
    keywords: ['net purchases', 'صافي', 'مشتريات صافي', 'صافي المشتريات', 'net', 'صافي شراء'],
  },
  {
    path: '/purchases/wages',
    label: 'مشتريات أجور',
    section: 'العمليات / مشتريات',
    keywords: ['wages', 'purchase wages', 'اجور', 'أجور', 'مشتريات اجور', 'مشتريات أجور', 'اجور المشتريات', 'أجور المشتريات', 'اجرة', 'أجرة', 'اجور شراء', 'أجور شراء'],
  },
  {
    path: '/purchases/jewelry',
    label: 'مشتريات مصاغ',
    section: 'العمليات / مشتريات',
    keywords: ['jewelry', 'jewellery', 'مصاغ', 'مشتريات مصاغ', 'ذهب', 'مشغولات', 'حلي'],
  },
  {
    path: '/purchases/returns',
    label: 'مشتريات مرتجعات',
    section: 'العمليات / مشتريات',
    keywords: ['return', 'returns', 'purchase return', 'مرتجع', 'مرتجعات', 'مشتريات مرتجعات', 'مرتجعات المشتريات', 'ارجاع', 'إرجاع'],
  },

  {
    path: '/sales',
    label: 'تسكير مبيعات',
    section: 'العمليات',
    keywords: ['sale', 'sales', 'بيع', 'مبيعات', 'فاتورة بيع'],
  },
  {
    path: '/purchases',
    label: 'تسكير مشتريات',
    section: 'العمليات',
    keywords: ['purchase', 'purchases', 'شراء', 'مشتريات', 'فاتورة شراء'],
  },

  // ===== العمليات — عام =====
  {
    path: '/journal-entries',
    label: 'القيود',
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

  // ===== التقارير =====
  {
    path: '/reports/statement',
    label: 'كشف حساب',
    section: 'التقارير',
    keywords: ['statement', 'كشف', 'حساب', 'كشف حساب'],
  },
  {
    path: '/reports/balance',
    label: 'الميزانية',
    section: 'التقارير',
    keywords: ['balance', 'sheet', 'ميزانية', 'ميزان'],
  },
  {
    path: '/reports/profit-loss',
    label: 'الأرباح والخسائر',
    section: 'التقارير',
    keywords: ['profit', 'loss', 'ارباح', 'أرباح', 'خسائر', 'ربح', 'خسارة'],
  },

  // ===== الإعدادات =====
  {
    path: '/settings',
    label: 'الإعدادات',
    section: 'الإعدادات',
    keywords: ['settings', 'setting', 'اعدادات', 'إعدادات', 'ضبط'],
  },
  {
    path: '/audit-logs',
    label: 'سجل التدقيق',
    section: 'الإعدادات',
    keywords: ['audit', 'log', 'logs', 'تدقيق', 'سجل'],
  },
  {
    path: '/theme',
    label: 'الألوان',
    section: 'الإعدادات',
    keywords: ['theme', 'color', 'colors', 'الوان', 'ألوان', 'لون', 'ثيم'],
  },

  // ===== الإشعارات =====
  {
    path: '/notifications',
    label: 'الإشعارات',
    section: 'الإشعارات',
    keywords: ['notification', 'notifications', 'اشعار', 'إشعار', 'اشعارات', 'إشعارات', 'تنبيه'],
  },
]

// ✅ دالة البحث
export function searchPages(query, limit = 8) {
  if (!query || !query.trim()) return []
  const q = query.trim().toLowerCase()

  const scored = SEARCH_INDEX.map((item) => {
    let score = 0
    const label = item.label.toLowerCase()
    const section = (item.section || '').toLowerCase()
    const keywords = (item.keywords || []).map((k) => k.toLowerCase())

    // تطابق تام في الاسم
    if (label === q) score += 100
    // الاسم يبدأ بكلمة البحث
    if (label.startsWith(q)) score += 60
    // الاسم يحتوي على كلمة البحث
    if (label.includes(q)) score += 40
    // القسم
    if (section.includes(q)) score += 20
    // الكلمات المفتاحية
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