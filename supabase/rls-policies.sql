-- ============================================================
-- Nobab Lungi — Row Level Security Policies
-- Run this AFTER schema.sql and functions.sql
-- ============================================================


-- ============================================================
-- HELPER FUNCTION
-- Checks if the currently authenticated user has the admin role.
-- Used in policies to avoid repeating the subquery.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PROFILES
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all"   ON public.profiles;

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (but not change role)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admins have full access
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (is_admin());


-- ============================================================
-- ADDRESSES
-- ============================================================

DROP POLICY IF EXISTS "addresses_select_own"  ON public.addresses;
DROP POLICY IF EXISTS "addresses_insert_own"  ON public.addresses;
DROP POLICY IF EXISTS "addresses_update_own"  ON public.addresses;
DROP POLICY IF EXISTS "addresses_delete_own"  ON public.addresses;
DROP POLICY IF EXISTS "addresses_admin_all"   ON public.addresses;

CREATE POLICY "addresses_select_own" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "addresses_insert_own" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_update_own" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "addresses_delete_own" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "addresses_admin_all" ON public.addresses
  FOR ALL USING (is_admin());


-- ============================================================
-- CATEGORIES
-- Public read; only admin can mutate.
-- ============================================================

DROP POLICY IF EXISTS "categories_public_select" ON public.categories;
DROP POLICY IF EXISTS "categories_admin_all"     ON public.categories;

CREATE POLICY "categories_public_select" ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL USING (is_admin());


-- ============================================================
-- COLLECTIONS
-- Public read; only admin can mutate.
-- ============================================================

DROP POLICY IF EXISTS "collections_public_select" ON public.collections;
DROP POLICY IF EXISTS "collections_admin_all"     ON public.collections;

CREATE POLICY "collections_public_select" ON public.collections
  FOR SELECT USING (TRUE);

CREATE POLICY "collections_admin_all" ON public.collections
  FOR ALL USING (is_admin());


-- ============================================================
-- PRODUCTS
-- Public can read active products; admin can read/write all.
-- ============================================================

DROP POLICY IF EXISTS "products_public_select" ON public.products;
DROP POLICY IF EXISTS "products_admin_all"     ON public.products;

-- Public: only active products visible
CREATE POLICY "products_public_select" ON public.products
  FOR SELECT USING (is_active = TRUE);

-- Admin: full access (including inactive/draft products)
CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (is_admin());


-- ============================================================
-- PRODUCT IMAGES
-- Public read (follows product visibility); admin can mutate.
-- ============================================================

DROP POLICY IF EXISTS "product_images_public_select" ON public.product_images;
DROP POLICY IF EXISTS "product_images_admin_all"     ON public.product_images;

CREATE POLICY "product_images_public_select" ON public.product_images
  FOR SELECT USING (TRUE);

CREATE POLICY "product_images_admin_all" ON public.product_images
  FOR ALL USING (is_admin());


-- ============================================================
-- COLLECTION PRODUCTS
-- Public read; admin can mutate.
-- ============================================================

DROP POLICY IF EXISTS "collection_products_public_select" ON public.collection_products;
DROP POLICY IF EXISTS "collection_products_admin_all"     ON public.collection_products;

CREATE POLICY "collection_products_public_select" ON public.collection_products
  FOR SELECT USING (TRUE);

CREATE POLICY "collection_products_admin_all" ON public.collection_products
  FOR ALL USING (is_admin());


-- ============================================================
-- ORDERS
-- Customers can insert and read their own orders.
-- Only admin can update (status changes) or delete.
-- ============================================================

DROP POLICY IF EXISTS "orders_select_own"   ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own"   ON public.orders;
DROP POLICY IF EXISTS "orders_admin_all"    ON public.orders;

CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_admin_all" ON public.orders
  FOR ALL USING (is_admin());


-- ============================================================
-- ORDER ITEMS
-- Customers can read items belonging to their own orders.
-- Insert allowed when placing order; no update/delete for customers.
-- ============================================================

DROP POLICY IF EXISTS "order_items_select_own"  ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_own"  ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin_all"   ON public.order_items;

CREATE POLICY "order_items_select_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin_all" ON public.order_items
  FOR ALL USING (is_admin());


-- ============================================================
-- COUPONS
-- Public can read active, non-expired coupons (to validate at checkout).
-- Admin can manage all coupons.
-- ============================================================

DROP POLICY IF EXISTS "coupons_public_select" ON public.coupons;
DROP POLICY IF EXISTS "coupons_admin_all"     ON public.coupons;

CREATE POLICY "coupons_public_select" ON public.coupons
  FOR SELECT USING (
    is_active = TRUE
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date >= NOW())
  );

CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL USING (is_admin());


-- ============================================================
-- REVIEWS
-- Public can read all reviews.
-- Authenticated users can insert/update/delete their own reviews.
-- Admin has full access.
-- ============================================================

DROP POLICY IF EXISTS "reviews_public_select"  ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own"     ON public.reviews;
DROP POLICY IF EXISTS "reviews_update_own"     ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own"     ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_all"      ON public.reviews;

CREATE POLICY "reviews_public_select" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "reviews_admin_all" ON public.reviews
  FOR ALL USING (is_admin());


-- ============================================================
-- WISHLIST
-- Users can only access their own wishlist.
-- ============================================================

DROP POLICY IF EXISTS "wishlist_select_own"  ON public.wishlist;
DROP POLICY IF EXISTS "wishlist_insert_own"  ON public.wishlist;
DROP POLICY IF EXISTS "wishlist_delete_own"  ON public.wishlist;
DROP POLICY IF EXISTS "wishlist_admin_all"   ON public.wishlist;

CREATE POLICY "wishlist_select_own" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "wishlist_insert_own" ON public.wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wishlist_delete_own" ON public.wishlist
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "wishlist_admin_all" ON public.wishlist
  FOR ALL USING (is_admin());


-- ============================================================
-- BANNERS
-- Public can read active banners; admin manages all.
-- ============================================================

DROP POLICY IF EXISTS "banners_public_select" ON public.banners;
DROP POLICY IF EXISTS "banners_admin_all"     ON public.banners;

CREATE POLICY "banners_public_select" ON public.banners
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "banners_admin_all" ON public.banners
  FOR ALL USING (is_admin());


-- ============================================================
-- CONTACT MESSAGES
-- Anyone (including unauthenticated) can INSERT.
-- Only admin can SELECT (read submitted messages).
-- No UPDATE or DELETE for non-admin.
-- ============================================================

DROP POLICY IF EXISTS "contact_messages_public_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_all"     ON public.contact_messages;

CREATE POLICY "contact_messages_public_insert" ON public.contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "contact_messages_admin_all" ON public.contact_messages
  FOR ALL USING (is_admin());
