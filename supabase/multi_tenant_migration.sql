-- ============================================================
--  MULTI-TENANT ISOLATION & STAFF PERMISSIONS MIGRATION
--  Run this in Supabase → SQL Editor → New Query → Run
--  This adds business_id to all data tables & staff permission
--  columns to app_users table.
-- ============================================================

-- ── STEP 1: Add business_id column to all data tables ───────

alter table public.business_settings
  add column if not exists owner_email text default '';

alter table public.customers
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.customer_transactions
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.products
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.suppliers
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.purchases
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.expenses
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.leads
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.app_users
  add column if not exists business_id int default 1 references public.business_settings(id),
  add column if not exists permissions jsonb default '[]'::jsonb,
  add column if not exists must_change_password boolean default false,
  add column if not exists is_verified boolean default true,
  add column if not exists first_logged_in_at timestamptz;

alter table public.sales
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.sale_returns
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.payments
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.journal_entries
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.supplier_transactions
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.stock_history
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.stock_adjustments
  add column if not exists business_id int default 1 references public.business_settings(id);

alter table public.stock_transfers
  add column if not exists business_id int default 1 references public.business_settings(id);

-- ── STEP 1b: Categories table (replaces static JS list) ─────

create table if not exists public.categories (
  id          serial primary key,
  business_id int default 1 references public.business_settings(id),
  name        text not null,
  created_at  timestamptz default now(),
  unique (business_id, name)
);
alter table public.categories disable row level security;

-- backfill existing product categories so businesses keep their filters
insert into public.categories (business_id, name)
select distinct business_id, category from public.products
where category is not null and category <> ''
on conflict (business_id, name) do nothing;

-- ── STEP 2: Add email to business_settings for owner lookup ─

alter table public.business_settings
  add column if not exists pan_vat text default '';

-- ── STEP 3: Index for fast per-business queries ──────────────

create index if not exists idx_customers_business        on public.customers(business_id);
create index if not exists idx_products_business         on public.products(business_id);
create index if not exists idx_suppliers_business        on public.suppliers(business_id);
create index if not exists idx_purchases_business        on public.purchases(business_id);
create index if not exists idx_expenses_business         on public.expenses(business_id);
create index if not exists idx_leads_business            on public.leads(business_id);
create index if not exists idx_app_users_business        on public.app_users(business_id);
create index if not exists idx_sales_business            on public.sales(business_id);
create index if not exists idx_payments_business         on public.payments(business_id);
create index if not exists idx_journal_business          on public.journal_entries(business_id);
create index if not exists idx_supplier_tx_business      on public.supplier_transactions(business_id);
create index if not exists idx_stock_history_business    on public.stock_history(business_id);
create index if not exists idx_stock_adjust_business     on public.stock_adjustments(business_id);
create index if not exists idx_stock_transfer_business   on public.stock_transfers(business_id);
create index if not exists idx_categories_business       on public.categories(business_id);
