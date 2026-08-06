# Nabab Lungi — Storefront Animation & Motion Roadmap

## 1. Purpose

This document serves as the **SINGLE SOURCE OF TRUTH** for the entire Nabab Lungi customer-facing storefront animation, motion-design, and micro-interaction implementation.

The primary objective of this motion system is to make the storefront feel:
- **Premium** & **Sophisticated**
- **Elegant** & **Calm**
- **Modern** & **Minimal**
- **Smooth** & **Responsive**
- **Lively** & **Story-Driven**
- **Professional** & **Trustworthy**

Nabab Lungi is a Bangladeshi premium handcrafted lungi brand. Motion must honor and reflect the craftsmanship, heritage, and luxury positioning of the brand. Animations are included strictly to enhance user experience, communicate UI hierarchy, provide clear interaction feedback, and guide customer focus — **never** as decorative or distracting eye-candy.

---

## 2. Core Animation Philosophy

1. **Purposeful Motion**: Every animation must serve a clear UX purpose (e.g., feedback on user actions, indicating spatial orientation, smoothing visual state changes, or guiding storytelling).
2. **Subtle & Premium**: Premium positioning requires restraint. Prefer soft, smooth, calm transitions over dramatic, flashy, or cartoon-like effects.
3. **Non-Intrusive**: Motion must never impede, slow down, or distract users from browsing products, adding items to cart, or completing checkout.
4. **Predictable & Responsive**: UI state changes should feel immediate and natural. User input triggers instant visual feedback with zero perceptible delay.
5. **State & Hierarchy Communication**: Motion should clearly demonstrate where elements originate from, where they go when dismissed, and how UI layers relate spatially (e.g., drawers sliding from edges, modals scaling subtly from origin).
6. **Brand Alignment**: Reflect the warmth, dignity, and heritage of traditional Bengali handloom weaving with refined, unhurried ease-out transitions.
7. **Accessibility First**: Visual motion is secondary to usability. Respect user motion preferences (`prefers-reduced-motion`) without breaking functionality.

---

## 3. Technical Principles

1. **CSS First**: Prefer CSS transitions (`transition-all`, `transform`, `opacity`) and Tailwind CSS utilities for simple state changes, hover effects, basic accordions, color swaps, and static transforms.
2. **Framer Motion for Coordinated Lifecycle Motion**: Use Framer Motion selectively when coordinated entry/exit lifecycle management (`AnimatePresence`), staggered children lists, or viewport-triggered scroll reveals (`whileInView`) provide genuine engineering and maintenance value.
3. **Centralized & Reusable Utilities**: Implement reusable animation components and variants (e.g., `<RevealOnScroll>`, `<FadeIn>`, `<StaggerContainer>`) rather than inventing ad-hoc inline animation properties across individual pages.
4. **Hardware Acceleration**: Animate strictly GPU-friendly properties: `transform` (translate, scale, rotate) and `opacity`. Avoid animating layout geometry (`width`, `height`, `margin`, `padding`, `top`, `left`) directly unless utilizing CSS grid-rows or GPU transform scaling.
5. **Zero Layout Shift (CLS)**: Ensure animations do not cause layout recalculations or cumulative layout shifts during or after playback.
6. **Hydration & SSR Compatibility**: Ensure all animated components execute cleanly within Next.js App Router (React Server Components / Client Components boundary) without causing hydration mismatches or client-side rendering flashes.

---

## 4. Accessibility & Reduced Motion

**Mandatory Requirement**: All motion implementations MUST strictly respect the user's OS and browser `prefers-reduced-motion: reduce` settings.

### Standards & Expectations
- **Fallback Behavior**: When `prefers-reduced-motion` is active:
  - Disable scroll-triggered entrance animations (display content in final state immediately).
  - Disable staggered list entrances.
  - Replace slide/fade transitions with instant state switches or very brief opacity fades (≤ 100ms).
  - Disable hover scaling and rotation effects.
- **Functionality Independence**: No core storefront feature, product information, checkout step, navigation link, or call-to-action may depend on animation completion to be visible or interactive.
- **Tailwind & CSS Integration**: Utilize Tailwind `motion-reduce:` variants (`motion-reduce:transition-none`, `motion-reduce:transform-none`) and React Framer Motion's `useReducedMotion()` hook.

---

## 5. Performance Rules

1. **Avoid Animation Jank**: Maintain a consistent 60fps (or 120fps on high-refresh displays) performance target.
2. **Limit Simultaneous Animations**: Avoid staggering more than 6–8 elements at once, especially inside large product grids or collection catalogs on mobile devices.
3. **Viewport Optimization (`once: true`)**: All scroll-triggered section reveals must execute only once per page view (`viewport={{ once: true }}`) to eliminate continuous scroll-listener overhead.
4. **No Continuous Loopers**: Avoid continuous looping animations (e.g., perpetual floating, pulsing banners, background gradient shifts) except standard small loading spinners.
5. **No Mobile Parallax**: Avoid JavaScript-driven scroll-position parallax calculation.
6. **Mobile Testing**: Test all animation implementations on low-to-mid-tier mobile devices to ensure zero frame drops or input latency.

---

## 6. SEO / Next.js Considerations

1. **Preserve SSR & Static Generation**: Do not move server-rendered text, product headings, metadata, or JSON-LD structured data into client-rendered wrapper components solely to apply motion.
2. **Server-Client Component Separation**: Maintain clean boundaries. Server Components pass pre-rendered markup as `children` to thin client-side animation wrappers.
3. **Crawlability**: Ensure search engine bots receive 100% of HTML content, titles, prices, descriptions, and links on initial response regardless of client-side animation state.
4. **Core Web Vitals**: Monitor LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) impact. Never delay LCP images (e.g., hero background, main product image) behind animation triggers.

---

## 7. Animation System / Design Tokens

The following animation design tokens will be established and standardized in Phase 1:

### Durations
- **Micro Interaction** (`--duration-micro`): `150ms` (Buttons, heart toggles, active chips, checkboxes)
- **Small Interaction** (`--duration-sm`): `200ms` (Dropdowns, tooltips, active states)
- **Standard Transition** (`--duration-std`): `300ms` (Modal overlays, side drawers, accordions, tabs)
- **Section Reveal** (`--duration-reveal`): `500ms` (Scroll reveals, staggered card grids)
- **Hero / Narrative** (`--duration-hero`): `700ms` (Hero headline entrance, storytelling image crossfade)

### Easing Curves
- **Default / Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` (Balanced ease-in-out)
- **Enter / Ease-Out Expo**: `cubic-bezier(0.16, 1, 0.3, 1)` (Fast entrance, smooth unhurried deceleration)
- **Exit / Ease-In**: `cubic-bezier(0.4, 0, 1, 1)` (Accelerating exit)
- **Emphasis**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Subtle overshoot — use sparingly for micro badges)

### Motion Distances
- **Small** (`--move-sm`): `8px` (Dropdown offsets, active filter chip entry)
- **Medium** (`--move-md`): `16px` (Card fade-ups, list stagger offsets)
- **Large** (`--move-lg`): `24px–32px` (Section heading reveals, hero text entrance)

### Common Animation Patterns
- **Fade**: Opacity `0 -> 1`
- **Fade + Slide Up**: Opacity `0 -> 1`, TranslateY `16px -> 0px`
- **Scale Touch Feedback**: Scale `1 -> 0.97` on active press
- **Drawer Slide**: TranslateX/Y `100% -> 0%`
- **Modal Scale**: Opacity `0 -> 1`, Scale `0.95 -> 1.0`
- **Accordion Expand**: CSS Grid `grid-rows-[0fr] -> grid-rows-[1fr]`
- **List Stagger**: Parent orchestrates 80ms stagger delay between children

---

## 8. Shared Animation Components / Utilities

To prevent duplicate animation logic across pages, the following shared components will be introduced in Phase 1:

1. **`<RevealOnScroll>`**: Client wrapper utilizing Framer Motion `whileInView` for server-rendered page sections (viewport `once: true`, distance 20px, duration 500ms).
2. **`<StaggerContainer>` & `<StaggerItem>`**: Orchestrated entrance wrapper for grids (product cards, bento grids, brand values).
3. **`<AnimatePresenceWrapper>`**: Clean client wrapper for conditional overlays (mobile menu, user dropdown, toast popups) enforcing exit transitions prior to unmounting.
4. **`Button` Press Utility**: Standardized `active:scale-[0.97] transition-transform duration-150 motion-reduce:transform-none` added to global Button component.

---

## 9. Phase Roadmap

### Phase 1 — Essential UX Motion & Critical Fixes

**Objective:**
Fix existing broken/abrupt animation behaviors, establish the central motion tokens/utilities, and implement high-priority interaction feedback.

**Priority:** Critical (P0)

**Dependencies:** None

**Affected Pages:**
- Homepage (`/`)
- Product Details Page (`/products/[id]`)
- Global Header / Navbar

**Affected Components:**
- Header / Mobile Navigation (`src/components/layout/header.tsx`)
- Toast Notifications (`src/providers/toast-provider.tsx`)
- Hero Section (`src/features/landing/components/hero-section.tsx`)
- Product Gallery (`src/features/products/components/product-gallery.tsx`)
- Button (`src/components/ui/button.tsx`)

**Tasks:**
- [x] Fix mobile navbar menu: Replace instant conditional render with `AnimatePresence` slide-down enter/exit animation.
- [x] Fix toast notifications: Implement smooth `AnimatePresence` slide/fade exit animation prior to unmount.
- [x] Fix hero carousel crossfade: Replace broken `key` container remount with `AnimatePresence` image crossfade.
- [x] Add staggered entrance delays to Hero text (h1, subtitle, description, CTA buttons).
- [x] Implement main image crossfade on Product Details gallery thumbnail switch.
- [x] Add active count badge pulse animation to Header Shopping Bag icon on item add.
- [x] Add active count badge pulse animation to Header Wishlist icon on item add.
- [x] Add global `active:scale-[0.97]` touch/click press feedback to `Button` component.
- [x] Establish centralized animation design tokens and motion utility wrappers (`<RevealOnScroll>`).
- [x] Verify `prefers-reduced-motion` compliance across all Phase 1 components.

**UX Goal:**
Eliminate jarring unmounts and visual popping. Make main actions (adding to cart, opening menu, switching product images) feel instant, responsive, and high-end.

**Performance Considerations:**
Minimal overhead. Ensure crossfade images use `opacity` transitions with `absolute` positioning to prevent layout reflows.

**Accessibility Considerations:**
Mobile menu and toast notifications must remain fully keyboard accessible and honor `prefers-reduced-motion`.

**Acceptance Criteria:**
- Mobile menu slides smoothly open and closed without layout jumps.
- Toasts fade/slide away smoothly on auto-dismiss and close click.
- Hero slide transitions crossfade without flashing background.
- Cart and wishlist count badges pulse on update.
- Gallery main image transitions smoothly when clicking thumbnails.

**Status:** 🟢 Completed

---

### Phase 2 — Premium Micro-interactions & Overlays

**Objective:**
Add refined entrance/exit animations for modals, dropdowns, cart item removal, wishlist item removal, and account navigation.

**Priority:** High (P1)

**Dependencies:** Phase 1 (Motion tokens & `AnimatePresenceWrapper`)

**Affected Pages:**
- Shop / Products Page (`/products`)
- Cart Drawer
- Customer Account Dashboard (`/account/*`)
- Wishlist Page (`/account/wishlist`)
- Checkout Page (`/checkout`)

**Affected Components:**
- Header User Dropdown (`src/components/layout/header.tsx`)
- Cart Drawer (`src/components/shared/cart-drawer.tsx`)
- Confirm Modal (`src/components/ui/confirm-modal.tsx`)
- Account Sidebar (`src/components/shared/account-sidebar.tsx`)
- Product Info (`src/features/products/components/product-info.tsx`)

**Tasks:**
- [ ] Add smooth exit fade/slide animation to Header User Dropdown menu.
- [ ] Add smooth exit zoom/fade animation to Confirm Modal dialog.
- [ ] Add smooth exit animation (fade-out + height collapse) for Cart item removal in Cart Drawer.
- [ ] Add smooth exit animation for Wishlist item removal on Wishlist page.
- [ ] Add mobile account menu slide-down/up exit animation in Account Sidebar.
- [ ] Add press feedback to Add to Cart and Buy Now buttons on Product Details page.
- [ ] Add form error shake keyframe animation for Checkout validation failures.
- [ ] Add coupon code apply success/error visual state transition on Checkout page.

**UX Goal:**
Provide reassuring, delightful micro-feedback for user actions (deleting items, applying coupons, opening user settings) so the UI feels alive and responsive.

**Performance Considerations:**
Ensure list item exit animations (`AnimatePresence` layout transitions) use CSS transforms to avoid layout thrashing.

**Accessibility Considerations:**
Form errors must be announced to screen readers. Reduced motion must disable shake animations.

**Acceptance Criteria:**
- Removing an item from cart drawer or wishlist slides/fades out smoothly instead of disappearing instantly.
- User dropdown menu and confirm modal animate cleanly on both open and close.
- Checkout validation failures display a subtle error indicator.

**Status:** ⏳ Not Started

---

### Phase 3 — Storytelling & Scroll Motion

**Objective:**
Introduce subtle scroll-triggered entrance animations across key landing and brand pages to enhance visual hierarchy and narrative storytelling.

**Priority:** Medium (P1–P2)

**Dependencies:** Phase 1 (`<RevealOnScroll>`, `<StaggerContainer>`)

**Affected Pages:**
- Homepage (`/`)
- About Us Page (`/about`)
- Collections Overview (`/collections`)
- Shop / Product Listing Page (`/products`)

**Affected Components:**
- Best Sellers (`src/features/landing/components/best-sellers.tsx`)
- Curated Collections (`src/features/landing/components/curated-collections.tsx`)
- Heritage Brand Story (`src/features/landing/components/brand-story.tsx`)
- Nabab Standard (`src/features/landing/components/nabab-standard.tsx`)
- New Arrivals (`src/features/landing/components/new-arrivals.tsx`)

**Tasks:**
- [ ] Apply `<RevealOnScroll>` fade-up to Homepage sections (The Nabab Standard, Curated Collections, Best Sellers, New Arrivals, Brand Story).
- [ ] Implement staggered entrance for Nabab Standard icon cards.
- [ ] Implement staggered entrance for Best Sellers & New Arrivals product card grids.
- [ ] Apply `<RevealOnScroll>` staggered reveals across all 9 editorial sections on the About Us page (`/about`).
- [ ] Add staggered card entrance for Craftsmanship stages (01–05) and Brand Pillars on About page.
- [ ] Add staggered entrance for Collections bento grid cards on `/collections` page.
- [ ] Add subtle initial load stagger for Shop page product grid.

**UX Goal:**
Transform static page scrolling into an engaging, editorial storytelling experience that communicates luxury, artisan craftsmanship, and brand legacy.

**Performance Considerations:**
All scroll triggers must use `once: true`. Do not animate more than 8 cards simultaneously.

**Accessibility Considerations:**
`prefers-reduced-motion` must immediately display all sections in their final visible state without scroll triggers.

**Acceptance Criteria:**
- Sections fade up gracefully into view as the user scrolls down the page.
- Craftsmanship steps on About page reveal sequentially.
- No page jitter or scroll lag on mobile devices.

**Status:** ⏳ Not Started

---

### Phase 4 — Optional Polish & State Transitions

**Objective:**
Refine empty states, loading skeletons, order success confirmation sequences, and edge-case visual transitions.

**Priority:** Low (P2–P3)

**Dependencies:** Phase 1 & Phase 2

**Affected Pages:**
- Order Success Page (`/order-success/[id]`)
- Customer Account Overview & Order History (`/account/orders`)
- Shop Page (`/products`)

**Affected Components:**
- Shop Pagination (`src/features/products/components/shop-pagination.tsx`)
- Order Success Card (`src/app/(store)/order-success/[id]/page.tsx`)

**Tasks:**
- [ ] Add sequenced entrance animation for Order Success page (Checkmark scale-in → Badge fade → Heading → Summary details).
- [ ] Add smooth crossfade between loading skeleton and populated grid on Shop page filter change.
- [ ] Add smooth fade transition when toggling between Empty state and populated list on Wishlist & Orders pages.
- [ ] Add subtle hover elevation to Account overview dashboard metric cards.

**UX Goal:**
Provide a polished, complete end-to-end feeling across post-purchase and edge-case UI states.

**Performance Considerations:**
Keep state transitions under 250ms to ensure fast responsiveness.

**Accessibility Considerations:**
Order success information must be immediately available to assistive tech.

**Acceptance Criteria:**
- Order success page feels calm, trustworthy, and premium.
- Filter switching on Shop page transitions smoothly without harsh content flickering.

**Status:** ⏳ Not Started

---

## 10. Task Tracking System

All implementation tasks MUST use checkboxes and status labels:

- ⏳ **Not Started** — Planned but work has not begun.
- 🟡 **In Progress** — Active implementation under way.
- ⚠️ **Needs Review** — Code written, pending multi-device and reduced-motion verification.
- 🟢 **Completed** — Verified and passed all criteria.
- 🔴 **Blocked** — Prevented by external dependency or issue.
- ⏸️ **Deferred** — Postponed to a future milestone.

> **Rule**: Never mark a task 🟢 Completed without passing mobile, desktop, and reduced-motion verification.

---

## 11. Phase Completion Rules

A phase may only be marked **🟢 Completed** when ALL of the following criteria are met:

1. All tasks within the phase are checked `[x]`.
2. Desktop behavior is verified in browser.
3. Mobile behavior is verified on small screen viewports (down to 320px).
4. Responsive breakpoint scaling (`sm`, `md`, `lg`) is clean.
5. Reduced-motion (`prefers-reduced-motion: reduce`) operates correctly without breaks.
6. Zero console errors or warnings introduced.
7. Zero Next.js SSR / React hydration errors.
8. Existing business logic, backend calls, and DB operations remain 100% functional.
9. No performance regressions (LCP / CLS) observed.
10. Visual aesthetics align with Nabab Lungi's premium brand guidelines.

If work is implemented but pending verification, mark as **⚠️ Needs Review**.

---

## 12. Implementation History

## Phase 1 — Essential UX Motion & Critical Fixes
**Status:** 🟢 Completed
**Completed Date:** 2026-08-06

#### Implemented Features
- Framer Motion integrated with React 19 / Next.js 16 App Router.
- Centralized motion design tokens and `<RevealOnScroll>` utility component created in `src/components/ui/motion-wrappers.tsx`.
- Mobile navigation menu slide-down/up enter & exit transition (`AnimatePresence` + `motion.div`).
- Toast notifications smooth slide/fade enter & exit transition (`AnimatePresence` + `motion.div`).
- Hero slide carousel image crossfade (`AnimatePresence` + `motion.div`).
- Hero text staggered entrance animation delays.
- Product Details gallery main image crossfade on thumbnail switch.
- Cart and Wishlist header badge count scale-pulse animation on item addition.
- Global `Button` component active press feedback (`active:scale-[0.97]`).

#### Files & Components Changed
- `package.json`
- `src/components/ui/motion-wrappers.tsx`
- `src/components/ui/button.tsx`
- `src/providers/toast-provider.tsx`
- `src/components/layout/header.tsx`
- `src/features/landing/components/hero-section.tsx`
- `src/features/products/components/product-gallery.tsx`

#### Verification Checklist
- [x] Desktop verified
- [x] Mobile verified
- [x] Responsive verified
- [x] Reduced motion verified
- [x] Zero console errors
- [x] Zero hydration errors
- [x] Existing functionality intact

---

## 13. Roadmap Change Log

Any architectural adjustments or scope modifications to this roadmap must be logged here:

### 2026-08-06
- **Change**: Phase 1 implementation complete.
- **Reason**: All Phase 1 tasks implemented, tested, and verified.
- **Affected Phase**: Phase 1 — Essential UX Motion & Critical Fixes.

---

## 14. Instructions for Future AI/Antigravity Sessions

1. **ALWAYS** read this file before beginning any storefront animation or UI transition work.
2. **ALWAYS** inspect the current code first to verify existing implementations before starting a task.
3. **NEVER** skip to a later phase if an earlier required dependency phase is incomplete.
4. **NEVER** modify or delete roadmap requirements to make implementation easier.
5. **REUSE** central animation components (`<RevealOnScroll>`, `<StaggerContainer>`) rather than writing ad-hoc inline animation logic.
6. **DO NOT** install Framer Motion or external animation packages unless explicitly required by the active phase.
7. **KEEP** animations subtle, minimal, and calm. Avoid bouncy, cartoonish, or elastic spring motion.
8. **DO NOT** touch or modify admin panel dashboard code (`/app/(admin)/*` or `/components/admin/*`) under this storefront roadmap.
9. **ALWAYS** test mobile responsiveness and layout boundaries.
10. **ALWAYS** include `prefers-reduced-motion` fallbacks.
11. **NEVER** break existing backend services, MongoDB queries, server actions, or authentication hooks.
12. **UPDATE** task status checkboxes and implementation history immediately after completing and verifying a phase.

---

## 15. Implementation Workflow

```
AUDIT (Completed)
  ↓
ROADMAP (Active Document)
  ↓
PHASE 1 (Completed 🟢)
  ↓
IMPLEMENT → VERIFY → UPDATE ROADMAP & HISTORY
  ↓
PHASE 2 (Next Step ⏳)
  ↓
IMPLEMENT → VERIFY → UPDATE ROADMAP & HISTORY
  ↓
PHASE 3 ...
```

**Rule**: Do NOT automatically start the next phase immediately. Each phase must be explicitly reviewed, implemented, tested, verified, and documented before moving forward.

---

## 16. Current Project State

- **Current Active Phase**: Phase 2 — Premium Micro-interactions & Overlays
- **Status**: ⏳ Not Started
- **Next Action**: Review Phase 2 objectives, then begin Phase 2 implementation when requested.

---
*End of Storefront Animation Roadmap.*
