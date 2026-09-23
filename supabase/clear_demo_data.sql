-- ============================================================
--  HisaabKit — Safe Universal Database Reset Script
--  Run in: Supabase Dashboard → SQL Editor → New Query → Run
--  This dynamically finds all existing tables in public schema,
--  truncates them safely without throwing 'relation does not exist' errors,
--  and preserves system roles & schema structure.
-- ============================================================

-- ── 1. Dynamically truncate all existing tables (except 'roles') ──
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename NOT IN ('roles')
    ) LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE;';
    END LOOP;
END $$;

-- ── 2. Reset Chart of Accounts balances ─────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chart_of_accounts') THEN
        UPDATE public.chart_of_accounts SET balance = 0;
    END IF;
END $$;

-- ── 3. Ensure core system roles exist ───────────────────────
CREATE TABLE IF NOT EXISTS public.roles (
  id          serial primary key,
  name        text not null unique,
  description text default '',
  permissions jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);

INSERT INTO public.roles (id, name, description, permissions) VALUES
  (1, 'Owner',       'Full access to all features',    '["all"]'),
  (2, 'Admin',       'Administrative access',           '["sales","purchases","products","inventory","customers","suppliers","expenses","payments","reports","users"]'),
  (3, 'Manager',     'Operational management',          '["sales","purchases","products","inventory","customers","suppliers","expenses","payments","reports"]'),
  (4, 'Sales Staff', 'Sales and POS operations',        '["sales","customers","products"]'),
  (5, 'Accountant',  'Financial management',            '["accounting","reports","expenses","payments","purchases"]')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;
