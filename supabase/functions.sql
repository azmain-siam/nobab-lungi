-- ============================================================
-- Nobab Lungi — Database Functions & Triggers
-- Run this BEFORE schema.sql
-- ============================================================


-- ============================================================
-- 1. AUTO-CREATE PROFILE ON SIGNUP
-- Triggered after a new row is inserted in auth.users.
-- Copies email from auth.users; sets role to 'admin' if the
-- user's email matches the ADMIN_EMAIL app setting.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_email TEXT;
  user_role   TEXT;
BEGIN
  -- Read ADMIN_EMAIL from app settings (set in Supabase Dashboard → Settings → API → App Settings)
  -- If not configured, falls back to '' so no user auto-gets admin.
  admin_email := COALESCE(current_setting('app.admin_email', true), '');
  
  IF NEW.email = admin_email AND admin_email != '' THEN
    user_role := 'admin';
  ELSE
    user_role := 'customer';
  END IF;

  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    user_role
  );

  RETURN NEW;
END;
$$;

-- Drop and recreate trigger to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. ORDER NUMBER GENERATOR
-- Generates sequential, human-readable order numbers: NL-00001
-- Uses a Postgres sequence to prevent race conditions.
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1 INCREMENT 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'NL-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
END;
$$;


-- ============================================================
-- 3. AUTO-UPDATE updated_at TIMESTAMP
-- Generic trigger function used across multiple tables.
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to tables that have updated_at columns
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.collections;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.orders;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.banners;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- HOW TO SET ADMIN_EMAIL:
-- Run this in Supabase SQL Editor after deploying:
--
--   ALTER DATABASE postgres SET app.admin_email = 'your-email@example.com';
--
-- Then sign up with that email — the trigger will set role = 'admin'.
-- ============================================================
