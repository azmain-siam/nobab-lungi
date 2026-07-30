# Phase 1 — Project Foundation: Folder Structure, Database Schema, RLS & Seed Data

## Overview

Setting up the foundation for **Nobab Lungi**, a Bangladeshi Lungi & Saree e-commerce store built with Next.js 15 (App Router), Supabase, Cloudinary, TailwindCSS, and shadcn/ui. This phase creates the project skeleton, complete database schema, row-level security policies, and initial seed data — **no UI yet**.

---

## 1. Folder Structure

### Design Decisions

| Decision | Rationale |
|---|---|
| **`src/` directory** | Next.js convention; separates source from config files |
| **`features/` for domain logic** | Groups related components, hooks, actions, and types by domain (cart, products, etc.) rather than by file type — makes it easy for a single developer to find everything related to a feature |
| **`actions/` at root `src/`** | Server Actions that span multiple features (e.g., revalidation helpers) live here. Feature-specific actions live inside `features/<name>/actions/` |
| **`lib/` for SDK clients** | Supabase client, Cloudinary config — initialized once, imported everywhere |
| **`services/` for data access** | Thin functions that wrap Supabase queries. Server Components call services, not raw Supabase queries |
| **`types/` for shared types** | Database row types (generated from Supabase), shared interfaces |
| **`constants/`** | Delivery charges, order statuses, payment methods — avoids magic strings |
| **Route groups `(store)` and `(admin)`** | Separates customer-facing pages from admin dashboard with different layouts, without affecting URLs |
| **`(auth)` route group** | Login/register pages get their own minimal layout |

### Proposed Structure

```
nobab-lungi/
├── .env.local                    # Environment variables (git-ignored)
├── .env.example                  # Template for env vars
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── AGENTS.md
├── PROJECT_SPEC.md
├── DATABASE_SCHEMA.md
├── DECISIONS.md
├── TODO.md
│
├── supabase/
│   ├── schema.sql                # Complete database schema
│   ├── rls-policies.sql          # All RLS policies
│   ├── seed.sql                  # Initial data
│   └── functions.sql             # Database functions (order number generation, etc.)
│
├── public/
│   └── images/                   # Static assets (logo, favicon, og-image)
│
└── src/
    ├── app/
    │   ├── layout.tsx            # Root layout (fonts, providers)
    │   ├── not-found.tsx
    │   ├── error.tsx
    │   │
    │   ├── (store)/              # Customer-facing pages
    │   │   ├── layout.tsx        # Store layout (navbar + footer)
    │   │   ├── page.tsx          # Homepage
    │   │   ├── products/
    │   │   │   ├── page.tsx      # Product listing
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx  # Product detail
    │   │   ├── categories/
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx  # Category page
    │   │   ├── collections/
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx  # Collection page
    │   │   ├── cart/
    │   │   │   └── page.tsx
    │   │   ├── checkout/
    │   │   │   └── page.tsx
    │   │   └── account/
    │   │       ├── page.tsx      # Profile
    │   │       ├── orders/
    │   │       │   └── page.tsx
    │   │       ├── wishlist/
    │   │       │   └── page.tsx
    │   │       └── addresses/
    │   │           └── page.tsx
    │   │
    │   ├── (auth)/               # Auth pages (minimal layout)
    │   │   ├── layout.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── register/
    │   │   │   └── page.tsx
    │   │   └── forgot-password/
    │   │       └── page.tsx
    │   │
    │   ├── (admin)/              # Admin dashboard
    │   │   ├── layout.tsx        # Admin layout (sidebar + header)
    │   │   └── dashboard/
    │   │       ├── page.tsx      # Dashboard overview
    │   │       ├── products/
    │   │       │   ├── page.tsx
    │   │       │   └── [id]/
    │   │       │       └── page.tsx
    │   │       ├── categories/
    │   │       │   └── page.tsx
    │   │       ├── collections/
    │   │       │   └── page.tsx
    │   │       ├── orders/
    │   │       │   ├── page.tsx
    │   │       │   └── [id]/
    │   │       │       └── page.tsx
    │   │       ├── banners/
    │   │       │   └── page.tsx
    │   │       └── coupons/
    │   │           └── page.tsx
    │   │
    │   └── api/                  # Route handlers (only when needed)
    │       └── auth/
    │           └── callback/
    │               └── route.ts  # Supabase auth callback
    │
    ├── components/               # Shared/reusable UI components
    │   ├── ui/                   # shadcn/ui components (auto-generated)
    │   ├── layout/               # Navbar, Footer, Sidebar
    │   ├── shared/               # ProductCard, PriceDisplay, Rating, etc.
    │   └── forms/                # Reusable form fields
    │
    ├── features/                 # Domain-specific feature modules
    │   ├── auth/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   ├── products/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   ├── cart/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   ├── checkout/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   ├── orders/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   ├── collections/
    │   │   ├── components/
    │   │   ├── actions/
    │   │   └── hooks/
    │   └── dashboard/
    │       ├── components/
    │       ├── actions/
    │       └── hooks/
    │
    ├── actions/                  # Global server actions
    │
    ├── hooks/                    # Global custom hooks
    │
    ├── lib/                      # SDK clients & core config
    │   ├── supabase/
    │   │   ├── client.ts         # Browser client
    │   │   ├── server.ts         # Server client (cookies-based)
    │   │   └── admin.ts          # Service role client (server-only)
    │   └── cloudinary.ts         # Cloudinary config
    │
    ├── services/                 # Data access layer
    │   ├── product-service.ts
    │   ├── category-service.ts
    │   ├── collection-service.ts
    │   ├── order-service.ts
    │   ├── coupon-service.ts
    │   ├── banner-service.ts
    │   └── user-service.ts
    │
    ├── types/                    # Shared TypeScript types
    │   ├── database.ts           # Supabase generated types
    │   ├── product.ts
    │   ├── order.ts
    │   └── index.ts
    │
    ├── utils/                    # Utility functions
    │   ├── format-price.ts       # BDT formatting
    │   ├── generate-slug.ts
    │   └── cn.ts                 # clsx + twMerge
    │
    ├── providers/                # React context providers
    │   ├── theme-provider.tsx
    │   └── cart-provider.tsx
    │
    ├── constants/                # App-wide constants
    │   ├── delivery.ts           # DELIVERY_CHARGES
    │   ├── order-status.ts       # ORDER_STATUSES
    │   └── payment.ts            # PAYMENT_METHODS
    │
    └── middleware.ts             # Auth middleware (protect admin routes)
```

> [!NOTE]
> The `supabase/` directory at root is intentional — SQL files are not application code and shouldn't live in `src/`. They serve as documentation and can be run directly in the Supabase SQL editor.

---

## 2. Supabase SQL Schema

### Design Decisions

| Decision | Rationale |
|---|---|
| **`profiles` table instead of `users`** | Supabase Auth already manages `auth.users`. We create a `profiles` table linked via `id = auth.users.id` to store app-specific data (name, phone, role, avatar). A trigger auto-creates a profile on signup. |
| **`role` as TEXT with CHECK constraint** | Simple and performant. Only two roles (`admin`, `customer`). No need for a separate roles table. Default is `customer`. |
| **`slug` columns with UNIQUE constraint** | SEO-friendly URLs. Enforced at database level to prevent duplicates. |
| **`order_number` as a generated sequence** | Human-readable order numbers like `NL-00001`. Generated by a database function to avoid race conditions. |
| **`payment_status` separate from `status`** | Order status (PENDING → SHIPPED → DELIVERED) and payment status (UNPAID → PAID → REFUNDED) are independent concerns. A COD order is CONFIRMED but UNPAID until delivery. |
| **Prices stored as INTEGER (poisha/cents)** | Avoids floating-point issues. Store `15000` for ৳150.00. Display layer divides by 100. |
| **`product_images` as separate table** | Products can have multiple images with a sort order. Storing as JSON array would lose query/index capability. |
| **`shipping_address` stored as JSONB on orders** | Snapshot of address at order time. If user later updates their address, historical orders remain accurate. |
| **`collection_products` junction table** | A product can belong to multiple collections (e.g., "Eid Collection" and "Premium Collection"). Many-to-many is the right model. |
| **Soft delete not used** | Adds complexity. For Phase 1, hard delete is fine. Admin can't accidentally delete — UI will confirm. |
| **`updated_at` auto-updated via trigger** | Consistent timestamps without relying on application code. |
| **`coupon_type` as `percentage` or `fixed`** | Covers both "10% off" and "৳100 off" scenarios. |

> [!IMPORTANT]
> Prices are stored as **integers in poisha** (1 BDT = 100 poisha). For example, a lungi priced at ৳850 is stored as `85000`. The application display layer will format this. This prevents floating-point rounding errors in calculations.

### Full Schema SQL

Will be written to `supabase/schema.sql`. Key tables:

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | User app data | role, name, phone, avatar_url |
| `addresses` | Saved shipping addresses | user_id, district, upazila, postal_code, is_default |
| `categories` | Lungi/Saree sub-categories | name, slug, description, image_url, parent_type |
| `collections` | Curated product groups | name, slug, banner_url, is_featured |
| `products` | Product catalog | name, slug, sku, price (int), stock, category_id |
| `product_images` | Multiple images per product | product_id, url, alt_text, sort_order |
| `collection_products` | Many-to-many junction | collection_id, product_id |
| `orders` | Customer orders | order_number, status, payment_method, shipping_address (JSONB) |
| `order_items` | Line items per order | order_id, product_id, product_name (snapshot), price, quantity |
| `coupons` | Discount codes | code, type, value, min_amount, date range, usage_limit |
| `reviews` | Product reviews | user_id, product_id, rating (1-5), comment |
| `wishlist` | User wishlisted products | user_id, product_id (unique pair) |
| `banners` | Homepage banners | title, image_url, link, sort_order, is_active |
| `contact_messages` | Contact form submissions | name, email, phone, message |

#### Notable Column Additions vs DATABASE_SCHEMA.md

| Addition | Reason |
|---|---|
| `profiles.role` defaults to `'customer'` | Automatic role assignment on signup |
| `categories.parent_type` (`lungi` or `saree`) | Groups subcategories under their parent product type without needing a hierarchical category tree |
| `products.is_active` | Admin can hide products without deleting |
| `product_images.alt_text` | SEO accessibility |
| `collection_products` junction table | Many-to-many (schema had `collection_id` on products — too limiting) |
| `orders.shipping_address` as JSONB | Snapshot instead of FK reference (addresses can change) |
| `order_items.product_name`, `product_image` | Snapshot data — product may change or be deleted after order |
| `coupons.usage_limit`, `used_count` | Prevent coupon abuse |
| `coupons.max_discount_amount` | Cap percentage discounts (e.g., 20% off, max ৳500) |

---

## 3. RLS Policies

### Design Decisions

| Decision | Rationale |
|---|---|
| **Admin check via `profiles.role`** | RLS policies query `profiles` to check if `auth.uid()` has `role = 'admin'`. Simple and reliable. |
| **Helper function `is_admin()`** | Avoids repeating the admin check subquery in every policy. |
| **Public read on products, categories, collections, banners** | These are public storefront data. No auth required to browse. |
| **Customers can only read/write their own data** | Orders, addresses, wishlist, reviews — scoped to `auth.uid()`. |
| **Admins have full CRUD** | Admin policies use `is_admin()` for INSERT, UPDATE, DELETE. |
| **Orders are insert-only for customers** | Customers can create orders and view their own, but cannot update/delete. Only admin can change order status. |
| **Contact messages are insert-only** | Anyone can submit (no auth required). Only admins can read. |

### Policy Summary

| Table | Public Read | Auth Read Own | Auth Write Own | Admin Full |
|---|---|---|---|---|
| `profiles` | ✗ | ✓ (own) | ✓ (own, limited) | ✓ |
| `addresses` | ✗ | ✓ | ✓ | ✓ |
| `categories` | ✓ | — | ✗ | ✓ |
| `collections` | ✓ | — | ✗ | ✓ |
| `products` | ✓ (active only) | — | ✗ | ✓ |
| `product_images` | ✓ | — | ✗ | ✓ |
| `collection_products` | ✓ | — | ✗ | ✓ |
| `orders` | ✗ | ✓ (own) | ✓ (insert only) | ✓ |
| `order_items` | ✗ | ✓ (via order) | ✓ (insert only) | ✓ |
| `coupons` | ✓ (active only) | — | ✗ | ✓ |
| `reviews` | ✓ | — | ✓ (own) | ✓ |
| `wishlist` | ✗ | ✓ | ✓ | ✓ |
| `banners` | ✓ (active only) | — | ✗ | ✓ |
| `contact_messages` | ✗ | ✗ | ✓ (insert, no auth) | ✓ (read) |

---

## 4. Initial Seed Data

### What Gets Seeded

| Data | Items | Rationale |
|---|---|---|
| **Categories** | 10 (5 Lungi + 5 Saree) | From PROJECT_SPEC: Premium Cotton, Export Quality, Check, Printed, Handloom for Lungi; Cotton, Jamdani, Silk, Printed, Handloom for Saree |
| **Collections** | 3 sample | "Eid Special", "Summer Collection", "New Arrivals" — demonstrates the feature |
| **Delivery Constants** | In `constants/delivery.ts` | Inside Dhaka: 70 BDT, Outside Dhaka: 130 BDT (from spec) |
| **Admin user** | 1 | Sets the first user's role to `admin` (configurable via env var) |

> [!NOTE]
> No sample products are seeded. Products should be created by the admin through the dashboard with real images uploaded to Cloudinary. Seeding fake products with placeholder images would create cleanup work.

---

## 5. Database Functions

| Function | Purpose |
|---|---|
| `handle_new_user()` | Trigger function: auto-creates a `profiles` row when a new user signs up via Supabase Auth |
| `generate_order_number()` | Generates sequential order numbers like `NL-00001` using a Postgres sequence |
| `update_updated_at()` | Trigger function: auto-updates `updated_at` timestamp on row modification |

---

## Open Questions

> [!IMPORTANT]
> **1. Price Storage Format**: I'm proposing storing prices as integers in **poisha** (smallest BDT unit, like cents). So ৳850 = `85000`. This is the safest approach for calculations. However, if you prefer simpler values like storing `850` as an integer (since BDT prices rarely use decimals), let me know.

> [!IMPORTANT]
> **2. Admin User Setup**: How should the first admin be created? Options:
> - **Option A**: Seed SQL sets a specific email as admin (you provide the email)
> - **Option B**: A manual step — you sign up normally, then run a SQL query to set your role to `admin`
> - **Option C**: An env variable `ADMIN_EMAIL` that the `handle_new_user()` trigger checks
>
> I recommend **Option C** — most flexible and doesn't hardcode emails in SQL.

> [!IMPORTANT]
> **3. Cart Storage**: Should the cart be:
> - **Option A**: LocalStorage only (simpler, no auth needed to add items, works offline)
> - **Option B**: Database table (persists across devices, but needs auth)
> - **Option C**: LocalStorage for guests, sync to database on login
>
> I recommend **Option A** for Phase 1 — it's simpler, faster, and avoids extra database queries. Most Bangladeshi e-commerce sites use this pattern.

---

## Proposed Changes

### [NEW] Folder Structure

Creating empty directories and placeholder files to establish the project structure as outlined in Section 1. Only the `supabase/` SQL files and `src/constants/` files will have real content in this phase.

---

### [NEW] `supabase/schema.sql`

Complete CREATE TABLE statements for all 14 tables, with proper types, constraints, indexes, and foreign keys.

---

### [NEW] `supabase/functions.sql`

Database functions and triggers:
- `handle_new_user()` + trigger
- `generate_order_number()` + sequence
- `update_updated_at()` + triggers on relevant tables

---

### [NEW] `supabase/rls-policies.sql`

All RLS policies as described in Section 3. Enables RLS on every table. Creates the `is_admin()` helper function.

---

### [NEW] `supabase/seed.sql`

Initial seed data: 10 categories, 3 collections.

---

### [NEW] `.env.example`

Template file listing all required environment variables.

---

### [NEW] `src/constants/delivery.ts`

```typescript
export const DELIVERY_CHARGES = {
  INSIDE_DHAKA: 7000,   // 70 BDT in poisha
  OUTSIDE_DHAKA: 13000, // 130 BDT in poisha
} as const;
```

### [NEW] `src/constants/order-status.ts`

Order status and payment status enums.

### [NEW] `src/constants/payment.ts`

Payment method constants.

---

## Verification Plan

### Automated
- Run `schema.sql` in Supabase SQL editor → verify all tables created
- Run `functions.sql` → verify triggers work (create a test user)
- Run `rls-policies.sql` → verify policies enabled on all tables
- Run `seed.sql` → verify categories and collections inserted

### Manual
- Verify folder structure matches the plan
- Verify `.env.example` lists all needed variables
- Review SQL for correctness before running in Supabase
