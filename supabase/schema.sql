-- ============================================================
--  Karobar — Supabase PostgreSQL Schema + Seed Data
--  Run this entire script once in: Supabase → SQL Editor → Run
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── DISABLE RLS (simple setup — enable later when adding auth) ──
-- RLS will be set to OFF so the anon key has full access for now.

-- ============================================================
--  TABLE: business_settings  (singleton — always 1 row)
-- ============================================================
create table if not exists public.business_settings (
  id                serial primary key,
  name              text not null default 'My Business',
  address           text default '',
  phone             text default '',
  email             text default '',
  pan_vat           text default '',
  logo_url          text default '',
  invoice_prefix    text default 'INV',
  invoice_footer    text default 'Thank you for your business!',
  payment_methods   jsonb default '["cash","bank","qr","esewa","khalti","credit"]'::jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
alter table public.business_settings disable row level security;

insert into public.business_settings (name, address, phone, email, pan_vat, invoice_prefix, invoice_footer)
values ('Shrestha Traders', 'New Road, Kathmandu', '01-4234567', 'info@shresthatraders.com', '602487514', 'INV', 'Thank you for your business!')
on conflict do nothing;

-- ============================================================
--  TABLE: roles
-- ============================================================
create table if not exists public.roles (
  id          serial primary key,
  name        text not null unique,
  description text default '',
  permissions jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);
alter table public.roles disable row level security;

insert into public.roles (id, name, description, permissions) values
  (1, 'Owner',       'Full access to all features',    '["all"]'),
  (2, 'Admin',       'Administrative access',           '["sales","purchases","products","inventory","customers","suppliers","expenses","payments","reports","users"]'),
  (3, 'Manager',     'Operational management',          '["sales","purchases","products","inventory","customers","suppliers","expenses","payments","reports"]'),
  (4, 'Sales Staff', 'Sales and POS operations',        '["sales","customers","products"]'),
  (5, 'Accountant',  'Financial management',            '["accounting","reports","expenses","payments","purchases"]')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: app_users  (app-level users, not auth.users)
-- ============================================================
create table if not exists public.app_users (
  id          serial primary key,
  name        text not null,
  email       text not null unique,
  phone       text default '',
  role_id     int references public.roles(id),
  role_name   text default '',
  status      text default 'Active',
  last_login  text default 'Never',
  created_at  date default current_date
);
alter table public.app_users disable row level security;

insert into public.app_users (id, name, email, phone, role_id, role_name, status, last_login, created_at) values
  (1, 'Ram Shrestha',   'ram@hisaabkit.com',    '9841234567', 1, 'Owner',       'Active',   '2026-09-15 09:30', '2024-01-01'),
  (2, 'Sita Devi',      'sita@hisaabkit.com',   '9851234567', 4, 'Sales Staff', 'Active',   '2026-09-15 10:15', '2025-03-15'),
  (3, 'Hari Bahadur',   'hari@hisaabkit.com',   '9861234567', 5, 'Accountant',  'Active',   '2026-09-14 16:45', '2025-05-20'),
  (4, 'Gita Maharjan',  'gita@hisaabkit.com',   '9871234567', 3, 'Manager',     'Active',   '2026-09-15 08:00', '2025-06-10'),
  (5, 'Krishna Tamang', 'krishna@hisaabkit.com','9881234567', 4, 'Sales Staff', 'Inactive', '2026-08-20 14:30', '2025-07-01')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: products
-- ============================================================
create table if not exists public.products (
  id             serial primary key,
  name           text not null,
  sku            text not null unique,
  category       text default '',
  brand          text default '',
  purchase_price numeric(12,2) default 0,
  selling_price  numeric(12,2) default 0,
  stock          int default 0,
  min_stock      int default 0,
  unit           text default 'Pcs',
  vat_applicable boolean default true,
  description    text default '',
  status         text default 'Active',
  image_url      text default '',
  created_at     timestamptz default now()
);
alter table public.products disable row level security;

insert into public.products (id, name, sku, category, brand, purchase_price, selling_price, stock, min_stock, unit, vat_applicable, description, status) values
  (1,  'Wai Wai Chicken Noodles 78g', 'WW-CHI-78',  'Snacks',        'Wai Wai',     32,  50,   420, 50,  'Pkt', true,  'Popular instant noodles',        'Active'),
  (2,  'Wai Wai Masala Noodles 78g',  'WW-MAS-78',  'Snacks',        'Wai Wai',     32,  50,   8,   50,  'Pkt', true,  'Masala flavored instant noodles', 'Low Stock'),
  (3,  'Gold Peak Sugar 1kg',          'GP-SUG-1K',  'Groceries',     'Gold Peak',   180, 300,  24,  40,  'Pkt', false, 'Refined white sugar',             'Low Stock'),
  (4,  'Relax Mustard Oil 1L',         'RL-MUS-1L',  'Groceries',     'Relax',       320, 450,  15,  30,  'Btl', true,  'Pure mustard cooking oil',        'Low Stock'),
  (5,  'Himalayan Salt 500g',          'HM-SLT-500', 'Groceries',     'Himalayan',   45,  80,   180, 40,  'Pkt', false, 'Iodized table salt',              'Active'),
  (6,  'Everest Tea 500g',             'EV-TEA-500', 'Beverages',     'Everest',     280, 400,  95,  30,  'Pkt', true,  'Premium Nepali tea leaves',       'Active'),
  (7,  'Coca Cola 1.25L',              'CC-COL-125', 'Beverages',     'Coca Cola',   110, 150,  240, 60,  'Btl', true,  'Carbonated soft drink',           'Active'),
  (8,  'Sprite 1.25L',                 'SP-LMN-125', 'Beverages',     'Coca Cola',   110, 150,  180, 60,  'Btl', true,  'Lemon-lime soft drink',           'Active'),
  (9,  'Colgate Toothpaste 150g',      'CG-TPT-150', 'Personal Care', 'Colgate',     180, 260,  75,  20,  'Pcs', true,  'Cavity protection toothpaste',    'Active'),
  (10, 'Lifebuoy Soap 100g',           'LB-SOP-100', 'Personal Care', 'Lifebuoy',    65,  100,  320, 80,  'Pcs', true,  'Germ protection soap',            'Active'),
  (11, 'Classmate Notebook 200pg',     'CM-NBK-200', 'Stationery',    'Classmate',   120, 180,  140, 30,  'Pcs', true,  'Single line notebook',            'Active'),
  (12, 'Reynolds Ball Pen',            'RN-PEN-BL',  'Stationery',    'Reynolds',    10,  20,   600, 100, 'Pcs', true,  'Blue ball pen',                   'Active'),
  (13, 'Duracell AA Battery 4pk',      'DR-BAT-AA4', 'Electronics',   'Duracell',    380, 550,  45,  15,  'Pkt', true,  'Alkaline AA batteries',           'Active'),
  (14, 'Philips LED Bulb 9W',          'PH-LED-9W',  'Electronics',   'Philips',     220, 320,  60,  20,  'Pcs', true,  'Energy saving LED bulb',          'Active'),
  (15, 'Amul Butter 100g',             'AM-BTR-100', 'Dairy',         'Amul',        190, 260,  40,  25,  'Pcs', false, 'Pasteurized butter',              'Active'),
  (16, 'Nepal Dairy Milk 1L',          'ND-MIL-1L',  'Dairy',         'Nepal Dairy', 80,  110,  55,  30,  'Pkt', false, 'Fresh pasteurized milk',          'Active'),
  (17, 'Surf Excel 1kg',               'SX-DEL-1K',  'Household',     'Surf Excel',  310, 420,  70,  20,  'Pkt', true,  'Detergent powder',                'Active'),
  (18, 'Vim Dishwash Bar 300g',        'VM-DWS-300', 'Household',     'Vim',         75,  110,  110, 30,  'Pcs', true,  'Dishwashing bar',                 'Active'),
  (19, 'Maggi Tomato Ketchup 500g',    'MG-KTC-500', 'Groceries',     'Maggi',       180, 260,  0,   20,  'Btl', true,  'Tomato ketchup',                  'Out of Stock'),
  (20, 'Noodles Masala 12pk',          'WW-MAS-12P', 'Snacks',        'Wai Wai',     360, 540,  28,  15,  'Pkt', true,  'Bulk pack noodles',               'Active')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: customers
-- ============================================================
create table if not exists public.customers (
  id               serial primary key,
  name             text not null,
  phone            text default '',
  email            text default '',
  address          text default '',
  pan              text default '',
  total_purchases  numeric(14,2) default 0,
  paid             numeric(14,2) default 0,
  due              numeric(14,2) default 0,
  status           text default 'Active',
  created_at       date default current_date
);
alter table public.customers disable row level security;

insert into public.customers (id, name, phone, email, address, pan, total_purchases, paid, due, status, created_at) values
  (1,  'Shrestha Kirana Pasal',   '9841234567', 'shrestha.kp@gmail.com',   'New Road, Kathmandu',    '301234567', 456000,  410400,  45600,  'Active',   '2025-03-15'),
  (2,  'Maharjan General Store',  '9851234567', 'maharjan.gs@gmail.com',   'Lalitpur, Bagmati',      '301234568', 1285000, 1285000, 0,      'Active',   '2025-01-10'),
  (3,  'Tamang Traders',          '9861234567', 'tamang.traders@gmail.com','Bhaktapur, Kathmandu',   '301234569', 892000,  802800,  89200,  'Active',   '2025-02-20'),
  (4,  'Gurung Mart',             '9871234567', 'gurung.mart@gmail.com',   'Pokhara, Kaski',         '301234570', 345000,  345000,  0,      'Active',   '2025-04-05'),
  (5,  'Rai Bhandar',             '9881234567', 'rai.bhandar@gmail.com',   'Dharan, Sunsari',        '301234571', 234500,  234500,  0,      'Active',   '2025-05-12'),
  (6,  'Thapa Store',             '9891234567', 'thapa.store@gmail.com',   'Birgunj, Parsa',         '301234572', 567000,  283500,  283500, 'Overdue',  '2025-03-22'),
  (7,  'Adhikari Supermarket',    '9801234567', 'adhikari.sm@gmail.com',   'Butwal, Rupandehi',      '301234573', 1890000, 1890000, 0,      'Active',   '2024-11-08'),
  (8,  'KC Mini Mart',            '9811234567', 'kc.minimart@gmail.com',   'Nepalgunj, Banke',       '301234574', 178500,  178500,  0,      'Active',   '2025-06-18'),
  (9,  'Poudel Wholesale',        '9821234567', 'poudel.ws@gmail.com',     'Biratchowk, Morang',     '301234575', 2450000, 2200000, 250000, 'Overdue',  '2024-09-14'),
  (10, 'Basnet Enterprises',      '9831234567', 'basnet.ent@gmail.com',    'Hetauda, Makwanpur',     '301234576', 412000,  412000,  0,      'Inactive', '2025-01-30')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: customer_transactions
-- ============================================================
create table if not exists public.customer_transactions (
  id          serial primary key,
  customer_id int references public.customers(id) on delete cascade,
  reference   text default '',
  date        date default current_date,
  type        text default 'Sale',
  amount      numeric(14,2) default 0,
  paid        numeric(14,2) default 0,
  balance     numeric(14,2) default 0,
  method      text default 'Cash'
);
alter table public.customer_transactions disable row level security;

insert into public.customer_transactions (customer_id, reference, date, type, amount, paid, balance, method) values
  (1, 'INV-1042', '2026-09-15', 'Sale',    45600,   45600,  0,      'eSewa'),
  (1, 'INV-1028', '2026-09-08', 'Sale',    78200,   78200,  0,      'Bank'),
  (1, 'PAY-0412', '2026-09-05', 'Payment', -50000,  50000,  0,      'Cash'),
  (2, 'INV-1041', '2026-09-15', 'Sale',    128500,  128500, 0,      'Bank'),
  (2, 'INV-1015', '2026-08-28', 'Sale',    95400,   95400,  0,      'QR'),
  (3, 'INV-1040', '2026-09-14', 'Sale',    89200,   0,      89200,  'Credit'),
  (3, 'INV-1002', '2026-08-15', 'Sale',    112000,  112000, 0,      'Bank'),
  (4, 'INV-1039', '2026-09-14', 'Sale',    34500,   34500,  0,      'QR'),
  (5, 'INV-1038', '2026-09-13', 'Sale',    18900,   18900,  0,      'Cash'),
  (6, 'INV-1037', '2026-09-13', 'Sale',    56700,   0,      56700,  'Credit'),
  (7, 'INV-1035', '2026-09-11', 'Sale',    245000,  245000, 0,      'Bank'),
  (9, 'INV-1030', '2026-09-09', 'Sale',    250000,  0,      250000, 'Credit');

-- ============================================================
--  TABLE: leads
-- ============================================================
create table if not exists public.leads (
  id             text primary key,
  name           text not null,
  source         text default 'facebook',
  account_name   text default '',
  phone          text default '',
  interest       text default '',
  expected_value numeric(14,2) default 0,
  status         text default 'new',
  date           date default current_date,
  notes          text default '',
  created_at     timestamptz default now()
);
alter table public.leads disable row level security;

insert into public.leads (id, name, source, account_name, phone, interest, expected_value, status, date, notes) values
  ('LD-001', 'Ramesh Tamang',   'instagram', '@ramesh.tamang',     '9841234567', 'Leather jackets (8 pcs)',     48000, 'new',        '2026-09-15', 'Asked about bulk discount for reselling.'),
  ('LD-002', 'Shreya Maharjan',  'facebook',  'Shreya Boutique',    '9851122334', 'Designer sarees stock',        65000, 'contacted',  '2026-09-14', 'Shared catalogue on Messenger. Waiting for reply.'),
  ('LD-003', 'Anil K.C.',        'whatsapp',  '+977 9801122334',    '9801122334', 'School bags bulk (50 pcs)',   90000, 'follow_up',  '2026-09-13', 'Replied on WhatsApp, wants wholesale rate.'),
  ('LD-004', 'Priya Gurung',     'tiktok',    '@priya.style',       '9842001122', 'Sports shoes',                 15000, 'new',        '2026-09-15', 'Found us through a TikTok video.'),
  ('LD-005', 'Sushil Shrestha',  'call',      'Walk-in caller',     '9814112233', 'Office chairs (5 pcs)',        38000, 'converted',  '2026-09-10', 'Order confirmed, delivery on Saturday.'),
  ('LD-006', 'Nisha Thapa',      'facebook',  'Nisha Thapa',        '9860112234', 'Handbags',                     8000,  'lost',       '2026-09-08', 'Found a cheaper option elsewhere.'),
  ('LD-007', 'Dipesh Rai',       'enquiry',   'Store visit',        '9808198765', 'Mixer grinder',                12000, 'contacted',  '2026-09-12', 'Visited store and asked for a live demo.'),
  ('LD-008', 'Sabina Lama',      'instagram', '@sabinaoptics',      '9826123456', 'Readymade dresses (12 pcs)',   42000, 'follow_up',  '2026-09-11', 'Interested in the new winter collection.'),
  ('LD-009', 'Kiran Basnet',     'whatsapp',  '+977 9849005566',    '9849005566', 'Laser printer',                21000, 'new',        '2026-09-14', ''),
  ('LD-010', 'Maya Shrestha',    'tiktok',    '@maya.style',        '9841556677', 'Kurtas & tops (30 pcs)',       54000, 'converted',  '2026-09-05', 'Followed up from TikTok DM. Converted to first order.'),
  ('LD-011', 'Rohan Jha',        'call',      'Referred by Anil',   '9827091234', 'Inverter & battery',           34000, 'contacted',  '2026-09-13', 'Asked for a price quote over the call.'),
  ('LD-012', 'Sita Karki',       'enquiry',   'Trade fair enquiry', '9803122334', 'Kitchen appliances',           30000, 'new',        '2026-09-15', 'Enquired at the trade fair booth.')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: suppliers
-- ============================================================
create table if not exists public.suppliers (
  id               serial primary key,
  name             text not null,
  phone            text default '',
  email            text default '',
  address          text default '',
  pan              text default '',
  total_purchases  numeric(14,2) default 0,
  paid             numeric(14,2) default 0,
  due              numeric(14,2) default 0,
  status           text default 'Active',
  created_at       date default current_date
);
alter table public.suppliers disable row level security;

insert into public.suppliers (id, name, phone, email, address, pan, total_purchases, paid, due, status, created_at) values
  (1, 'Wai Wai Distributors Nepal', '01-4234567', 'orders@waiwai-np.com',  'Balkhu, Kathmandu',       '601234567', 1850000, 1750000, 100000, 'Active',   '2024-08-10'),
  (2, 'Gold Peak Industries',       '01-5345678', 'sales@goldpeak.com',    'Balaju, Kathmandu',       '601234568', 980000,  980000,  0,      'Active',   '2024-10-15'),
  (3, 'Relax Oil Mills',            '056-423456', 'info@relaxoil.com',     'Birgunj Industrial Area', '601234569', 1420000, 1280000, 140000, 'Active',   '2024-09-20'),
  (4, 'Everest Tea Company',        '023-456789', 'supply@everesttea.com', 'Ilam, Province 1',        '601234570', 780000,  780000,  0,      'Active',   '2025-01-05'),
  (5, 'Coca Cola Bottlers Nepal',   '01-4456789', 'orders@ccbn.com',       'Balkumari, Lalitpur',     '601234571', 2150000, 2150000, 0,      'Active',   '2024-07-22'),
  (6, 'Colgate Palmolive Nepal',    '01-5567890', 'b2b@colgate-np.com',    'Lagankhel, Lalitpur',     '601234572', 620000,  620000,  0,      'Active',   '2025-02-14'),
  (7, 'Hindustan Unilever Nepal',   '01-4678901', 'supply@hunilever.com',  'Patan, Lalitpur',         '601234573', 1180000, 1050000, 130000, 'Active',   '2024-11-30'),
  (8, 'Philips Lighting Nepal',     '01-5789012', 'orders@philips-np.com', 'Teku, Kathmandu',         '601234574', 445000,  445000,  0,      'Inactive', '2025-03-18')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: supplier_transactions
-- ============================================================
create table if not exists public.supplier_transactions (
  id          serial primary key,
  supplier_id int references public.suppliers(id) on delete cascade,
  reference   text default '',
  date        date default current_date,
  type        text default 'Purchase',
  amount      numeric(14,2) default 0,
  paid        numeric(14,2) default 0,
  balance     numeric(14,2) default 0,
  method      text default 'Bank'
);
alter table public.supplier_transactions disable row level security;

insert into public.supplier_transactions (supplier_id, reference, date, type, amount, paid, balance, method) values
  (1, 'PUR-0210', '2026-09-12', 'Purchase', 180000, 80000,  100000, 'Bank'),
  (1, 'PUR-0195', '2026-08-25', 'Purchase', 245000, 245000, 0,      'Bank'),
  (2, 'PUR-0208', '2026-09-10', 'Purchase', 126000, 126000, 0,      'Bank'),
  (3, 'PUR-0212', '2026-09-14', 'Purchase', 140000, 0,      140000, 'Credit'),
  (5, 'PUR-0215', '2026-09-15', 'Purchase', 225000, 225000, 0,      'Bank'),
  (7, 'PUR-0211', '2026-09-11', 'Purchase', 130000, 0,      130000, 'Credit');

-- ============================================================
--  TABLE: sales
-- ============================================================
create table if not exists public.sales (
  id              text primary key,
  customer_id     int default 0,
  customer_name   text default 'Walk-in Customer',
  date            date default current_date,
  subtotal        numeric(14,2) default 0,
  discount        numeric(14,2) default 0,
  vat             numeric(14,2) default 0,
  grand_total     numeric(14,2) default 0,
  payment_method  text default 'cash',
  status          text default 'Paid',
  cashier         text default '',
  created_at      timestamptz default now()
);
alter table public.sales disable row level security;

insert into public.sales (id, customer_id, customer_name, date, subtotal, discount, vat, grand_total, payment_method, status, cashier) values
  ('INV-1042', 1, 'Shrestha Kirana Pasal',  '2026-09-15', 6000,  0,    780,  45600,  'esewa',  'Paid',    'Ram Shrestha'),
  ('INV-1041', 2, 'Maharjan General Store', '2026-09-15', 13500, 1500, 1729, 128500, 'bank',   'Paid',    'Ram Shrestha'),
  ('INV-1040', 3, 'Tamang Traders',         '2026-09-14', 8000,  0,    1040, 89200,  'credit', 'Due',     'Sita Devi'),
  ('INV-1039', 4, 'Gurung Mart',            '2026-09-14', 3120,  0,    406,  34500,  'qr',     'Paid',    'Ram Shrestha'),
  ('INV-1038', 5, 'Rai Bhandar',            '2026-09-13', 3600,  0,    0,    18900,  'cash',   'Paid',    'Sita Devi'),
  ('INV-1037', 6, 'Thapa Store',            '2026-09-13', 6300,  0,    819,  56700,  'khalti', 'Partial', 'Ram Shrestha')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: sale_items
-- ============================================================
create table if not exists public.sale_items (
  id          serial primary key,
  sale_id     text references public.sales(id) on delete cascade,
  product_id  int default 0,
  name        text default '',
  qty         int default 1,
  price       numeric(12,2) default 0,
  discount    numeric(12,2) default 0
);
alter table public.sale_items disable row level security;

insert into public.sale_items (sale_id, product_id, name, qty, price, discount) values
  ('INV-1042', 1,  'Wai Wai Chicken Noodles 78g', 48, 50,  0),
  ('INV-1042', 7,  'Coca Cola 1.25L',              24, 150, 0),
  ('INV-1041', 4,  'Relax Mustard Oil 1L',         30, 450, 1500),
  ('INV-1040', 6,  'Everest Tea 500g',             20, 400, 0),
  ('INV-1039', 9,  'Colgate Toothpaste 150g',      12, 260, 0),
  ('INV-1038', 10, 'Lifebuoy Soap 100g',           36, 100, 0),
  ('INV-1037', 17, 'Surf Excel 1kg',               15, 420, 0);

-- ============================================================
--  TABLE: sale_returns  (Credit Notes)
-- ============================================================
create table if not exists public.sale_returns (
  id              text primary key,
  sale_id         text references public.sales(id) on delete set null,
  customer_id     int default 0,
  customer_name   text default 'Walk-in Customer',
  date            date default current_date,
  subtotal        numeric(14,2) default 0,
  vat             numeric(14,2) default 0,
  grand_total     numeric(14,2) default 0,
  reason          text default '',
  status          text default 'Refunded',
  cashier         text default '',
  created_at      timestamptz default now()
);
alter table public.sale_returns disable row level security;

insert into public.sale_returns (id, sale_id, customer_id, customer_name, date, subtotal, vat, grand_total, reason, status, cashier) values
  ('CN-1003', 'INV-1041', 2, 'Maharjan General Store', '2026-09-15', 450, 58.5, 508.5, 'Damaged packaging',      'Refunded', 'Ram Shrestha'),
  ('CN-1002', 'INV-1039', 4, 'Gurung Mart',            '2026-09-14', 260, 33.8, 293.8, 'Wrong item delivered',   'Pending',  'Sita Devi'),
  ('CN-1001', 'INV-1038', 5, 'Rai Bhandar',            '2026-09-13', 100, 13,   113,   'Customer changed mind',  'Refunded', 'Ram Shrestha')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: sale_return_items
-- ============================================================
create table if not exists public.sale_return_items (
  id              serial primary key,
  return_id       text references public.sale_returns(id) on delete cascade,
  product_id      int default 0,
  name            text default '',
  qty             int default 1,
  price           numeric(12,2) default 0
);
alter table public.sale_return_items disable row level security;

insert into public.sale_return_items (return_id, product_id, name, qty, price) values
  ('CN-1003', 4,  'Relax Mustard Oil 1L',     1, 450),
  ('CN-1002', 9,  'Colgate Toothpaste 150g',  1, 260),
  ('CN-1001', 10, 'Lifebuoy Soap 100g',       1, 100);

-- ============================================================
--  TABLE: purchases
-- ============================================================
create table if not exists public.purchases (
  id              text primary key,
  supplier_id     int default 0,
  supplier_name   text default '',
  date            date default current_date,
  invoice_no      text default '',
  subtotal        numeric(14,2) default 0,
  discount        numeric(14,2) default 0,
  vat             numeric(14,2) default 0,
  grand_total     numeric(14,2) default 0,
  payment_method  text default 'bank',
  payment_status  text default 'Paid',
  amount_paid     numeric(14,2) default 0,
  created_at      timestamptz default now()
);
alter table public.purchases disable row level security;

insert into public.purchases (id, supplier_id, supplier_name, date, invoice_no, subtotal, discount, vat, grand_total, payment_method, payment_status, amount_paid) values
  ('PUR-0215', 5, 'Coca Cola Bottlers Nepal',   '2026-09-15', 'CCBN-88421', 26400, 0, 3432, 225000, 'bank',   'Paid',    225000),
  ('PUR-0212', 3, 'Relax Oil Mills',            '2026-09-14', 'ROM-44521',  32000, 0, 4160, 140000, 'credit', 'Due',     0),
  ('PUR-0211', 7, 'Hindustan Unilever Nepal',   '2026-09-11', 'HUL-77812',  28500, 0, 3705, 130000, 'credit', 'Due',     0),
  ('PUR-0210', 1, 'Wai Wai Distributors Nepal', '2026-09-12', 'WDN-99120',  16000, 0, 2080, 180000, 'bank',   'Partial', 80000),
  ('PUR-0208', 2, 'Gold Peak Industries',       '2026-09-10', 'GPI-33210',  36000, 0, 0,    126000, 'bank',   'Paid',    126000)
on conflict (id) do nothing;

-- ============================================================
--  TABLE: purchase_items
-- ============================================================
create table if not exists public.purchase_items (
  id          serial primary key,
  purchase_id text references public.purchases(id) on delete cascade,
  product_id  int default 0,
  name        text default '',
  qty         int default 1,
  price       numeric(12,2) default 0,
  discount    numeric(12,2) default 0
);
alter table public.purchase_items disable row level security;

insert into public.purchase_items (purchase_id, product_id, name, qty, price, discount) values
  ('PUR-0215', 7,  'Coca Cola 1.25L',              120, 110, 0),
  ('PUR-0215', 8,  'Sprite 1.25L',                 120, 110, 0),
  ('PUR-0212', 4,  'Relax Mustard Oil 1L',         100, 320, 0),
  ('PUR-0211', 10, 'Lifebuoy Soap 100g',           200, 65,  0),
  ('PUR-0211', 17, 'Surf Excel 1kg',               50,  310, 0),
  ('PUR-0210', 1,  'Wai Wai Chicken Noodles 78g',  500, 32,  0),
  ('PUR-0208', 3,  'Gold Peak Sugar 1kg',          200, 180, 0);

-- ============================================================
--  TABLE: expenses
-- ============================================================
create table if not exists public.expenses (
  id          text primary key,
  date        date default current_date,
  category    text default '',
  description text default '',
  amount      numeric(12,2) default 0,
  method      text default 'cash',
  status      text default 'Paid',
  paid_by     text default '',
  created_at  timestamptz default now()
);
alter table public.expenses disable row level security;

insert into public.expenses (id, date, category, description, amount, method, status, paid_by) values
  ('EXP-0210', '2026-09-15', 'Rent',           'Shop rent — September 2026',       45000, 'bank',   'Paid',    'Ram Shrestha'),
  ('EXP-0209', '2026-09-14', 'Salary',         'Staff salary — Sita Devi',         22000, 'bank',   'Paid',    'Ram Shrestha'),
  ('EXP-0208', '2026-09-12', 'Electricity',    'NEA electricity bill — Bhadra',    8450,  'bank',   'Paid',    'Ram Shrestha'),
  ('EXP-0207', '2026-09-10', 'Internet',       'WorldLink broadband — monthly',    2500,  'esewa',  'Paid',    'Sita Devi'),
  ('EXP-0206', '2026-09-08', 'Transportation', 'Goods transport from Birgunj',     6500,  'cash',   'Paid',    'Ram Shrestha'),
  ('EXP-0205', '2026-09-05', 'Office Supplies','Printer ink & paper',              3200,  'cash',   'Paid',    'Sita Devi'),
  ('EXP-0204', '2026-09-02', 'Marketing',      'Dashain festival banner printing', 4500,  'khalti', 'Paid',    'Ram Shrestha'),
  ('EXP-0203', '2026-08-30', 'Maintenance',    'Refrigerator repair',              3800,  'cash',   'Paid',    'Ram Shrestha'),
  ('EXP-0202', '2026-08-28', 'Salary',         'Staff salary — helper',            15000, 'cash',   'Paid',    'Ram Shrestha'),
  ('EXP-0201', '2026-08-25', 'Other',          'Miscellaneous shop expenses',      1850,  'cash',   'Pending', 'Sita Devi')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: payments
-- ============================================================
create table if not exists public.payments (
  id          text primary key,
  date        date default current_date,
  type        text default 'received',
  party_type  text default 'customer',
  party_id    int default 0,
  party_name  text default '',
  amount      numeric(14,2) default 0,
  method      text default 'cash',
  reference   text default '',
  notes       text default '',
  created_at  timestamptz default now()
);
alter table public.payments disable row level security;

insert into public.payments (id, date, type, party_type, party_id, party_name, amount, method, reference, notes) values
  ('PAY-0512', '2026-09-15', 'received', 'customer', 1, 'Shrestha Kirana Pasal',     45600,  'esewa',  'INV-1042', 'Full payment'),
  ('PAY-0511', '2026-09-15', 'received', 'customer', 2, 'Maharjan General Store',    128500, 'bank',   'INV-1041', ''),
  ('PAY-0510', '2026-09-15', 'made',     'supplier', 5, 'Coca Cola Bottlers Nepal',  225000, 'bank',   'PUR-0215', 'Full payment'),
  ('PAY-0509', '2026-09-14', 'received', 'customer', 4, 'Gurung Mart',               34500,  'qr',     'INV-1039', ''),
  ('PAY-0508', '2026-09-14', 'made',     'supplier', 1, 'Wai Wai Distributors Nepal',80000,  'bank',   'PUR-0210', 'Partial payment'),
  ('PAY-0507', '2026-09-13', 'received', 'customer', 5, 'Rai Bhandar',               18900,  'cash',   'INV-1038', ''),
  ('PAY-0506', '2026-09-13', 'received', 'customer', 6, 'Thapa Store',               28350,  'khalti', 'INV-1037', 'Partial payment')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: stock_history
-- ============================================================
create table if not exists public.stock_history (
  id           serial primary key,
  date         date default current_date,
  product_id   int default 0,
  product_name text default '',
  type         text default 'IN',
  qty          int default 0,
  reference    text default '',
  performed_by text default '',
  reason       text default '',
  created_at   timestamptz default now()
);
alter table public.stock_history disable row level security;

insert into public.stock_history (date, product_id, product_name, type, qty, reference, performed_by, reason) values
  ('2026-09-15', 1,  'Wai Wai Chicken Noodles 78g', 'IN',  500, 'PUR-0210', 'Ram Shrestha', 'Purchase receipt'),
  ('2026-09-15', 7,  'Coca Cola 1.25L',              'IN',  120, 'PUR-0215', 'Ram Shrestha', 'Purchase receipt'),
  ('2026-09-15', 1,  'Wai Wai Chicken Noodles 78g', 'OUT', 48,  'INV-1042', 'Sita Devi',    'Sale'),
  ('2026-09-14', 19, 'Maggi Tomato Ketchup 500g',   'OUT', 5,   'ADJ-0042', 'Ram Shrestha', 'Damaged goods'),
  ('2026-09-13', 6,  'Everest Tea 500g',             'ADJ', -3,  'ADJ-0041', 'Ram Shrestha', 'Stock count correction'),
  ('2026-09-12', 10, 'Lifebuoy Soap 100g',           'IN',  200, 'PUR-0211', 'Ram Shrestha', 'Purchase receipt');

-- ============================================================
--  TABLE: stock_adjustments
-- ============================================================
create table if not exists public.stock_adjustments (
  id           text primary key,
  date         date default current_date,
  product_id   int default 0,
  product_name text default '',
  type         text default 'ADJUSTMENT',
  qty          int default 0,
  reason       text default '',
  reference    text default '',
  performed_by text default '',
  created_at   timestamptz default now()
);
alter table public.stock_adjustments disable row level security;

insert into public.stock_adjustments (id, date, product_id, product_name, type, qty, reason, reference, performed_by) values
  ('ADJ-0042', '2026-09-14', 19, 'Maggi Tomato Ketchup 500g', 'OUT',        5,  'Damaged goods — broken bottles',   'PUR-0210', 'Ram Shrestha'),
  ('ADJ-0041', '2026-09-13', 6,  'Everest Tea 500g',          'ADJUSTMENT', -3, 'Physical stock count correction',  'STK-0091', 'Ram Shrestha'),
  ('ADJ-0040', '2026-09-08', 12, 'Reynolds Ball Pen',         'ADJUSTMENT', 12, 'Found in back storage',            'STK-0090', 'Sita Devi'),
  ('ADJ-0039', '2026-09-02', 15, 'Amul Butter 100g',          'OUT',        8,  'Expired — disposed',               'PUR-0205', 'Ram Shrestha'),
  ('ADJ-0038', '2026-08-28', 9,  'Colgate Toothpaste 150g',   'ADJUSTMENT', -2, 'Stock reconciliation',             'STK-0088', 'Ram Shrestha')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: stock_transfers
-- ============================================================
create table if not exists public.stock_transfers (
  id           text primary key,
  date         date default current_date,
  product_id   int default 0,
  product_name text default '',
  from_location text default '',
  to_location   text default '',
  qty          int default 0,
  reference    text default '',
  status       text default 'Completed',
  performed_by text default '',
  created_at   timestamptz default now()
);
alter table public.stock_transfers disable row level security;

insert into public.stock_transfers (id, date, product_id, product_name, from_location, to_location, qty, reference, status, performed_by) values
  ('TRF-0012', '2026-09-15', 1,  'Wai Wai Chicken Noodles 78g', 'Warehouse',  'Main Store', 120, 'STK-0092', 'Completed', 'Ram Shrestha'),
  ('TRF-0011', '2026-09-14', 7,  'Coca Cola 1.25L',             'Warehouse',  'Main Store', 60,  'STK-0091', 'Completed', 'Sita Devi'),
  ('TRF-0010', '2026-09-12', 10, 'Lifebuoy Soap 100g',          'Main Store', 'Counter 2',  40,  'STK-0090', 'Pending',   'Ram Shrestha')
on conflict (id) do nothing;

-- ============================================================
--  TABLE: chart_of_accounts
-- ============================================================
create table if not exists public.chart_of_accounts (
  id          text primary key,
  code        text not null unique,
  name        text not null,
  type        text default 'Asset',
  balance     numeric(14,2) default 0,
  parent_code text default null,
  created_at  timestamptz default now()
);
alter table public.chart_of_accounts disable row level security;

insert into public.chart_of_accounts (id, code, name, type, balance) values
  ('1000', '1000', 'Cash',               'Asset',   245600),
  ('1010', '1010', 'Bank - Nabil Bank',  'Asset',   1250000),
  ('1020', '1020', 'Bank - NIC Asia',    'Asset',   890000),
  ('1100', '1100', 'Accounts Receivable','Asset',   384300),
  ('1200', '1200', 'Inventory',          'Asset',   1850000),
  ('2000', '2000', 'Accounts Payable',   'Liability',370000),
  ('2100', '2100', 'VAT Payable',        'Liability',125400),
  ('3000', '3000', 'Owner''s Capital',   'Equity',  2000000),
  ('3100', '3100', 'Retained Earnings',  'Equity',  856850),
  ('4000', '4000', 'Sales Revenue',      'Income',  8456000),
  ('5000', '5000', 'Cost of Goods Sold', 'COGS',    5123000),
  ('6000', '6000', 'Rent Expense',       'Expense', 270000),
  ('6100', '6100', 'Salary Expense',     'Expense', 220000),
  ('6200', '6200', 'Utilities Expense',  'Expense', 84500),
  ('6300', '6300', 'Marketing Expense',  'Expense', 45000),
  ('6900', '6900', 'Other Expenses',     'Expense', 144950)
on conflict (id) do nothing;

-- ============================================================
--  TABLE: journal_entries
-- ============================================================
create table if not exists public.journal_entries (
  id          text primary key,
  date        date default current_date,
  description text default '',
  reference   text default '',
  created_at  timestamptz default now()
);
alter table public.journal_entries disable row level security;

-- ============================================================
--  TABLE: journal_lines
-- ============================================================
create table if not exists public.journal_lines (
  id           serial primary key,
  entry_id     text references public.journal_entries(id) on delete cascade,
  account_id   text default '',
  account_name text default '',
  debit        numeric(14,2) default 0,
  credit       numeric(14,2) default 0
);
alter table public.journal_lines disable row level security;

insert into public.journal_entries (id, date, description, reference) values
  ('JRN-0156', '2026-09-15', 'Sale to Shrestha Kirana Pasal',      'INV-1042'),
  ('JRN-0155', '2026-09-15', 'Purchase from Coca Cola Bottlers',   'PUR-0215'),
  ('JRN-0154', '2026-09-15', 'Payment to Coca Cola Bottlers',      'PAY-0510'),
  ('JRN-0153', '2026-09-14', 'Shop rent payment - September',      'EXP-0210'),
  ('JRN-0152', '2026-09-14', 'Staff salary payment',               'EXP-0209')
on conflict (id) do nothing;

insert into public.journal_lines (entry_id, account_id, account_name, debit, credit) values
  ('JRN-0156', '1010', 'Bank - Nabil Bank', 45600,  0),
  ('JRN-0156', '4000', 'Sales Revenue',     0,      39652),
  ('JRN-0156', '2100', 'VAT Payable',       0,      5948),
  ('JRN-0155', '1200', 'Inventory',         193800, 0),
  ('JRN-0155', '2000', 'Accounts Payable',  0,      193800),
  ('JRN-0154', '2000', 'Accounts Payable',  225000, 0),
  ('JRN-0154', '1010', 'Bank - Nabil Bank', 0,      225000),
  ('JRN-0153', '6000', 'Rent Expense',      45000,  0),
  ('JRN-0153', '1010', 'Bank - Nabil Bank', 0,      45000),
  ('JRN-0152', '6100', 'Salary Expense',    22000,  0),
  ('JRN-0152', '1010', 'Bank - Nabil Bank', 0,      22000);

-- ============================================================
--  SEQUENCE RESETS (so new inserts continue from correct IDs)
-- ============================================================
select setval('public.products_id_seq',        (select max(id) from public.products));
select setval('public.customers_id_seq',       (select max(id) from public.customers));
select setval('public.suppliers_id_seq',       (select max(id) from public.suppliers));
select setval('public.app_users_id_seq',       (select max(id) from public.app_users));
select setval('public.roles_id_seq',           (select max(id) from public.roles));
select setval('public.customer_transactions_id_seq', (select max(id) from public.customer_transactions));
select setval('public.supplier_transactions_id_seq', (select max(id) from public.supplier_transactions));
select setval('public.sale_items_id_seq',      (select max(id) from public.sale_items));
select setval('public.sale_return_items_id_seq', (select max(id) from public.sale_return_items));
select setval('public.purchase_items_id_seq',  (select max(id) from public.purchase_items));
select setval('public.stock_history_id_seq',   (select max(id) from public.stock_history));
select setval('public.journal_lines_id_seq',   (select max(id) from public.journal_lines));

-- ============================================================
--  DONE — Schema and seed data loaded successfully!
-- ============================================================
