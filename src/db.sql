
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


















CREATE TABLE document_types (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    company_id BIGINT       NULL,
    type_code  VARCHAR(40)  NOT NULL,
    name       VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_document_types_code (company_id, type_code)
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

    -- المخزن/الدفع
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

























