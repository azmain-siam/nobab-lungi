# Storefront UX & Production Audit — Nabab Lungi

## Executive Summary

The Nabab Lungi storefront is **well-structured and visually polished**, with a strong design system, solid backend order creation logic (server-side price validation, stock checking, deduplication), and a coherent customer account area. However, several **critical and high-priority issues** must be addressed before production:

1. **Logout redirects to localhost** in production (NextAuth `NEXTAUTH_URL` is still `localhost:3000` in `.env.local` which gets deployed)
2. **No authentication protection** on sensitive account pages (addresses, wishlist, profile) — they show empty/broken UIs for unauthenticated users
3. **Addresses page is fake** — hardcoded placeholder data, not persisted to any database
4. **No route-level loading states** for product details or account pages, causing perceived sluggishness
5. **Client-side price parsing is fragile** — the cart uses regex-based string price extraction that can break with formatting changes

**Verdict: Needs Important Fixes** before going live to real customers.

---

## Critical Issues 🔴

### C1. Logout / Auth Redirect to localhost in Production

- **Issue**: `.env.local` has `NEXTAUTH_URL=http://localhost:3000` and `GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google`. When deployed to Vercel, these localhost values are used by NextAuth for session callbacks and sign-out redirects.
- **User Impact**: After signing out in production, users are redirected to `http://localhost:3000/login` — a broken page. Google OAuth may also fail entirely.
- **Technical Cause**: `.env.local` is committed/deployed with localhost values. Vercel environment variables should override these, but if `NEXTAUTH_URL` isn't set in the Vercel dashboard, the `.env.local` value wins.
- **Affected**: [auth.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/lib/auth.ts), [use-user.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/auth/hooks/use-user.ts#L57-L59), [.env.local](file:///home/azmain-siam/Documents/Projects/nobab-lungi/.env.local)
- **Fix**:
  1. Ensure `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, and `GOOGLE_REDIRECT_URI` are set to the production URL (`https://nobab-lungi.vercel.app`) in Vercel's environment variables dashboard.
  2. Add `.env.local` to `.gitignore` if not already — secrets should never be committed.
  3. Consider removing `GOOGLE_REDIRECT_URI` entirely — NextAuth auto-computes it from `NEXTAUTH_URL`.
- **Priority**: **P0 — Fix immediately**

---

### C2. Saved Addresses Page is Fake / Not Persisted

- **Issue**: [addresses/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/addresses/page.tsx#L19-L36) uses hardcoded `INITIAL_ADDRESSES` with dummy data ("Rafiqul Islam", "House 42, Road 11, Banani"). Addresses are managed entirely in React state — nothing is saved to the database.
- **User Impact**: Customer adds a delivery address, refreshes the page, and the address is gone. Two hardcoded fake addresses appear for every user.
- **Technical Cause**: No backend service/model for saved addresses. The page is a stub with placeholder data.
- **Fix**: Either:
  - **Option A**: Remove the Saved Addresses page from the account sidebar and navigation until a real backend is built
  - **Option B**: Build a real `Address` model in MongoDB and wire up server actions
- **Priority**: **P0 — Must fix before production** (showing fake data to customers is unacceptable)

---

### C3. No Auth Guard on Account Sub-Pages

- **Issue**: While [proxy.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/proxy.ts#L26-L35) middleware redirects unauthenticated users from `/account` routes, several account pages don't verify the session server-side:
  - [addresses/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/addresses/page.tsx) — `'use client'`, no session check
  - [wishlist/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/wishlist/page.tsx) — `'use client'`, calls `getUserWishlistAction()` which may silently return empty
  - [profile/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/profile/page.tsx) — relies on `useUser()` hook, no server-side protection
- **User Impact**: If middleware somehow misses (e.g., direct API call, middleware config mismatch), users see broken or empty pages without meaningful error messages.
- **Technical Cause**: Client-side pages rely solely on middleware for auth gating, without defense-in-depth.
- **Note**: The middleware config at [proxy.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/proxy.ts) covers `/account` routes, and the file is named `proxy.ts` in `src/`. Next.js expects middleware at `src/middleware.ts` — **verify this file is actually being picked up as middleware** (the `export const middleware = proxy` on line 50 and the export location may need checking).
- **Fix**: Add graceful "Please sign in" states in each client page, or convert to server components with `getServerSession` checks.
- **Priority**: **P0**

---

### C4. Secrets Committed in .env.local

- **Issue**: [.env.local](file:///home/azmain-siam/Documents/Projects/nobab-lungi/.env.local) contains real MongoDB connection strings, Cloudinary API secrets, NextAuth secrets, and Google OAuth credentials in plain text.
- **User Impact**: If this file is in version control, anyone with repo access has full database and authentication credentials.
- **Fix**: 
  1. Add `.env.local` to `.gitignore`
  2. Rotate all exposed credentials
  3. Use Vercel's environment variables dashboard for production secrets
- **Priority**: **P0 — Security critical**

---

## High Priority Issues 🟠

### H1. No Route-Level Loading States for Key Pages

- **Issue**: Only two `loading.tsx` files exist: `(store)/loading.tsx` and `(admin)/loading.tsx`. No sub-route loading files for:
  - `/products/[id]` — Product Details page (server component, fetches product + settings + related products)
  - `/collections/[slug]` — Collection page (server component, fetches collection + products)
  - `/account/orders/[id]` — Order Details page (server component, fetches order)
  - `/account/orders` — Order History page
  - `/account` — Account Overview page
- **User Impact**: Clicking a product card produces no immediate visual feedback. The user stares at the current page for 1-3 seconds until the new page renders. This feels slow, even on fast connections.
- **Technical Cause**: Without route-level `loading.tsx` files, Next.js waits for the entire server component tree to resolve before navigation visually starts.
- **Fix**: Add skeleton-based `loading.tsx` files for `products/[id]`, `collections/[slug]`, `account/orders/[id]`, `account/orders`, and `account` routes.
- **Priority**: **P1 — Major perceived performance issue**

---

### H2. Client-Side Price Parsing is Fragile

- **Issue**: Cart subtotal is calculated by regex-stripping the price string:
  ```ts
  // cart-context.tsx line 101
  const rawPrice = parseInt(item.product.price.replace(/[^\d]/g, ''), 10) || 0;
  ```
  And checkout does the same:
  ```ts
  // checkout/page.tsx line 122-123
  const numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10) || 0;
  ```
- **User Impact**: If a price is `"৳1,200"`, the regex extracts `1200` (correct). But if it's ever `"৳1,200.50"` or stored differently, parsing may break. More importantly, the **client-sent subtotal, deliveryCharge, and grandTotal are passed to the server** in the order action.
- **Mitigation**: The backend does recalculate everything server-side in [order-service.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/services/order-service.ts#L118-L192), so the security risk is mitigated. But the UX risk of displaying wrong prices on checkout remains.
- **Fix**: Store numeric prices as numbers in the cart, not formatted strings.
- **Priority**: **P1**

---

### H3. Order Success Page Has No Auth / Ownership Check

- **Issue**: [order-success/[id]/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/order-success/[id]/page.tsx) fetches the order by ID and displays it without checking who is viewing it.
- **User Impact**: Anyone with an order number (e.g., `NL-123456`) can view the order success page, including the customer's phone number, payment method, and transaction ID.
- **Technical Cause**: No `getServerSession` check, no ownership verification.
- **Fix**: Either restrict to authenticated owner, or limit what information is shown on the public success page (e.g., only show order number and a "Thank you" message).
- **Priority**: **P1 — Privacy concern**

---

### H4. Account Sidebar Has Hardcoded WhatsApp Number

- **Issue**: [account-sidebar.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/account-sidebar.tsx#L225) has `href="https://wa.me/8801712345678"` hardcoded — this is a placeholder number, not the real store WhatsApp.
- **User Impact**: Customer clicks "Need help?" and reaches the wrong number.
- **Fix**: Use the store's dynamic WhatsApp number from store settings, or pass it as a prop.
- **Priority**: **P1**

---

### H5. No Cart Quantity Limit Enforcement

- **Issue**: [cart-context.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/context/cart-context.tsx#L58-L69) `addToCart()` has no upper bound on quantity. The cart drawer's quantity controls also have no stock-aware max limit.
- **User Impact**: User can add 999 of an item to cart (even if stock is 5), only to discover at checkout that the order fails.
- **Fix**: Pass stock information with cart items, enforce max quantity in both `addToCart` and the quantity increment UI. The backend catches this at order creation, but the UX should prevent it earlier.
- **Priority**: **P1**

---

## Medium Priority Issues 🟡

### M1. Checkout Not Auth-Protected

- **Issue**: [checkout/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/checkout/page.tsx) is a client component with no auth check. An unauthenticated user can fill out the entire checkout form. The `placeOrderAction` will create an order with `userId: undefined`.
- **User Impact**: Guest orders work (which may be intentional), but the customer can't track them later since no `user_id` is associated.
- **Fix**: If guest checkout is intentional, make it explicit. If not, add auth gating.
- **Priority**: **P2**

---

### M2. Checkout Doesn't Pre-fill From Saved Data

- **Issue**: Even for authenticated users, checkout starts with all fields empty. No attempt to pre-fill name, phone, or address from the user's profile or order history.
- **User Impact**: Returning customers must re-type everything every time.
- **Fix**: Fetch user profile data and/or last order's shipping address to pre-fill the form.
- **Priority**: **P2**

---

### M3. Cart Persistence via localStorage Has Hydration Risk

- **Issue**: [cart-context.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/context/cart-context.tsx#L30-L42) initializes state from `localStorage` during `useState`, which runs during SSR where `window` is undefined. The `typeof window !== 'undefined'` check prevents a crash, but can cause hydration mismatches.
- **User Impact**: Potential visual flicker on first load — cart badge shows 0 then jumps to the real count.
- **Fix**: Initialize with empty array and load from localStorage in a `useEffect`.
- **Priority**: **P2**

---

### M4. `handlePlaceOrder` Doesn't Prevent Double Submission Properly

- **Issue**: The `isSubmitting` state disables the button, but if the request takes long and the user navigates away and back (or the form somehow re-renders), `isSubmitting` resets. The backend deduplication check (5-second window) mitigates this but is narrow.
- **User Impact**: Edge case where duplicate orders might be created.
- **Fix**: The backend deduplication is good. Additionally, consider redirecting immediately after `clearCart()` even before the router push completes.
- **Priority**: **P2**

---

### M5. Account Overview Greeting Uses Server-Side Time

- **Issue**: [account/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/page.tsx#L25-L36) `getGreeting()` runs server-side, meaning it uses the deployment server's timezone (likely UTC), not the customer's local time.
- **User Impact**: A customer in Bangladesh (UTC+6) browsing at 8 PM local time might see "Good morning" because the server is in UTC (2 PM).
- **Fix**: Either make the greeting client-side, or remove the time-based greeting.
- **Priority**: **P2**

---

### M6. Duplicate `CreateOrderParams` Interface Declaration

- **Issue**: [order-service.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/services/order-service.ts) declares `CreateOrderParams` twice (lines 6-24 and lines 97-116). The second declaration adds `couponCode` which the first doesn't have.
- **User Impact**: TypeScript allows this due to interface merging, but it's confusing and error-prone.
- **Fix**: Remove the duplicate declaration and merge into one.
- **Priority**: **P2**

---

### M7. Wishlist Remove Button Inside Link Creates Event Conflict

- **Issue**: [wishlist/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/wishlist/page.tsx#L164-L171) has a `<button>` (Remove) nested inside a `<Link>` (product card). Clicking Remove will also trigger navigation.
- **User Impact**: When customer clicks "Remove from Wishlist", they may get navigated to the product page instead of (or in addition to) removing the item.
- **Fix**: Move the button outside the Link, or add `e.preventDefault()` and `e.stopPropagation()`.
- **Priority**: **P2**

---

## Low Priority / Polish 🟢

### L1. FREE_SHIPPING_THRESHOLD Hardcoded in Cart Drawer

- **Issue**: [cart-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/cart-drawer.tsx#L10) has `const FREE_SHIPPING_THRESHOLD = 3000;` — this should ideally come from store settings.
- **Priority**: **P3**

### L2. Fallback Unsplash Images Throughout Codebase

- **Issue**: Multiple components use the same Unsplash fallback URL. If Unsplash is ever rate-limited or changes their URL scheme, all fallbacks break simultaneously.
- **Fix**: Use a local fallback image in `/public/images/`.
- **Priority**: **P3**

### L3. DELIVERY_CHARGES Constant Used in Addresses But Not in Checkout

- **Issue**: [addresses/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/addresses/page.tsx#L6) imports `DELIVERY_CHARGES` from constants, but checkout fetches charges from the server. This could cause display inconsistency.
- **Priority**: **P3**

### L4. `/shop` Route Duplicates `/products` Route

- **Issue**: Both [shop/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/shop/page.tsx) and [products/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/products/page.tsx) render `<ShopView />` — they're functionally identical.
- **Fix**: Redirect one to the other.
- **Priority**: **P3**

---

## Performance Findings

| Area | Finding | Severity |
|------|---------|----------|
| **Product Details Navigation** | No `loading.tsx` — page blocks until all API data resolves (product, settings, category, related products). Two sequential `Promise.all` calls in series at [products/[id]/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/products/[id]/page.tsx#L80-L92). | 🟠 High |
| **Collection Page Navigation** | No `loading.tsx` — blocks until collection + products resolve. | 🟠 High |
| **Image Optimization** | `next/image` used correctly with `sizes` prop. Cloudinary and Unsplash URLs are configured in `next.config.ts`. | ✅ Good |
| **API Waterfall** | Product details page has two sequential `Promise.all` — first fetches product + settings, then fetches category + related. These could be parallelized. | 🟡 Medium |
| **Cart Drawer** | Uses CSS transitions (not Framer Motion) for open/close — lightweight. | ✅ Good |
| **Framer Motion** | Used tastefully for wishlist animations, stagger effects, hero crossfade. Not excessive. | ✅ Good |

---

## Authentication & Redirect Findings

| Flow | Status | Notes |
|------|--------|-------|
| **Login** | ✅ Works | Uses `signIn('credentials', { redirect: false })`, handles errors inline |
| **Google Login** | ⚠️ Risky | `GOOGLE_REDIRECT_URI` points to localhost. If Vercel env overrides aren't set, Google OAuth fails in production |
| **Logout** | 🔴 Broken in Prod | `nextAuthSignOut({ callbackUrl: '/login' })` — relative URL, but NextAuth resolves it against `NEXTAUTH_URL` which is localhost |
| **Protected Routes** | ⚠️ Partial | Middleware at `src/proxy.ts` covers `/account` and `/dashboard`, but file naming may not match Next.js convention (`middleware.ts`) |
| **Already-Logged-In → Login** | ✅ Works | Middleware redirects to `/account` or `/dashboard` |
| **Session Expiry** | ⚠️ No UX | No toast/modal when session expires. Pages just silently fail. |

---

## Checkout & Order Findings

| Area | Status | Notes |
|------|--------|-------|
| **Empty cart** | ✅ Handled | Clear message + CTA to shop |
| **Server-side price validation** | ✅ Strong | Backend recalculates subtotal, delivery charge, coupon discount, and grand total independently |
| **Stock check** | ✅ Strong | Backend verifies stock before creating order |
| **Coupon validation** | ✅ Strong | Backend re-validates coupon at order time |
| **Deduplication** | ✅ Good | 5-second window check prevents exact duplicate orders |
| **Double-click protection** | ⚠️ Partial | Button disabled via `isSubmitting`, but no guard against `isSubmitting` being reset |
| **Guest checkout** | ⚠️ Ambiguous | Checkout works without auth, order gets `user_id: null`, customer can't track later |
| **Order success** | 🔴 No auth | Any user can view any order's success page by changing the URL |
| **Order details** | ✅ Protected | Checks session + ownership at [orders/[id]/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/orders/[id]/page.tsx#L78-L79) |
| **Cancel order** | ✅ Protected | [order.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/actions/order.ts#L45-L63) verifies session + ownership + status |

---

## Mobile UX Findings

| Area | Status | Notes |
|------|--------|-------|
| **Navbar** | ✅ Fixed | Recent fix synchronized bg/text colors on mobile |
| **Mobile nav drawer** | ✅ Good | Left-slide drawer with collections, backdrop close |
| **Account sidebar** | ✅ Good | Mobile bottom sheet portal |
| **Product cards** | ✅ Responsive | Grid adapts: 1-col mobile, 2-col tablet, 3-col desktop |
| **Checkout on mobile** | ✅ Functional | Single-column layout stacks correctly |
| **Cart drawer** | ✅ Functional | Full-width on mobile with proper scroll |
| **Order details mobile** | ✅ Good | Vertical timeline for mobile, horizontal for desktop |

---

## Accessibility Findings

| Area | Finding | Severity |
|------|---------|----------|
| **Form labels** | All form inputs have labels | ✅ Good |
| **Icon buttons** | All icon-only buttons have `aria-label` | ✅ Good |
| **Mobile drawer** | Has backdrop click-to-close and body scroll lock | ✅ Good |
| **Focus management** | Cart drawer and mobile drawer don't trap focus (keyboard users can tab outside the open drawer) | 🟡 Medium |
| **Color contrast** | `#5e5e5b` on `#fbf9f8` — contrast ratio ~4.3:1, borderline for small text (WCAG AA requires 4.5:1) | 🟡 Medium |
| **Keyboard navigation** | No visible focus indicators on custom styled inputs | 🟡 Medium |

---

## Security Findings

| Area | Finding | Severity |
|------|---------|----------|
| **Order ownership** | ✅ Order details page checks ownership | Good |
| **Cancel order** | ✅ Server action verifies ownership + status | Good |
| **Order success page** | 🔴 No ownership check — exposes phone, payment info | Critical |
| **Server-side price calc** | ✅ Backend is source of truth for all order amounts | Good |
| **Coupon server validation** | ✅ Re-validated at order time | Good |
| **Secrets in .env.local** | 🔴 Real credentials in plain text file | Critical |
| **Admin routes** | ✅ Middleware checks admin role | Good |

---

## Broken / Incorrect Behavior

1. **Saved Addresses page**: Shows hardcoded fake data, not connected to any database
2. **Wishlist remove button**: Nested inside `<Link>`, causing conflicting click behavior
3. **Account sidebar WhatsApp**: Points to placeholder number `8801712345678`
4. **Greeting timezone**: Shows server timezone instead of customer's local time

---

## Recommended Fix Roadmap

### Phase 1 — Critical Production Fixes (Before going live)

| # | Fix | Files |
|---|-----|-------|
| 1 | Set `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, `GOOGLE_REDIRECT_URI` in Vercel dashboard to production URL. Remove `GOOGLE_REDIRECT_URI` env if NextAuth auto-computes it. | Vercel dashboard |
| 2 | Add `.env.local` to `.gitignore`, rotate all exposed secrets | `.gitignore`, Vercel dashboard |
| 3 | Remove or gate Saved Addresses page (it's fake data) | [addresses/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/addresses/page.tsx) |
| 4 | Add auth/ownership check to Order Success page or limit displayed info | [order-success/[id]/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/order-success/[id]/page.tsx) |
| 5 | Verify `src/proxy.ts` is actually being used as middleware (Next.js expects `middleware.ts`) | [proxy.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/proxy.ts) |
| 6 | Fix hardcoded WhatsApp number in account sidebar | [account-sidebar.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/account-sidebar.tsx#L225) |

### Phase 2 — UX & Performance

| # | Fix | Files |
|---|-----|-------|
| 7 | Add `loading.tsx` skeletons for `products/[id]`, `collections/[slug]`, `account`, `account/orders`, `account/orders/[id]` | New files |
| 8 | Parallelize product details API calls (merge two `Promise.all` into one) | [products/[id]/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/products/[id]/page.tsx#L80-L92) |
| 9 | Store numeric price in cart instead of formatted string | [cart-context.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/context/cart-context.tsx) |
| 10 | Add cart quantity max limit based on stock | [cart-context.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/context/cart-context.tsx) |
| 11 | Fix cart localStorage hydration (load in useEffect, not useState) | [cart-context.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/context/cart-context.tsx) |
| 12 | Pre-fill checkout form from user profile/last order | [checkout/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/checkout/page.tsx) |
| 13 | Move greeting to client-side for correct timezone | [account/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/page.tsx) |

### Phase 3 — Polish

| # | Fix | Files |
|---|-----|-------|
| 14 | Replace Unsplash fallback URLs with local `/public/images/placeholder.jpg` | Multiple files |
| 15 | Redirect `/shop` to `/products` (or vice versa) | Route config |
| 16 | Remove duplicate `CreateOrderParams` interface | [order-service.ts](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/services/order-service.ts) |
| 17 | Fix wishlist remove button nested inside Link | [wishlist/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/account/wishlist/page.tsx) |
| 18 | Add focus trapping to cart drawer and mobile nav drawer | [cart-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/cart-drawer.tsx), [mobile-nav-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/layout/mobile-nav-drawer.tsx) |
| 19 | Improve color contrast for secondary text (`#5e5e5b` → darker shade) | Global design tokens |

---

## Final Verdict

### **Needs Important Fixes**

The storefront has a **strong foundation** — the visual design is polished, the backend order flow is properly secured with server-side validation, and the component architecture is clean. However, the combination of **exposed secrets**, **localhost production redirects**, **fake addresses page**, and **missing loading states** means the storefront is **not yet production-ready** for real customers.

Phase 1 fixes (6 items) are required before launch. Phase 2 will significantly improve perceived performance and UX. Phase 3 is polish.
