# Changelog

All notable changes to Nobab Lungi are documented here.

---

## v0.2.0 — Customer Homepage (2026-07-20)

### Added
- **Homepage** at `/` with 5 sections: Hero Banner, Featured Categories, New Arrivals, Best Sellers, Featured Collections, Why Choose Us
- **Hero Banner** — reads from `banners` table; falls back to a premium static design when empty
- **Featured Categories** — all 10 seeded categories in colour-coded Lungi/Saree grids
- **Featured Collections** — 3 seeded collections with gradient cards
- **Product Sections** — New Arrivals and Best Sellers grids with graceful empty states
- **Why Choose Us** — 4 static benefit cards
- **`ProductCard`** shared component with image, price, discount badge, new badge
- **`SectionHeader`** shared component for consistent section titles
- **Service layer** — `banner-service`, `category-service`, `collection-service`, `product-service`
- Cloudinary `remotePatterns` added to `next.config.ts`

---

## v0.1.0 — Project Foundation & Authentication (2026-07-20)

### Added
- **Project setup** — Next.js 15 App Router, TypeScript strict mode, TailwindCSS v4, shadcn/ui ready
- **Database schema** — 14 tables, all with RLS policies (`supabase/schema.sql`, `rls-policies.sql`, `functions.sql`)
- **Seed data** — 10 categories (5 Lungi + 5 Saree), 3 featured collections
- **Authentication** — Register, Login, Logout, Forgot Password, Reset Password (Supabase Auth)
- **Route protection** — `src/proxy.ts` guards `/account/**` (auth) and `/dashboard/**` (admin)
- **User Profile** — `/account` page with editable name and phone
- **Account sub-pages** — Orders, Wishlist, Addresses (placeholders for Phase 4)
- **Admin Dashboard** — `/dashboard` with sidebar navigation (placeholder for Phase 5)
- **Store layout** — Navbar with auth-aware user menu, Footer
- **Admin layout** — Sidebar with active link highlighting
- **Constants** — `DELIVERY_CHARGES`, `ORDER_STATUSES`, `PAYMENT_METHODS`
- **Utilities** — `formatPrice`, `getDiscountPercent`, `getEffectivePrice`, `generateSlug`, `cn`
