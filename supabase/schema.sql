-- ============================================================
-- Nobab Lungi — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Run AFTER: functions.sql
-- Run BEFORE: rls-policies.sql, seed.sql
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- PROFILES
-- Extends auth.users with app-specific data.
-- Automatically created via trigger on auth.users insert.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);


-- ============================================================
-- ADDRESSES
-- Saved shipping addresses per user.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  district    TEXT NOT NULL,
  upazila     TEXT NOT NULL,
  address     TEXT NOT NULL,
  postal_code TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);


-- ============================================================
-- CATEGORIES
-- Subcategories grouped under a parent product type.
-- parent_type: 'lungi' | 'saree'
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_type TEXT NOT NULL CHECK (parent_type IN ('lungi', 'saree')),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_type ON public.categories(parent_type);


-- ============================================================
-- COLLECTIONS
-- Curated product groups (e.g., "Eid Special", "Summer").
-- A product can belong to multiple collections via junction table.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.collections (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  banner_url  TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_featured ON public.collections(is_featured);


-- ============================================================
-- PRODUCTS
-- Core product catalog. Prices are whole BDT integers.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  sku              TEXT UNIQUE,
  description      TEXT,
  price            INTEGER NOT NULL CHECK (price >= 0),       -- whole BDT (e.g., 850 = ৳850)
  discount_price   INTEGER CHECK (discount_price >= 0),       -- NULL means no discount
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id      INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller   BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON public.products(is_new_arrival);


-- ============================================================
-- PRODUCT IMAGES
-- Multiple images per product with ordering.
-- Images are hosted on Cloudinary; we store the URL.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);


-- ============================================================
-- COLLECTION PRODUCTS (junction table)
-- Many-to-many: a product can be in multiple collections.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id INTEGER NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_products_product_id ON public.collection_products(product_id);


-- ============================================================
-- ORDERS
-- shipping_address is stored as JSONB snapshot so historical
-- orders remain accurate even if the user updates their address.
-- ============================================================

CREATE TYPE IF NOT EXISTS order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE IF NOT EXISTS payment_status AS ENUM (
  'unpaid',
  'paid',
  'refunded'
);

CREATE TYPE IF NOT EXISTS payment_method AS ENUM (
  'cod',
  'bkash',
  'nagad'
);

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number     TEXT NOT NULL UNIQUE,
  status           order_status NOT NULL DEFAULT 'pending',
  subtotal         INTEGER NOT NULL CHECK (subtotal >= 0),       -- whole BDT
  delivery_charge  INTEGER NOT NULL DEFAULT 0 CHECK (delivery_charge >= 0),
  discount         INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total            INTEGER NOT NULL CHECK (total >= 0),
  payment_method   payment_method NOT NULL,
  payment_status   payment_status NOT NULL DEFAULT 'unpaid',
  shipping_address JSONB NOT NULL,   -- snapshot: {name, phone, district, upazila, address, postal_code}
  transaction_id   TEXT,             -- bKash/Nagad transaction reference
  coupon_code      TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);


-- ============================================================
-- ORDER ITEMS
-- Snapshot columns (product_name, product_image, price) ensure
-- order history stays accurate even if the product changes later.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id       UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name   TEXT NOT NULL,   -- snapshot
  product_image  TEXT,            -- snapshot (Cloudinary URL)
  price          INTEGER NOT NULL CHECK (price >= 0),   -- whole BDT, price at time of order
  quantity       INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);


-- ============================================================
-- COUPONS
-- type: 'percentage' | 'fixed'
-- max_discount_amount caps percentage discounts (e.g., 20% off, max ৳500)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id                  SERIAL PRIMARY KEY,
  code                TEXT NOT NULL UNIQUE,
  type                TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value               INTEGER NOT NULL CHECK (value > 0),       -- whole BDT or percentage (0-100)
  minimum_amount      INTEGER NOT NULL DEFAULT 0,               -- minimum cart total to apply
  max_discount_amount INTEGER,                                   -- cap for percentage coupons, NULL = no cap
  usage_limit         INTEGER,                                   -- NULL = unlimited
  used_count          INTEGER NOT NULL DEFAULT 0,
  start_date          TIMESTAMPTZ,
  end_date            TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);


-- ============================================================
-- REVIEWS
-- One review per user per product (enforced by unique constraint).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);


-- ============================================================
-- WISHLIST
-- One entry per user-product pair.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.wishlist (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);


-- ============================================================
-- BANNERS
-- Homepage hero banners. Images hosted on Cloudinary.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.banners (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  link        TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);


-- ============================================================
-- CONTACT MESSAGES
-- Public form submissions. Anyone can insert; only admin can read.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
