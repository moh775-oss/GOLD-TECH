
CREATE TABLE companies (
    id                      BIGINT        NOT NULL AUTO_INCREMENT,
    name                    VARCHAR(200)  NOT NULL,
    name_en                 VARCHAR(200)  NULL,
    commercial_register     VARCHAR(50)   NULL,
    tax_number              VARCHAR(50)   NULL,
    phone                   VARCHAR(30)   NULL,
    mobile                  VARCHAR(30)   NULL,
    email                   VARCHAR(150)  NULL,
    website                 VARCHAR(150)  NULL,
    country                 VARCHAR(100)  NULL DEFAULT 'السعودية',
    city                    VARCHAR(100)  NULL,
    district                VARCHAR(100)  NULL,
    street                  VARCHAR(200)  NULL,
    building_no             VARCHAR(20)   NULL,
    postal_code             VARCHAR(20)   NULL,
    extra_no                VARCHAR(20)   NULL,
    address                 VARCHAR(400)  NULL,
    location_url            VARCHAR(400)  NULL,
    logo_path               VARCHAR(300)  NULL,
    subscription_plan       VARCHAR(50)   NULL,
    subscription_start      DATE          NULL,
    subscription_end        DATE          NULL,
    subscription_amount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    subscription_cycle      VARCHAR(20)   NULL,
    subscription_status     VARCHAR(20)   NOT NULL DEFAULT 'active',
    trial_end               DATE          NULL,
    max_users               INT           NOT NULL DEFAULT 0,
    max_branches            INT           NOT NULL DEFAULT 0,
    max_contacts            INT           NOT NULL DEFAULT 0,
    max_documents_per_month INT           NOT NULL DEFAULT 0,
    current_users_count     INT           NOT NULL DEFAULT 0,
    current_branches_count  INT           NOT NULL DEFAULT 0,
    last_login_at           DATETIME      NULL,
    is_active               TINYINT(1)    NOT NULL DEFAULT 1,
    notes                   VARCHAR(1000) NULL,
    user_id                 BIGINT        NULL,
    created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_companies_cr (commercial_register),
    KEY idx_companies_tax (tax_number),
    KEY idx_companies_status (subscription_status),
    KEY idx_companies_sub_end (subscription_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
















CREATE TABLE company_subscriptions (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    company_id        BIGINT        NOT NULL,
    plan              VARCHAR(50)   NULL,
    cycle             VARCHAR(20)   NULL,
    start_date        DATE          NOT NULL,
    end_date          DATE          NOT NULL,
    amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    currency          VARCHAR(10)   NOT NULL DEFAULT 'SAR',
    payment_method    VARCHAR(30)   NULL,
    payment_reference VARCHAR(100)  NULL,
    paid_at           DATETIME      NULL,
    payment_status    VARCHAR(20)   NOT NULL DEFAULT 'pending',
    max_users         INT           NOT NULL DEFAULT 0,
    max_branches      INT           NOT NULL DEFAULT 0,
    notes             VARCHAR(500)  NULL,
    user_id           BIGINT        NULL,
    created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_subs_company (company_id),
    KEY idx_subs_status (payment_status),
    KEY idx_subs_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;













CREATE TABLE subscription_reminders (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    company_id    BIGINT       NOT NULL,
    reminder_type VARCHAR(30)  NULL,
    reminder_date DATE         NULL,
    message       VARCHAR(500) NULL,
    is_sent       TINYINT(1)   NOT NULL DEFAULT 0,
    sent_at       DATETIME     NULL,
    user_id       BIGINT       NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_reminders_company (company_id),
    KEY idx_reminders_sent (is_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE branches (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    code        VARCHAR(30)   NULL,
    phone       VARCHAR(30)   NULL,
    mobile      VARCHAR(30)   NULL,
    email       VARCHAR(150)  NULL,
    address     VARCHAR(400)  NULL,
    city        VARCHAR(100)  NULL,
    district    VARCHAR(100)  NULL,
    street      VARCHAR(200)  NULL,
    building_no VARCHAR(20)   NULL,
    postal_code VARCHAR(20)   NULL,
    is_main     TINYINT(1)    NOT NULL DEFAULT 0,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    notes       VARCHAR(1000) NULL,
    user_id     BIGINT        NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_branches_company (company_id),
    KEY idx_branches_code (company_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;











CREATE TABLE users (
    id                  BIGINT        NOT NULL AUTO_INCREMENT,
    company_id          BIGINT        NOT NULL,
    branch_id           BIGINT        NULL,
    name                VARCHAR(150)  NOT NULL,
    mobile              VARCHAR(30)   NOT NULL,
    password_hash       VARCHAR(500)  NOT NULL,
    email               VARCHAR(150)  NULL,
    role                VARCHAR(50)   NULL,
    avatar_path         VARCHAR(300)  NULL,
    allow_branch_switch TINYINT(1)    NOT NULL DEFAULT 0,
    last_login_at       DATETIME      NULL,
    last_login_ip       VARCHAR(45)   NULL,
    is_active           TINYINT(1)    NOT NULL DEFAULT 1,
    user_id             BIGINT        NULL,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_mobile (mobile),
    KEY idx_users_company (company_id),
    KEY idx_users_branch (branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




















CREATE TABLE company_info (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    branch_id   BIGINT       NULL,
    name        VARCHAR(200) NOT NULL,
    name_en     VARCHAR(200) NULL,
    phone       VARCHAR(30)  NULL,
    mobile      VARCHAR(30)  NULL,
    email       VARCHAR(150) NULL,
    website     VARCHAR(150) NULL,
    address     VARCHAR(400) NULL,
    city        VARCHAR(100) NULL,
    tax_number  VARCHAR(50)  NULL,
    logo_path   VARCHAR(300) NULL,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_company_info_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE accounts (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    company_id     BIGINT       NOT NULL,
    branch_id      BIGINT       NULL,
    acc_no         VARCHAR(50)  NOT NULL,
    name           VARCHAR(200) NOT NULL,
    father_acc_no  VARCHAR(50)  NULL,
    account_type   VARCHAR(20)  NOT NULL,
    account_level  INT          NOT NULL,
    final_account  VARCHAR(200) NULL,
    account_nature VARCHAR(10)  NOT NULL,
    is_active      TINYINT(1)   NOT NULL DEFAULT 1,
    notes          VARCHAR(500) NULL,
    user_id        BIGINT       NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_accounts_company_branch (company_id, branch_id),
    KEY idx_accounts_accno (company_id, branch_id, acc_no),
    KEY idx_accounts_father (father_acc_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE document_types (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    company_id        BIGINT       NULL,
    type_code         VARCHAR(40)  NOT NULL,
    trans_code        VARCHAR(10)  NULL,
    name              VARCHAR(100) NOT NULL,
    name_en           VARCHAR(100) NULL,
    trans_rest_type   VARCHAR(20)  NULL,
    system_id         INT          NULL,
    op_calc           TINYINT      NULL,
    sort_order        INT          NOT NULL DEFAULT 0,
    is_active         TINYINT(1)   NOT NULL DEFAULT 1,
    user_id           BIGINT       NULL,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_document_types_company (company_id),
    KEY idx_document_types_code (company_id, type_code),
    KEY idx_document_types_trans_code (trans_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;








INSERT INTO document_types
(type_code, trans_code, name, name_en, trans_rest_type, system_id, op_calc, sort_order) VALUES
('PURCHASE',           '01', 'مشتريات',                  'Purches',                      NULL, 2,    1,  1),
('SALE',               '02', 'مبيعات',                   'sales',                        NULL, 1,   -1,  2),
('PURCHASE_RETURN',    '11', 'مرتجع مشتريات',            'Purches Retuern',              NULL, 2,   -1,  3),
('SALE_RETURN',        '12', 'مرتجع مبيعات',             'Sales Return',                 NULL, 1,    1,  4),
('RECEIPT_VOUCHER',    '5',  'سند قبض',                  'accounts',                     NULL, NULL, 1,  5),
('PAYMENT_VOUCHER',    '6',  'سند صرف',                  'accounts',                     NULL, NULL, 1,  6),
('RECEIPT_INTERNAL',   '7',  'سند قبض داخلي',            'accounts',                     NULL, NULL, 1,  7),
('PAYMENT_INTERNAL',   '8',  'سند صرف داخلي',            'accounts',                     NULL, NULL,-1,  8),
('FIRST_STOCK',        '22', 'مخزون اول المده',          'First Stock',                  NULL, 3,    1,  9),
('JOURNAL_ENTRY',      '33', 'قيود اليومية',             'daily restrictions',           NULL, NULL, 1, 10),

('OPENING_BALANCE',    '28', 'رصيد افتتاحي',             'Opening balance',              NULL, NULL,NULL,11),
('SALE_REPLACE',       '13', 'استبدال مبيعات',           'Sales Replace',                NULL, 1,    1, 13),
('SHIFT_MATCHING',     '14', 'مطابقة الورديات',          'Shift Matching',               NULL, 1,    1, 14),
('PURCHASE_REPLACE',   '15', 'استبدال مشتريات',          'Purches Replace',              NULL, 2,   -1, 15),
('RECEIPT_MULTI',      '17', 'سند قبض متعدد',            'accounts',                     NULL, NULL, 1, 17),
('PAYMENT_MULTI',      '18', 'سند صرف متعدد',            'accounts',                     NULL, NULL, 1, 18),
('STOCK_SUPPLY',       '23', 'توريد مخزني',              'Tawwreed Stock',               NULL, 3,    1, 23),
('STOCK_ISSUE',        '24', 'صرف مخزني',                'safr Stock',                   NULL, 3,   -1, 24),
('STOCK_TRANSFER',     '25', 'تحويل مخزني',              'tahweel Stock',                NULL, NULL,-1, 25),
('STOCK_RECEIVE',      '26', 'استلام مخزني',             'istilam Stock',                NULL, NULL, 1, 26),
('STOCK_ADJUST',       '27', 'تسوية مخزون',              'Taswiya Stock',                NULL, NULL, 1, 27),
('CASH_RENT_1',        '35', 'فاتورة قبض 1',             'catsh Rent 1',                 NULL, NULL, 0, 35),
('SPEND_RENT_1',       '36', 'فاتورة صرف 1',             'Spend Rent 1',                 NULL, NULL, 1, 36),
('ACCOUNT_TRANSFER',   '37', 'تحويل عملات',              'Account Transfer',             NULL, NULL, 1, 37),
('STOCK_SUPPLY_1',     '43', 'توريد مخزني1',             'Tawreed1',                     NULL, NULL,NULL,43),
('STOCK_ISSUE_1',      '44', 'صرف مخزني 1',              'Spend1',                       NULL, NULL,NULL,44),
('INVENTORY_COUNT',    '45', 'إدخال قوائم جرد المخزون',  'InventoryGard',                NULL, NULL,NULL,45),
('CASHIER_SALE',       '46', 'بيع كاشير',                'Sale Casher',                  NULL, NULL,NULL,46),
('CASHIER_SALE_RET',   '47', 'مرتجع بيع كاشير',          'ReturnSale Casher',            NULL, NULL,NULL,47),
('CASHIER_SALE_PAY',   '48', 'مدفوعات بيع كاشير',        'TotalSaleCasher',              NULL, NULL,NULL,48),
('CASHIER_RET_PAY',    '49', 'مدفوعات مرتجع بيع كاشير',  'TotalReSaleCasher',            NULL, NULL,NULL,49),
('OFFER_PRICE',        '50', 'فاتوره عرض سعر',           'OfferPrice',                   NULL, NULL,NULL,50),
('SERVICE_SALE',       '51', 'فاتورة بيع خدمه',          'serviceInvoiceSall',           NULL, NULL,NULL,51),
('SERVICE_SALE_RET',   '52', 'فاتورة مرتجع بيع خدمه',    'serviceInvoiceReturnSall',     NULL, NULL,NULL,52),
('DEBIT_NOTE',         '53', 'اشعار مدين',               'MadinPoems',                   NULL, NULL,NULL,53),
('CASHIER_CLOSE',      '54', 'إغلاق سجلات الكاشير',      'CashierRecordClose',           NULL, NULL,NULL,54),
('SHIFT_OPEN',         NULL, 'فتح الوردية',              'Shift Open',                   NULL, NULL,NULL,55);


INSERT INTO document_types (type_code, trans_code, name, name_en, sort_order) VALUES
('SALES_CLOSING',    'S1', 'تسكير مبيعات',  'Sales Closing',    60),
('PURCHASE_CLOSING', 'P1', 'تسكير مشتريات', 'Purchase Closing', 61);

INSERT INTO account_mappings (company_id, `key`, acc_no) VALUES
(1, 'SALES_CLOSING_REVENUE', '4101'),
(1, 'SALES_CLOSING_WAGES',   '4102'),
(1, 'PURCHASE_CLOSING_EXPENSE', '5101'),
(1, 'PURCHASE_CLOSING_WAGES',   '5102'),
(1, 'GOLD_INVENTORY', '1103');

















CREATE TABLE accounts_template (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    acc_no         VARCHAR(50)  NOT NULL,
    name           VARCHAR(200) NOT NULL,
    father_acc_no  VARCHAR(50)  NULL,
    account_type   VARCHAR(20)  NOT NULL,     -- رئيسي / فرعي
    account_level  INT          NOT NULL,
    final_account  VARCHAR(200) NULL,         -- الميزانية العمومية / الأرباح والخسائر
    account_nature VARCHAR(10)  NOT NULL,     -- مدين / دائن
    is_active      TINYINT(1)   NOT NULL DEFAULT 1,
    sort_order     INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_tpl_accno (acc_no),
    KEY idx_tpl_father (father_acc_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












INSERT INTO accounts_template
(acc_no, name, father_acc_no, account_type, account_level, final_account, account_nature, sort_order) VALUES
('1',  'الأصول',                        '0', 'رئيسي', 1, 'الميزانية العمومية', 'مدين',  1),
('2',  'الخصوم',                        '0', 'رئيسي', 1, 'الميزانية العمومية', 'دائن',  2),
('3',  'المصروفات',                     '0', 'رئيسي', 1, 'الأرباح والخسائر',   'مدين',  3),
('4',  'الإيرادات',                     '0', 'رئيسي', 1, 'الأرباح والخسائر',   'دائن',  4),

('11', 'الأصول الثابتة',                '1', 'رئيسي', 2, 'الميزانية العمومية', 'مدين',  10),
('12', 'الأصول المتداولة',              '1', 'رئيسي', 2, 'الميزانية العمومية', 'مدين',  11),
('21', 'رأس مال مدفوع',                 '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  20),
('22', 'احتياطيات',                     '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  21),
('23', 'إرباح (خسائر) مرحلة',           '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  22),
('24', 'المخصصات',                      '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  23),
('25', 'دائنون متنوعون',                '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  24),
('26', 'دائنون تجاريون',                '2', 'رئيسي', 2, 'الميزانية العمومية', 'دائن',  25),
('31', 'مصروفات النشاط التجاري',        '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  30),
('32', 'مصروفات المحل',                 '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  31),
('33', 'مصروفات ادارية وعمومية',        '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  32),
('34', 'مصروفات وتكاليف الذهب',         '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  33),
('35', 'أعباء و خسائر',                 '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  34),
('36', 'متعلقات سابقة',                 '3', 'رئيسي', 2, 'الأرباح والخسائر',   'مدين',  35),
('41', 'إيرادات النشاط التجاري',        '4', 'رئيسي', 2, 'الأرباح والخسائر',   'دائن',  40),
('42', 'ايرادات اخرى',                  '4', 'رئيسي', 2, 'الأرباح والخسائر',   'دائن',  41),
('43', 'ايرادات متنوعه',                '4', 'رئيسي', 2, 'الأرباح والخسائر',   'دائن',  42),

('111','الأراضي',                       '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  110),
('112','المباني',                       '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  111),
('113','آلات و معدات',                  '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  112),
('114','وسائل نقل و انتقال',            '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  113),
('115','عدد و أدوات',                   '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  114),
('116','أثاث وديكورات ومكيفات',         '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  115),
('117','الاجهزة والانظمة المالية',      '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  116),
('118','الاصول غير الملموسة',           '11','رئيسي', 3, 'الميزانية العمومية', 'مدين',  117),

('121','الصناديق',                      '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  120),
('122','البنوك',                        '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  121),
('123','العملاء',                       '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  122),
('124','أوراق قبض',                     '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  123),
('125','مصروفات مدفوعة مقدما',          '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  124),
('126','حسابات مدينة أخرى',             '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  125),
('127','المخزون',                       '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  126),
('128','حسابات تسكير الذهب',            '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  127),
('129','وسيط توريد و صرف',              '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  128),
('130','الحسابات الوسيطة',              '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  129),
('131','تجربه الحساب',                  '12','رئيسي', 3, 'الميزانية العمومية', 'مدين',  130),

('211','رأس المال',                     '21','رئيسي', 3, 'الميزانية العمومية', 'دائن',  210),
('212','رأس مال أرصدة بداية المدة',     '21','رئيسي', 3, 'الميزانية العمومية', 'دائن',  211),
('221','احتياطي قانوني',                '22','رئيسي', 3, 'الميزانية العمومية', 'دائن',  220),
('222','احتياطيات أخرى',                '22','رئيسي', 3, 'الميزانية العمومية', 'دائن',  221),
('231','ارباح (خسائر)',                 '23','رئيسي', 3, 'الميزانية العمومية', 'دائن',  230),
('241','مخصص إهلاك أصول ثابتة',         '24','رئيسي', 3, 'الميزانية العمومية', 'دائن',  240),
('242','مخصص هبوط أسعار أوراق مالية',   '24','رئيسي', 3, 'الميزانية العمومية', 'دائن',  241),
('243','مخصص فارق اوزان الذهب',         '24','رئيسي', 3, 'الميزانية العمومية', 'دائن',  242),
('251','تمويل اعتماد',                  '25','رئيسي', 3, 'الميزانية العمومية', 'دائن',  250),
('253','ذمم موظفين',                    '25','رئيسي', 3, 'الميزانية العمومية', 'دائن',  251),
('254','جاري الشركاء',                  '25','رئيسي', 3, 'الميزانية العمومية', 'دائن',  252),
('261','الموردين',                      '26','رئيسي', 3, 'الميزانية العمومية', 'دائن',  260),
('262','حسابات دائنة اخرى',             '26','رئيسي', 3, 'الميزانية العمومية', 'دائن',  261),

('311','تكاليف المبيعات',               '31','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  310),
('321','مصروفات ادارية',                '32','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  320),
('322','مصروفات اهلاك الاصول',          '32','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  321),
('323','مكافآت تشجيعية',                '32','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  322),
('324','الرواتب وتامينات الاجتماعيه',   '32','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  323),
('331','مصروفات عمومية',                '33','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  330),
('341','مصروف المشتريات',               '34','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  340),
('351','ديون معدومة',                   '35','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  350),
('352','أعباء و خسائر متنوعة',          '35','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  351),
('353','خسائر فروق العملة',             '35','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  352),
('3601','متعلقات سابقة2',               '36','رئيسي', 3, 'الأرباح والخسائر',   'مدين',  360),

('411','ايراد المبيعات',                '41','رئيسي', 3, 'الأرباح والخسائر',   'دائن',  410),
('412','خدمات مباعة',                   '41','رئيسي', 3, 'الأرباح والخسائر',   'دائن',  411);












CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` BIGINT UNSIGNED NOT NULL,

  -- ============ 1. الافتراضيات المرتبطة بـ ID ============
  `default_branch_id` BIGINT UNSIGNED NULL,
  `default_user_id` BIGINT UNSIGNED NULL,
  `default_store_id` BIGINT UNSIGNED NULL,
  `default_pure_store_id` BIGINT UNSIGNED NULL,
  `default_scrap_store_id` BIGINT UNSIGNED NULL,
  `default_worked_store_id` BIGINT UNSIGNED NULL,
  `default_item_id` BIGINT UNSIGNED NULL,
  `default_karat_id` BIGINT UNSIGNED NULL,
  `default_category_id` BIGINT UNSIGNED NULL,
  `default_safe_id` BIGINT UNSIGNED NULL,
  `default_bank_id` BIGINT UNSIGNED NULL,
  `default_customer_id` BIGINT UNSIGNED NULL,
  `default_supplier_id` BIGINT UNSIGNED NULL,
  `base_currency_id` BIGINT UNSIGNED NULL,
  `default_tax_id` BIGINT UNSIGNED NULL,
  `default_fiscal_year_id` BIGINT UNSIGNED NULL,
  `default_cost_center_id` BIGINT UNSIGNED NULL,

  -- ============ 2. الافتراضيات النصية والأنواع والأسماء ============
  `company_currency` VARCHAR(20) NOT NULL DEFAULT 'SAR',
  `default_gold_type` VARCHAR(100) NULL,
  `default_item_type` VARCHAR(100) NULL,
  `default_category_name` VARCHAR(150) NULL,
  `default_karat_name` VARCHAR(50) NULL,
  `default_store_name` VARCHAR(150) NULL,
  `default_item_name` VARCHAR(150) NULL,
  `gold_price_source` VARCHAR(50) NOT NULL DEFAULT 'manual',
  `invoice_prefix_sale` VARCHAR(30) NOT NULL DEFAULT 'INV',
  `invoice_prefix_purchase` VARCHAR(30) NOT NULL DEFAULT 'PUR',
  `voucher_prefix_receipt` VARCHAR(30) NOT NULL DEFAULT 'RCV',
  `voucher_prefix_payment` VARCHAR(30) NOT NULL DEFAULT 'PAY',
  `journal_prefix` VARCHAR(30) NOT NULL DEFAULT 'JV',

  -- ============ 3. الضرائب والحسابات والطباعة ============
  `tax_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `default_tax_rate` DECIMAL(8,4) NOT NULL DEFAULT 15.0000,
  `auto_assign_store_by_karat` TINYINT(1) NOT NULL DEFAULT 1,
  `allow_negative_stock` TINYINT(1) NOT NULL DEFAULT 0,
  `allow_negative_gold` TINYINT(1) NOT NULL DEFAULT 0,
  `print_show_tax` TINYINT(1) NOT NULL DEFAULT 1,
  `print_notes` TEXT NULL,

  -- ============ 4. إعدادات الإشعارات وتنبيهات الأجور ============
  `notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `wage_notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `wage_notify_after_days` INT NOT NULL DEFAULT 1,
  `wage_notify_after_hours` INT NOT NULL DEFAULT 0,
  `wage_notify_at_time` VARCHAR(20) NULL,
  `wage_notify_rule_text` VARCHAR(255) NULL,
  `wage_notify_message` TEXT NULL,
  `invoice_notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `voucher_notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,

  -- ============ 5. حقل نصي عام لأي إعدادات إضافية ============
  `custom_note` TEXT NULL,

  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `uq_company_settings_company` (`company_id`),
  KEY `idx_company_settings_branch` (`default_branch_id`),
  KEY `idx_company_settings_user` (`default_user_id`),
  KEY `idx_company_settings_store` (`default_store_id`),
  KEY `idx_company_settings_item` (`default_item_id`),
  KEY `idx_company_settings_karat` (`default_karat_id`),
  KEY `idx_company_settings_category` (`default_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE items ADD COLUMN gold_type VARCHAR(50) NULL AFTER item_type;


-- ============ 1. العيارات (company_id = 1) ============
INSERT INTO karats (company_id, branch_id, name, the_value, is_active, user_id, created_at, updated_at) VALUES
(1, 1, '24', 0.999000, 1, 1, NOW(), NOW()),
(1, 1, '22', 0.916000, 1, 1, NOW(), NOW()),
(1, 1, '21', 0.875000, 1, 1, NOW(), NOW()),
(1, 1, '18', 0.750000, 1, 1, NOW(), NOW()),
(1, 1, '14', 0.585000, 1, 1, NOW(), NOW());

-- ============ 2. مجموعات الأصناف الرئيسية ============
INSERT INTO item_categories (company_id, parent_id, name, name_en, is_active, user_id, created_at, updated_at) VALUES
(1, NULL, 'الذهب',  'Gold',    1, 1, NOW(), NOW()),
(1, NULL, 'الفضة',  'Silver',  1, 1, NOW(), NOW()),
(1, NULL, 'الماس',  'Diamond', 1, 1, NOW(), NOW());

-- ============ 3. مجموعات فرعية تحت الذهب ============
SET @gold_id = (SELECT id FROM item_categories WHERE company_id = 1 AND name = 'الذهب' LIMIT 1);

INSERT INTO item_categories (company_id, parent_id, name, name_en, is_active, user_id, created_at, updated_at) VALUES
(1, @gold_id, 'كسر مصاغ', 'Scrap Gold',  1, 1, NOW(), NOW()),
(1, @gold_id, 'مصاغ',     'Worked Gold', 1, 1, NOW(), NOW()),
(1, @gold_id, 'ذهب صافي', 'Pure Gold',   1, 1, NOW(), NOW());




SET @karat_id_24   = (SELECT id FROM karats WHERE company_id = 1 AND name = '24' LIMIT 1);
SET @category_gold = (SELECT id FROM item_categories WHERE company_id = 1 AND name = 'الذهب' AND parent_id IS NULL LIMIT 1);

INSERT INTO items (
    company_id, branch_id, category_id, store_id,
    code, name, name_en, description,
    item_type, gold_type, karat_id, unit,
    weight, purity,
    cost_price, purchase_price, sale_price, min_sale_price, wholesale_price,
    tax_rate, currency_id, exchange_rate,
    min_qty, max_qty, reorder_qty, current_qty, opening_qty, opening_weight,
    is_active, is_sellable, is_purchasable, is_trackable, is_featured,
    sort_order, user_id, created_at, updated_at
) VALUES (
    1, 1, @category_gold, NULL,
    'GOLD-001', 'ذهب', 'Gold', 'ذهب صافي',
    'pure', 'pure', @karat_id_24, 'جرام',
    0, 1.000000,
    0, 0, 0, 0, 0,
    15.0000, NULL, 1.000000,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 0,
    0, 1, NOW(), NOW()
);



CREATE TABLE contacts (
    id                  BIGINT        NOT NULL AUTO_INCREMENT,
    company_id          BIGINT        NOT NULL,
    branch_id           BIGINT        NULL,
    name                VARCHAR(200)  NOT NULL,
    name_en             VARCHAR(200)  NULL,
    contact_type        VARCHAR(20)   NOT NULL,
    acc_no              VARCHAR(50)   NULL,
    phone               VARCHAR(30)   NULL,
    mobile              VARCHAR(30)   NULL,
    whatsapp            VARCHAR(30)   NULL,
    email               VARCHAR(150)  NULL,
    website             VARCHAR(150)  NULL,
    tax_number          VARCHAR(50)   NULL,
    commercial_register VARCHAR(50)   NULL,
    national_id         VARCHAR(30)   NULL,
    address             VARCHAR(400)  NULL,
    city                VARCHAR(100)  NULL,
    district            VARCHAR(100)  NULL,
    street              VARCHAR(200)  NULL,
    building_no         VARCHAR(20)   NULL,
    postal_code         VARCHAR(20)   NULL,
    extra_no            VARCHAR(20)   NULL,
    country             VARCHAR(100)  NULL DEFAULT 'السعودية',
    credit_limit        DECIMAL(18,2) NOT NULL DEFAULT 0,
    opening_balance     DECIMAL(18,2) NOT NULL DEFAULT 0,
    balance             DECIMAL(18,2) NOT NULL DEFAULT 0,
    notes               VARCHAR(1000) NULL,
    is_active           TINYINT(1)    NOT NULL DEFAULT 1,
    user_id             BIGINT        NULL,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_contacts_company_name (company_id, name),
    KEY idx_contacts_accno (company_id, acc_no),
    KEY idx_contacts_type (company_id, contact_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


















CREATE TABLE karats (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    company_id BIGINT       NOT NULL,
    branch_id  BIGINT       NULL,
    name       VARCHAR(50)  NOT NULL,
    the_value  DECIMAL(9,6) NOT NULL,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    user_id    BIGINT       NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_karats_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE items (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NULL,

    -- التصنيف والربط
    category_id           BIGINT        NULL,
    store_id          BIGINT        NULL,

    -- التعريف الأساسي
    code                  VARCHAR(50)   NULL,
    name                  VARCHAR(200)  NOT NULL,
    name_en               VARCHAR(200)  NULL,
    description           VARCHAR(1000) NULL,
    item_type             VARCHAR(30)   NULL,      -- gold / jewelry / bullion / scrap / other
    barcode               VARCHAR(50)   NULL,

    -- العيار والوحدة
    karat_id              BIGINT        NULL,
    unit                  VARCHAR(20)   NULL DEFAULT 'gram',
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    purity                DECIMAL(9,6)  NOT NULL DEFAULT 0,
    stone_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    stone_type            VARCHAR(50)   NULL,

    -- الأسعار والتكاليف
    cost_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    purchase_price        DECIMAL(18,4) NOT NULL DEFAULT 0,
    sale_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    min_sale_price        DECIMAL(18,4) NOT NULL DEFAULT 0,
    wholesale_price       DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge_type    VARCHAR(20)   NULL DEFAULT 'fixed', -- fixed / percent / per_gram
    profit_margin         DECIMAL(9,4)  NOT NULL DEFAULT 0,

    -- الضريبة
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    is_taxable            TINYINT(1)    NOT NULL DEFAULT 1,

    -- العملة
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- المخزون
    min_qty               DECIMAL(18,3) NOT NULL DEFAULT 0,
    max_qty               DECIMAL(18,3) NOT NULL DEFAULT 0,
    reorder_qty           DECIMAL(18,3) NOT NULL DEFAULT 0,
    current_qty           DECIMAL(18,3) NOT NULL DEFAULT 0,
    opening_qty           DECIMAL(18,3) NOT NULL DEFAULT 0,
    opening_weight        DECIMAL(18,3) NOT NULL DEFAULT 0,

    -- الصور والملفات
    image_path            VARCHAR(300)  NULL,
    gallery_path          VARCHAR(1000) NULL,

    -- إعدادات
    is_active             TINYINT(1)    NOT NULL DEFAULT 1,
    is_sellable           TINYINT(1)    NOT NULL DEFAULT 1,
    is_purchasable        TINYINT(1)    NOT NULL DEFAULT 1,
    is_trackable          TINYINT(1)    NOT NULL DEFAULT 1,
    is_featured           TINYINT(1)    NOT NULL DEFAULT 0,
    sort_order            INT           NOT NULL DEFAULT 0,

    -- ملاحظات وتتبع
    notes                 VARCHAR(1000) NULL,
    tags                  VARCHAR(300)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_items_company_name (company_id, name),
    KEY idx_items_company_code (company_id, code),
    KEY idx_items_barcode (barcode),
    KEY idx_items_category (company_id, category_id),
    KEY idx_items_warehouse (company_id, store_id),
    KEY idx_items_karat (company_id, karat_id),
    KEY idx_items_tax (company_id, tax_id),
    KEY idx_items_currency (company_id, currency_id),
    KEY idx_items_active (company_id, is_active),
    KEY idx_items_type (company_id, item_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE safes (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    company_id   BIGINT        NOT NULL,
    branch_id    BIGINT        NULL,
    name         VARCHAR(150)  NOT NULL,
    code         VARCHAR(30)   NULL,
    acc_no       VARCHAR(50)   NULL,
    opening_cash DECIMAL(18,2) NOT NULL DEFAULT 0,
    current_cash DECIMAL(18,2) NOT NULL DEFAULT 0,
    opening_gold DECIMAL(18,3) NOT NULL DEFAULT 0,
    current_gold DECIMAL(18,3) NOT NULL DEFAULT 0,
    currency     VARCHAR(10)   NOT NULL DEFAULT 'SAR',
    is_active    TINYINT(1)    NOT NULL DEFAULT 1,
    notes        VARCHAR(500)  NULL,
    user_id      BIGINT        NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_safes_company_branch (company_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



















CREATE TABLE banks (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    company_id      BIGINT        NOT NULL,
    branch_id       BIGINT        NULL,
    name            VARCHAR(150)  NOT NULL,
    code            VARCHAR(30)   NULL,
    acc_no          VARCHAR(50)   NULL,
    bank_name       VARCHAR(200)  NULL,
    account_number  VARCHAR(50)   NULL,
    iban            VARCHAR(50)   NULL,
    swift           VARCHAR(30)   NULL,
    branch_name     VARCHAR(200)  NULL,
    opening_balance DECIMAL(18,2) NOT NULL DEFAULT 0,
    current_balance DECIMAL(18,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(10)   NOT NULL DEFAULT 'SAR',
    is_active       TINYINT(1)    NOT NULL DEFAULT 1,
    notes           VARCHAR(500)  NULL,
    user_id         BIGINT        NULL,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_banks_company_branch (company_id, branch_id),
    KEY idx_banks_iban (iban)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




















CREATE TABLE document_sequences (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    company_id       BIGINT      NOT NULL,
    branch_id        BIGINT      NOT NULL,
    document_type_id BIGINT      NOT NULL,
    next_number      BIGINT      NOT NULL DEFAULT 1,
    padding          INT         NOT NULL DEFAULT 0,
    prefix           VARCHAR(20) NULL,
    created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME    NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_seq_company_branch_type (company_id, branch_id, document_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE sales_closing (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NOT NULL,
    doc_no           BIGINT        NOT NULL,
    doc_date         DATE          NOT NULL,
    contact_id       BIGINT        NOT NULL,
    net_weight       DECIMAL(18,3) NOT NULL DEFAULT 0,
    jewelry_weight   DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id         BIGINT        NOT NULL,
    gram_price       DECIMAL(18,4) NOT NULL DEFAULT 0,
    net_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    jewelry_amount   DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type VARCHAR(20)   NOT NULL DEFAULT 'both',
    notes            VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_closing_doc (company_id, branch_id, doc_no),
    KEY idx_sales_closing_date (company_id, branch_id, doc_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE purchase_closing (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NOT NULL,
    doc_no           BIGINT        NOT NULL,
    doc_date         DATE          NOT NULL,
    contact_id       BIGINT        NOT NULL,
    net_weight       DECIMAL(18,3) NOT NULL DEFAULT 0,
    jewelry_weight   DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id         BIGINT        NOT NULL,
    gram_price       DECIMAL(18,4) NOT NULL DEFAULT 0,
    net_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    jewelry_amount   DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type VARCHAR(20)   NOT NULL DEFAULT 'both',
    notes            VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_closing_doc (company_id, branch_id, doc_no),
    KEY idx_purchase_closing_date (company_id, branch_id, doc_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












CREATE TABLE sales_invoices (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,

    -- الخزينة/الدفع
    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    -- العملة
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- الضريبة والخصم
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- الإجماليات
    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_making          DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    paid_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    remaining_amount      DECIMAL(18,2) NOT NULL DEFAULT 0,

    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_inv_doc (company_id, branch_id, doc_no),
    KEY idx_sales_inv_date (company_id, branch_id, doc_date),
    KEY idx_sales_inv_contact (company_id, contact_id),
    KEY idx_sales_inv_safe (safe_id),
    KEY idx_sales_inv_bank (bank_id),
    KEY idx_sales_inv_currency (currency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE sales_invoice_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    invoice_id            BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    -- الضريبة والخصم لكل سطر
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    -- العملة
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_inv_det_invoice (company_id, invoice_id),
    KEY idx_sales_inv_det_item (company_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE purchase_invoices (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,

    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_making          DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    paid_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    remaining_amount      DECIMAL(18,2) NOT NULL DEFAULT 0,

    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_inv_doc (company_id, branch_id, doc_no),
    KEY idx_purchase_inv_date (company_id, branch_id, doc_date),
    KEY idx_purchase_inv_contact (company_id, contact_id),
    KEY idx_purchase_inv_safe (safe_id),
    KEY idx_purchase_inv_bank (bank_id),
    KEY idx_purchase_inv_currency (currency_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE purchase_invoice_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    invoice_id            BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_inv_det_invoice (company_id, invoice_id),
    KEY idx_purchase_inv_det_item (company_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE sales_returns (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,
    invoice_id            BIGINT        NULL,

    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_ret_doc (company_id, branch_id, doc_no),
    KEY idx_sales_ret_date (company_id, branch_id, doc_date),
    KEY idx_sales_ret_invoice (company_id, invoice_id),
    KEY idx_sales_ret_safe (safe_id),
    KEY idx_sales_ret_bank (bank_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






CREATE TABLE sales_return_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    return_id             BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_ret_det_return (company_id, return_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;







CREATE TABLE purchase_returns (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,
    invoice_id            BIGINT        NULL,

    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_ret_doc (company_id, branch_id, doc_no),
    KEY idx_purchase_ret_date (company_id, branch_id, doc_date),
    KEY idx_purchase_ret_invoice (company_id, invoice_id),
    KEY idx_purchase_ret_safe (safe_id),
    KEY idx_purchase_ret_bank (bank_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE purchase_return_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    return_id             BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_ret_det_return (company_id, return_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE sales_wages (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,

    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_wages_doc (company_id, branch_id, doc_no),
    KEY idx_sales_wages_date (company_id, branch_id, doc_date),
    KEY idx_sales_wages_safe (safe_id),
    KEY idx_sales_wages_bank (bank_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;








CREATE TABLE sales_wage_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    wage_id               BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_sales_wage_det_wage (company_id, wage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






CREATE TABLE purchase_wages (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,

    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_weight          DECIMAL(18,3) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    notes                 VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_wages_doc (company_id, branch_id, doc_no),
    KEY idx_purchase_wages_date (company_id, branch_id, doc_date),
    KEY idx_purchase_wages_safe (safe_id),
    KEY idx_purchase_wages_bank (bank_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;







CREATE TABLE purchase_wage_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    wage_id               BIGINT        NOT NULL,
    item_id               BIGINT        NULL,
    karat_id              BIGINT        NULL,
    description           VARCHAR(300)  NULL,
    weight                DECIMAL(18,3) NOT NULL DEFAULT 0,
    making_charge         DECIMAL(18,4) NOT NULL DEFAULT 0,
    quantity              DECIMAL(18,3) NOT NULL DEFAULT 1,

    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,

    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,

    net_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_purchase_wage_det_wage (company_id, wage_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- OPENING_BALANCE





CREATE TABLE receipt_vouchers (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,
    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    cash_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    gold_weight           DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id              BIGINT        NULL,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    gold_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    reference_no          VARCHAR(100)  NULL,
    description           VARCHAR(500)  NULL,
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_receipt_v_doc (company_id, branch_id, doc_no),
    KEY idx_receipt_v_date (company_id, branch_id, doc_date),
    KEY idx_receipt_v_contact (company_id, contact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;








CREATE TABLE payment_vouchers (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    contact_id            BIGINT        NULL,
    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'cash',
    cash_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    gold_weight           DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id              BIGINT        NULL,
    gram_price            DECIMAL(18,4) NOT NULL DEFAULT 0,
    gold_amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    reference_no          VARCHAR(100)  NULL,
    description           VARCHAR(500)  NULL,
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_payment_v_doc (company_id, branch_id, doc_no),
    KEY idx_payment_v_date (company_id, branch_id, doc_date),
    KEY idx_payment_v_contact (company_id, contact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
















CREATE TABLE journal_entries (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    journal_date          DATE          NOT NULL,
    document_type_id      BIGINT        NOT NULL,
    document_id           BIGINT        NOT NULL,
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    transaction_type      VARCHAR(20)   NOT NULL DEFAULT 'both',
    description           VARCHAR(500)  NULL,
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_journal_doc (company_id, branch_id, doc_no),
    KEY idx_journal_date (company_id, branch_id, journal_date),
    KEY idx_journal_source (company_id, branch_id, document_type_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE journal_entry_details (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    journal_id            BIGINT        NOT NULL,
    account_id            BIGINT        NOT NULL,
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    debit_amount          DECIMAL(18,2) NOT NULL DEFAULT 0,
    credit_amount         DECIMAL(18,2) NOT NULL DEFAULT 0,
    gold_debit            DECIMAL(18,3) NOT NULL DEFAULT 0,
    gold_credit           DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id              BIGINT        NULL,
    description           VARCHAR(500)  NULL,
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_jed_journal (company_id, journal_id),
    KEY idx_jed_account (company_id, account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




CREATE TABLE taxes (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NOT NULL,
    name        VARCHAR(100)  NOT NULL,
    rate        DECIMAL(9,4)  NOT NULL DEFAULT 0,
    is_default  TINYINT(1)    NOT NULL DEFAULT 0,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    user_id     BIGINT        NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_taxes_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;








CREATE TABLE currencies (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NULL,
    code        VARCHAR(10)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    symbol      VARCHAR(10)  NULL,
    is_base     TINYINT(1)   NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_currencies_code (code),
    KEY idx_currencies_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;







CREATE TABLE exchange_rates (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NULL,
    currency_id BIGINT        NOT NULL,
    rate_date   DATE          NOT NULL,
    rate        DECIMAL(18,6) NOT NULL DEFAULT 1,
    user_id     BIGINT        NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_rates_currency_date (currency_id, rate_date),
    KEY idx_rates_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE item_categories (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    name        VARCHAR(150) NOT NULL,
    name_en     VARCHAR(150) NULL,
    parent_id   BIGINT       NULL,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_item_cat_company (company_id),
    KEY idx_item_cat_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;











CREATE TABLE store (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    branch_id   BIGINT       NULL,
    name        VARCHAR(150) NOT NULL,
    code        VARCHAR(30)  NULL,
    address     VARCHAR(400) NULL,
    manager_id  BIGINT       NULL,
    is_main     TINYINT(1)   NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    notes       VARCHAR(500) NULL,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_warehouses_company_branch (company_id, branch_id),
    KEY idx_warehouses_code (company_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE warehouse_stock (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    company_id   BIGINT        NOT NULL,
    branch_id    BIGINT        NULL,
    warehouse_id BIGINT        NOT NULL,
    item_id      BIGINT        NOT NULL,
    karat_id     BIGINT        NULL,
    quantity     DECIMAL(18,3) NOT NULL DEFAULT 0,
    weight       DECIMAL(18,3) NOT NULL DEFAULT 0,
    avg_cost     DECIMAL(18,4) NOT NULL DEFAULT 0,
    last_update  DATETIME      NULL,
    user_id      BIGINT        NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_stock_wh_item (company_id, warehouse_id, item_id),
    KEY idx_stock_branch (company_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE stock_movements (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NOT NULL,
    warehouse_id     BIGINT        NOT NULL,
    item_id          BIGINT        NOT NULL,
    karat_id         BIGINT        NULL,
    movement_type    VARCHAR(20)   NOT NULL,   -- in / out / transfer
    movement_date    DATE          NOT NULL,
    document_type_id BIGINT        NULL,
    document_id      BIGINT        NULL,
    quantity         DECIMAL(18,3) NOT NULL DEFAULT 0,
    weight           DECIMAL(18,3) NOT NULL DEFAULT 0,
    unit_cost        DECIMAL(18,4) NOT NULL DEFAULT 0,
    total_cost       DECIMAL(18,2) NOT NULL DEFAULT 0,
    description      VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_mov_wh_item (company_id, warehouse_id, item_id),
    KEY idx_mov_date (company_id, branch_id, movement_date),
    KEY idx_mov_doc (company_id, document_type_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












CREATE TABLE expense_categories (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    name        VARCHAR(150) NOT NULL,
    acc_no      VARCHAR(50)  NULL,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_exp_cat_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE expenses (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    company_id            BIGINT        NOT NULL,
    branch_id             BIGINT        NOT NULL,
    doc_no                BIGINT        NOT NULL,
    doc_date              DATE          NOT NULL,
    category_id           BIGINT        NULL,
    account_id            BIGINT        NULL,
    safe_id               BIGINT        NULL,
    bank_id               BIGINT        NULL,
    payment_method        VARCHAR(30)   NULL,
    currency_id           BIGINT        NULL,
    exchange_rate         DECIMAL(18,6) NOT NULL DEFAULT 1,
    price_with_exchange   DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_id                BIGINT        NULL,
    tax_rate              DECIMAL(9,4)  NOT NULL DEFAULT 0,
    price_before_tax      DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount            DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount       DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_after_discount  DECIMAL(18,2) NOT NULL DEFAULT 0,
    price_with_tax        DECIMAL(18,2) NOT NULL DEFAULT 0,
    reference_no          VARCHAR(100)  NULL,
    description           VARCHAR(500)  NULL,
    status                VARCHAR(20)   NOT NULL DEFAULT 'draft',
    user_id               BIGINT        NULL,
    created_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_expenses_doc (company_id, branch_id, doc_no),
    KEY idx_expenses_date (company_id, branch_id, doc_date),
    KEY idx_expenses_cat (company_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE cash_transactions (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NOT NULL,
    safe_id          BIGINT        NOT NULL,
    trans_date       DATE          NOT NULL,
    trans_type       VARCHAR(20)   NOT NULL,   -- in / out
    amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    currency_id      BIGINT        NULL,
    exchange_rate    DECIMAL(18,6) NOT NULL DEFAULT 1,
    document_type_id BIGINT        NULL,
    document_id      BIGINT        NULL,
    description      VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_cash_safe (company_id, safe_id, trans_date),
    KEY idx_cash_doc (company_id, document_type_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE bank_transactions (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NOT NULL,
    bank_id          BIGINT        NOT NULL,
    trans_date       DATE          NOT NULL,
    trans_type       VARCHAR(20)   NOT NULL,   -- in / out
    amount           DECIMAL(18,2) NOT NULL DEFAULT 0,
    currency_id      BIGINT        NULL,
    exchange_rate    DECIMAL(18,6) NOT NULL DEFAULT 1,
    reference_no     VARCHAR(100)  NULL,
    document_type_id BIGINT        NULL,
    document_id      BIGINT        NULL,
    description      VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_bank_trans (company_id, bank_id, trans_date),
    KEY idx_bank_doc (company_id, document_type_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;















CREATE TABLE opening_balances (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    company_id       BIGINT        NOT NULL,
    branch_id        BIGINT        NULL,
    fiscal_year_id   BIGINT        NULL,
    balance_type     VARCHAR(30)   NOT NULL,   -- account / contact / safe / bank / stock
    reference_id     BIGINT        NULL,
    debit_amount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    credit_amount    DECIMAL(18,2) NOT NULL DEFAULT 0,
    gold_debit       DECIMAL(18,3) NOT NULL DEFAULT 0,
    gold_credit      DECIMAL(18,3) NOT NULL DEFAULT 0,
    karat_id         BIGINT        NULL,
    currency_id      BIGINT        NULL,
    exchange_rate    DECIMAL(18,6) NOT NULL DEFAULT 1,
    notes            VARCHAR(500)  NULL,
    user_id          BIGINT        NULL,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_open_company (company_id),
    KEY idx_open_type_ref (balance_type, reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




















CREATE TABLE fiscal_years (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    name        VARCHAR(100) NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    is_closed   TINYINT(1)   NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_fy_company (company_id),
    KEY idx_fy_dates (company_id, start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
















CREATE TABLE account_mappings (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    mapping_key VARCHAR(50)  NOT NULL,   -- sales_account, purchase_account, tax_account, cash_account, ...
    acc_no      VARCHAR(50)  NOT NULL,
    description VARCHAR(300) NULL,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_mapping_company_key (company_id, mapping_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;














CREATE TABLE roles (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NULL,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(300) NULL,
    is_system   TINYINT(1)   NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,
    user_id     BIGINT       NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_roles_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










CREATE TABLE permissions (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    company_id BIGINT       NULL,
    code       VARCHAR(100) NOT NULL,
    name       VARCHAR(150) NOT NULL,
    module     VARCHAR(50)  NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_perm_code (code),
    KEY idx_perm_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;















CREATE TABLE role_permissions (
    id            BIGINT   NOT NULL AUTO_INCREMENT,
    company_id    BIGINT   NOT NULL,
    role_id       BIGINT   NOT NULL,
    permission_id BIGINT   NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_rp_role (company_id, role_id),
    KEY idx_rp_perm (company_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;













CREATE TABLE user_roles (
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    company_id BIGINT   NOT NULL,
    user_id    BIGINT   NOT NULL,
    role_id    BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_ur_user (company_id, user_id),
    KEY idx_ur_role (company_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












CREATE TABLE user_branches (
    id         BIGINT   NOT NULL AUTO_INCREMENT,
    company_id BIGINT   NOT NULL,
    user_id    BIGINT   NOT NULL,
    branch_id  BIGINT   NOT NULL,
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_ub_user (company_id, user_id),
    KEY idx_ub_branch (company_id, branch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












CREATE TABLE audit_logs (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NULL,
    branch_id   BIGINT        NULL,
    user_id     BIGINT        NULL,
    action      VARCHAR(50)   NULL,
    table_name  VARCHAR(100)  NULL,
    record_id   BIGINT        NULL,
    old_values  JSON          NULL,
    new_values  JSON          NULL,
    ip_address  VARCHAR(45)   NULL,
    user_agent  VARCHAR(300)  NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_audit_company (company_id),
    KEY idx_audit_user (user_id),
    KEY idx_audit_table (table_name, record_id),
    KEY idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;













CREATE TABLE attachments (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    company_id       BIGINT       NOT NULL,
    branch_id        BIGINT       NULL,
    document_type_id BIGINT       NULL,
    document_id      BIGINT       NULL,
    file_name        VARCHAR(300) NOT NULL,
    file_path        VARCHAR(500) NOT NULL,
    file_type        VARCHAR(50)  NULL,
    file_size        BIGINT       NULL,
    notes            VARCHAR(500) NULL,
    user_id          BIGINT       NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_attachments_doc (company_id, document_type_id, document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;









CREATE TABLE notifications (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    company_id  BIGINT       NOT NULL,
    branch_id   BIGINT       NULL,
    user_id     BIGINT       NULL,
    title       VARCHAR(200) NULL,
    message     VARCHAR(1000) NULL,
    type        VARCHAR(50)  NULL,
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    read_at     DATETIME     NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_notif_user (company_id, user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;













CREATE TABLE settings (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NULL,
    branch_id   BIGINT        NULL,
    key_name    VARCHAR(100)  NOT NULL,
    value       TEXT          NULL,
    value_type  VARCHAR(20)   NULL,   -- string / int / decimal / bool / json
    description VARCHAR(300)  NULL,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_settings_key (company_id, branch_id, key_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;












CREATE TABLE gold_prices (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NOT NULL,
    branch_id   BIGINT        NULL,
    karat_id    BIGINT        NOT NULL,
    price_date  DATE          NOT NULL,
    buy_price   DECIMAL(18,4) NOT NULL DEFAULT 0,
    sell_price  DECIMAL(18,4) NOT NULL DEFAULT 0,
    market_price DECIMAL(18,4) NOT NULL DEFAULT 0,
    currency_id BIGINT        NULL,
    notes       VARCHAR(300)  NULL,
    user_id     BIGINT        NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_gold_price_date (company_id, karat_id, price_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
















CREATE TABLE gold_rate_history (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NOT NULL,
    karat_id    BIGINT        NOT NULL,
    old_price   DECIMAL(18,4) NOT NULL DEFAULT 0,
    new_price   DECIMAL(18,4) NOT NULL DEFAULT 0,
    change_type VARCHAR(20)   NULL,   -- buy / sell / market
    changed_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id     BIGINT        NULL,
    PRIMARY KEY (id),
    KEY idx_rate_hist (company_id, karat_id, changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

















CREATE TABLE making_charges (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    company_id  BIGINT        NOT NULL,
    name        VARCHAR(150)  NOT NULL,
    charge_type VARCHAR(20)   NOT NULL DEFAULT 'fixed',   -- fixed / percent / per_gram
    value       DECIMAL(18,4) NOT NULL DEFAULT 0,
    karat_id    BIGINT        NULL,
    item_id     BIGINT        NULL,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    user_id     BIGINT        NULL,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_mc_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
















CREATE TABLE gold_fixings (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    company_id   BIGINT        NOT NULL,
    fixing_date  DATE          NOT NULL,
    karat_id     BIGINT        NULL,
    price        DECIMAL(18,4) NOT NULL DEFAULT 0,
    currency_id  BIGINT        NULL,
    source       VARCHAR(100)  NULL,
    notes        VARCHAR(300)  NULL,
    user_id      BIGINT        NULL,
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_fixing_date (company_id, fixing_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;























CREATE TABLE cost_centers (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    company_id    BIGINT        NOT NULL,
    branch_id     BIGINT        NULL,
    parent_id     BIGINT        NULL,              -- مركز أب (هرمي)
    code          VARCHAR(50)   NOT NULL,          -- رمز مركز التكلفة
    name          VARCHAR(200)  NOT NULL,          -- اسم مركز التكلفة
    name_en       VARCHAR(200)  NULL,
    center_type   VARCHAR(30)   NULL DEFAULT 'general', -- general / department / project / branch / activity
    account_id    BIGINT        NULL,              -- ربط بحساب محاسبي (اختياري)
    manager_id    BIGINT        NULL,              -- مدير مركز التكلفة
    budget_amount DECIMAL(18,2) NOT NULL DEFAULT 0, -- الموازنة التقديرية
    opening_balance DECIMAL(18,2) NOT NULL DEFAULT 0, -- رصيد افتتاحي
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    notes         VARCHAR(1000) NULL,
    user_id       BIGINT        NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_cc_company (company_id),
    KEY idx_cc_branch (company_id, branch_id),
    KEY idx_cc_code (company_id, code),
    KEY idx_cc_parent (parent_id),
    KEY idx_cc_type (company_id, center_type),
    KEY idx_cc_account (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




ALTER TABLE journal_entry_details
    ADD COLUMN cost_center_id BIGINT NULL AFTER account_id,
    ADD KEY idx_jed_cost_center (company_id, cost_center_id);




    ALTER TABLE sales_invoices          ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE purchase_invoices       ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE sales_returns           ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE purchase_returns        ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE sales_wages             ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE purchase_wages          ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE receipt_vouchers        ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE payment_vouchers        ADD COLUMN cost_center_id BIGINT NULL AFTER contact_id;
ALTER TABLE expenses                ADD COLUMN cost_center_id BIGINT NULL AFTER category_id;







DELETE FROM permissions;




INSERT INTO permissions (code, name, module) VALUES

-- ============ النظام والشركات ============
('companies.view', 'عرض الشركات', 'companies'),
('companies.create', 'إضافة شركة', 'companies'),
('companies.edit', 'تعديل شركة', 'companies'),
('companies.delete', 'حذف شركة', 'companies'),

('branches.view', 'عرض الفروع', 'branches'),
('branches.create', 'إضافة فرع', 'branches'),
('branches.edit', 'تعديل فرع', 'branches'),
('branches.delete', 'حذف فرع', 'branches'),

('users.view', 'عرض المستخدمين', 'users'),
('users.create', 'إضافة مستخدم', 'users'),
('users.edit', 'تعديل مستخدم', 'users'),
('users.delete', 'حذف مستخدم', 'users'),
('users.toggle', 'تفعيل/تعطيل مستخدم', 'users'),
('users.password', 'تغيير كلمة مرور', 'users'),

('roles.view', 'عرض الأدوار', 'roles'),
('roles.create', 'إضافة دور', 'roles'),
('roles.edit', 'تعديل دور', 'roles'),
('roles.delete', 'حذف دور', 'roles'),

('settings.manage', 'إدارة الإعدادات', 'settings'),
('company_info.manage', 'إدارة بيانات الشركة', 'company_info'),

('document_types.view', 'عرض أنواع المستندات', 'document_types'),
('document_types.create', 'إضافة نوع مستند', 'document_types'),
('document_types.edit', 'تعديل نوع مستند', 'document_types'),

-- ============ المحاسبة ============
('accounts.view', 'عرض الحسابات', 'accounts'),
('accounts.create', 'إضافة حساب', 'accounts'),
('accounts.edit', 'تعديل حساب', 'accounts'),
('accounts.delete', 'حذف حساب', 'accounts'),

('journal.view', 'عرض القيود', 'journal'),
('journal.create', 'إضافة قيد', 'journal'),
('journal.edit', 'تعديل قيد', 'journal'),
('journal.delete', 'حذف قيد', 'journal'),
('journal.post', 'ترحيل قيد', 'journal'),
('journal.reverse', 'عكس قيد', 'journal'),

('cost_centers.view', 'عرض مراكز التكلفة', 'cost_centers'),
('cost_centers.create', 'إضافة مركز تكلفة', 'cost_centers'),
('cost_centers.edit', 'تعديل مركز تكلفة', 'cost_centers'),
('cost_centers.delete', 'حذف مركز تكلفة', 'cost_centers'),

-- ============ البيانات الأساسية ============
('contacts.view', 'عرض العملاء', 'contacts'),
('contacts.create', 'إضافة عميل', 'contacts'),
('contacts.edit', 'تعديل عميل', 'contacts'),
('contacts.delete', 'حذف عميل', 'contacts'),

('items.view', 'عرض الأصناف', 'items'),
('items.create', 'إضافة صنف', 'items'),
('items.edit', 'تعديل صنف', 'items'),
('items.delete', 'حذف صنف', 'items'),

('item_categories.view', 'عرض مجموعات الأصناف', 'item_categories'),
('item_categories.create', 'إضافة مجموعة', 'item_categories'),
('item_categories.edit', 'تعديل مجموعة', 'item_categories'),
('item_categories.delete', 'حذف مجموعة', 'item_categories'),

('karats.view', 'عرض العيارات', 'karats'),
('karats.create', 'إضافة عيار', 'karats'),
('karats.edit', 'تعديل عيار', 'karats'),
('karats.delete', 'حذف عيار', 'karats'),

('taxes.view', 'عرض الضرائب', 'taxes'),
('taxes.create', 'إضافة ضريبة', 'taxes'),
('taxes.edit', 'تعديل ضريبة', 'taxes'),
('taxes.delete', 'حذف ضريبة', 'taxes'),

('currencies.view', 'عرض العملات', 'currencies'),
('currencies.create', 'إضافة عملة', 'currencies'),
('currencies.edit', 'تعديل عملة', 'currencies'),
('currencies.delete', 'حذف عملة', 'currencies'),

('exchange_rates.view', 'عرض أسعار الصرف', 'exchange_rates'),
('exchange_rates.create', 'إضافة سعر صرف', 'exchange_rates'),
('exchange_rates.edit', 'تعديل سعر صرف', 'exchange_rates'),
('exchange_rates.delete', 'حذف سعر صرف', 'exchange_rates'),

('stores.view', 'عرض المخازن', 'stores'),
('stores.create', 'إضافة مخزن', 'stores'),
('stores.edit', 'تعديل مخزن', 'stores'),
('stores.delete', 'حذف مخزن', 'stores'),

('warehouse_stock.view', 'عرض أرصدة المخزون', 'warehouse_stock'),
('warehouse_stock.create', 'إضافة رصيد مخزون', 'warehouse_stock'),
('warehouse_stock.edit', 'تعديل رصيد مخزون', 'warehouse_stock'),
('warehouse_stock.delete', 'حذف رصيد مخزون', 'warehouse_stock'),

('stock_movements.view', 'عرض حركات المخزون', 'stock_movements'),
('stock_movements.create', 'إضافة حركة مخزون', 'stock_movements'),
('stock_movements.edit', 'تعديل حركة مخزون', 'stock_movements'),
('stock_movements.delete', 'حذف حركة مخزون', 'stock_movements'),

('safes.view', 'عرض الصناديق', 'safes'),
('safes.create', 'إضافة صندوق', 'safes'),
('safes.edit', 'تعديل صندوق', 'safes'),
('safes.delete', 'حذف صندوق', 'safes'),

('banks.view', 'عرض البنوك', 'banks'),
('banks.create', 'إضافة بنك', 'banks'),
('banks.edit', 'تعديل بنك', 'banks'),
('banks.delete', 'حذف بنك', 'banks'),

('expenses.view', 'عرض المصروفات', 'expenses'),
('expenses.create', 'إضافة مصروف', 'expenses'),
('expenses.edit', 'تعديل مصروف', 'expenses'),
('expenses.delete', 'حذف مصروف', 'expenses'),

('expense_categories.view', 'عرض تصنيفات المصروفات', 'expense_categories'),
('expense_categories.create', 'إضافة تصنيف مصروف', 'expense_categories'),
('expense_categories.edit', 'تعديل تصنيف مصروف', 'expense_categories'),
('expense_categories.delete', 'حذف تصنيف مصروف', 'expense_categories'),

('gold_prices.view', 'عرض أسعار الذهب', 'gold_prices'),
('gold_prices.create', 'إضافة سعر ذهب', 'gold_prices'),
('gold_prices.edit', 'تعديل سعر ذهب', 'gold_prices'),
('gold_prices.delete', 'حذف سعر ذهب', 'gold_prices'),

-- ============ المبيعات ============
('sales_net.view', 'عرض مبيعات صافي', 'sales_net'),
('sales_net.create', 'إضافة مبيعات صافي', 'sales_net'),
('sales_net.edit', 'تعديل مبيعات صافي', 'sales_net'),
('sales_net.delete', 'حذف مبيعات صافي', 'sales_net'),

('sales_jewelry.view', 'عرض مبيعات مصاغ', 'sales_jewelry'),
('sales_jewelry.create', 'إضافة مبيعات مصاغ', 'sales_jewelry'),
('sales_jewelry.edit', 'تعديل مبيعات مصاغ', 'sales_jewelry'),
('sales_jewelry.delete', 'حذف مبيعات مصاغ', 'sales_jewelry'),

('sales_closing.view', 'عرض مبيعات تسكير', 'sales_closing'),
('sales_closing.create', 'إضافة مبيعات تسكير', 'sales_closing'),
('sales_closing.edit', 'تعديل مبيعات تسكير', 'sales_closing'),
('sales_closing.delete', 'حذف مبيعات تسكير', 'sales_closing'),

('sales_wages.view', 'عرض مبيعات أجور', 'sales_wages'),
('sales_wages.create', 'إضافة مبيعات أجور', 'sales_wages'),
('sales_wages.edit', 'تعديل مبيعات أجور', 'sales_wages'),
('sales_wages.delete', 'حذف مبيعات أجور', 'sales_wages'),

('sales_return_net.view', 'عرض مرتجع صافي', 'sales_return_net'),
('sales_return_net.create', 'إضافة مرتجع صافي', 'sales_return_net'),
('sales_return_net.edit', 'تعديل مرتجع صافي', 'sales_return_net'),
('sales_return_net.delete', 'حذف مرتجع صافي', 'sales_return_net'),

('sales_return_jewelry.view', 'عرض مرتجع مصاغ', 'sales_return_jewelry'),
('sales_return_jewelry.create', 'إضافة مرتجع مصاغ', 'sales_return_jewelry'),
('sales_return_jewelry.edit', 'تعديل مرتجع مصاغ', 'sales_return_jewelry'),
('sales_return_jewelry.delete', 'حذف مرتجع مصاغ', 'sales_return_jewelry'),

('sales_return_wages.view', 'عرض مرتجع أجور', 'sales_return_wages'),
('sales_return_wages.create', 'إضافة مرتجع أجور', 'sales_return_wages'),
('sales_return_wages.edit', 'تعديل مرتجع أجور', 'sales_return_wages'),
('sales_return_wages.delete', 'حذف مرتجع أجور', 'sales_return_wages'),

('sales_return_closing.view', 'عرض مرتجع تسكير', 'sales_return_closing'),
('sales_return_closing.create', 'إضافة مرتجع تسكير', 'sales_return_closing'),
('sales_return_closing.edit', 'تعديل مرتجع تسكير', 'sales_return_closing'),
('sales_return_closing.delete', 'حذف مرتجع تسكير', 'sales_return_closing'),

-- ============ المشتريات ============
('purchase_net.view', 'عرض مشتريات صافي', 'purchase_net'),
('purchase_net.create', 'إضافة مشتريات صافي', 'purchase_net'),
('purchase_net.edit', 'تعديل مشتريات صافي', 'purchase_net'),
('purchase_net.delete', 'حذف مشتريات صافي', 'purchase_net'),

('purchase_jewelry.view', 'عرض مشتريات مصاغ', 'purchase_jewelry'),
('purchase_jewelry.create', 'إضافة مشتريات مصاغ', 'purchase_jewelry'),
('purchase_jewelry.edit', 'تعديل مشتريات مصاغ', 'purchase_jewelry'),
('purchase_jewelry.delete', 'حذف مشتريات مصاغ', 'purchase_jewelry'),

('purchase_closing.view', 'عرض مشتريات تسكير', 'purchase_closing'),
('purchase_closing.create', 'إضافة مشتريات تسكير', 'purchase_closing'),
('purchase_closing.edit', 'تعديل مشتريات تسكير', 'purchase_closing'),
('purchase_closing.delete', 'حذف مشتريات تسكير', 'purchase_closing'),

('purchase_wages.view', 'عرض مشتريات أجور', 'purchase_wages'),
('purchase_wages.create', 'إضافة مشتريات أجور', 'purchase_wages'),
('purchase_wages.edit', 'تعديل مشتريات أجور', 'purchase_wages'),
('purchase_wages.delete', 'حذف مشتريات أجور', 'purchase_wages'),

('purchase_return_net.view', 'عرض مرتجع صافي', 'purchase_return_net'),
('purchase_return_net.create', 'إضافة مرتجع صافي', 'purchase_return_net'),
('purchase_return_net.edit', 'تعديل مرتجع صافي', 'purchase_return_net'),
('purchase_return_net.delete', 'حذف مرتجع صافي', 'purchase_return_net'),

('purchase_return_jewelry.view', 'عرض مرتجع مصاغ', 'purchase_return_jewelry'),
('purchase_return_jewelry.create', 'إضافة مرتجع مصاغ', 'purchase_return_jewelry'),
('purchase_return_jewelry.edit', 'تعديل مرتجع مصاغ', 'purchase_return_jewelry'),
('purchase_return_jewelry.delete', 'حذف مرتجع مصاغ', 'purchase_return_jewelry'),

('purchase_return_wages.view', 'عرض مرتجع أجور', 'purchase_return_wages'),
('purchase_return_wages.create', 'إضافة مرتجع أجور', 'purchase_return_wages'),
('purchase_return_wages.edit', 'تعديل مرتجع أجور', 'purchase_return_wages'),
('purchase_return_wages.delete', 'حذف مرتجع أجور', 'purchase_return_wages'),

('purchase_return_closing.view', 'عرض مرتجع تسكير', 'purchase_return_closing'),
('purchase_return_closing.create', 'إضافة مرتجع تسكير', 'purchase_return_closing'),
('purchase_return_closing.edit', 'تعديل مرتجع تسكير', 'purchase_return_closing'),
('purchase_return_closing.delete', 'حذف مرتجع تسكير', 'purchase_return_closing'),

-- ============ السندات ============
('receipt_vouchers.view', 'عرض سندات القبض', 'receipt_vouchers'),
('receipt_vouchers.create', 'إضافة سند قبض', 'receipt_vouchers'),
('receipt_vouchers.edit', 'تعديل سند قبض', 'receipt_vouchers'),
('receipt_vouchers.delete', 'حذف سند قبض', 'receipt_vouchers'),

('payment_vouchers.view', 'عرض سندات الصرف', 'payment_vouchers'),
('payment_vouchers.create', 'إضافة سند صرف', 'payment_vouchers'),
('payment_vouchers.edit', 'تعديل سند صرف', 'payment_vouchers'),
('payment_vouchers.delete', 'حذف سند صرف', 'payment_vouchers'),

-- ============ التقارير ============
('reports.sales', 'تقرير المبيعات', 'reports'),
('reports.purchases', 'تقرير المشتريات', 'reports'),
('reports.inventory', 'تقرير المخزون', 'reports'),
('reports.accounts', 'التقارير المحاسبية', 'reports'),
('reports.contacts', 'كشوف الحسابات', 'reports'),
('reports.gold', 'تقارير الذهب', 'reports');


INSERT INTO permissions (code, name, module) VALUES
-- ============ الرصيد الافتتاحي للذهب ============
('gold_opening_balances.view', 'عرض أرصدة الذهب الافتتاحية', 'gold_opening_balances'),
('gold_opening_balances.create', 'إضافة رصيد افتتاحي للذهب', 'gold_opening_balances'),
('gold_opening_balances.edit', 'تعديل رصيد افتتاحي للذهب', 'gold_opening_balances'),
('gold_opening_balances.delete', 'حذف رصيد افتتاحي للذهب', 'gold_opening_balances');