# Nabab Lungi — Storefront Animation Audit

---

## 1. Executive Summary

### Current Animation Maturity: **Early — Functional but Minimal**

The Nabab Lungi storefront has a solid visual design foundation with a clear premium identity, but its motion layer is **thin and inconsistent**. Most interactive elements snap between states rather than transitioning, creating a disconnect between the sophisticated visual design and the way the UI *feels* in motion.

### What Exists Today

- **Hero section**: `fadeInUp` keyframe animation for headline/CTA
- **Cart drawer**: CSS `translate-x` slide-in with backdrop opacity fade
- **Mobile filter drawer & sort sheet**: CSS `translate-y` slide-up/down with backdrop fade *(recently added)*
- **Filter accordions**: CSS Grid `grid-rows` expand/collapse *(recently added)*
- **Collection/product cards**: `group-hover:scale-105` image zoom on hover
- **Loading states**: Tailwind `animate-pulse` and `animate-spin`
- **Dropdowns/modals**: Tailwind `animate-in` utilities (`fade-in`, `slide-in-from-top-2`, `zoom-in-95`)
- **WhatsApp CTA**: `hover:scale-105 active:scale-95` with icon rotation
- **Buttons**: Generic `transition` on color/opacity

### Biggest Opportunities

1. **Homepage section reveal** — All homepage sections appear statically. Scroll-triggered reveals would dramatically improve the sense of quality.
2. **Product card entrance stagger** — Product grids pop in all at once. Staggered fade-up would feel luxurious.
3. **Cart icon count badge** — No animation when cart count changes. A brief pulse would confirm the action.
4. **Mobile menu** — Appears/disappears instantly with no transition. Feels broken on a premium site.
5. **Image gallery switching** — Product images swap without any crossfade.
6. **Toast exit** — Toasts enter with animation but vanish instantly on timeout.

### Biggest Problems

1. **Mobile menu has zero transition** — appears/disappears via conditional render with no animation.
2. **User dropdown menu** relies on `animate-in` but **has no exit animation** — unmounts instantly.
3. **Hero carousel** switches images with a `transition-opacity` class on the container, but since `key` changes cause a full remount, the transition is lost.
4. **No `prefers-reduced-motion` handling** anywhere except the recently added mobile filter components.

### Is Framer Motion Justified?

**Yes, selectively.** Framer Motion is justified for:
- `AnimatePresence` exit animations (mobile menu, dropdown, toast exit, cart drawer)
- Staggered product card entrances
- Scroll-triggered section reveals (via `whileInView`)
- Hero carousel crossfade with `AnimatePresence`

Everything else should remain CSS-only.

### Recommended Motion Philosophy

> *"The motion should be noticed as polished, never as animated."*

- Duration: 200–400ms for interactions, 500–700ms for reveals
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo) for entrances, `ease-in` for exits
- Movement: translate 12–24px for fade-ups, never more than 30px
- No bounce, no spring, no elastic — purely smooth and calm

---

## 2. Current Animation Inventory

| Location | Existing Animation | Technology | Quality | Recommendation |
|---|---|---|---|---|
| [globals.css](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/globals.css) | `@keyframes fadeInUp` + `.animate-fade-in-up` | CSS Keyframes | ✅ Good easing, good feel | Keep. Consider adding `prefers-reduced-motion` |
| [hero-section.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/landing/components/hero-section.tsx) | Hero text `animate-fade-in-up` | CSS class | ✅ Good | No stagger between h1, p, and CTA — all animate simultaneously |
| [hero-section.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/landing/components/hero-section.tsx) | Hero image `transition-opacity duration-700` + `scale-105` | CSS Transition | ⚠️ Broken — `key` prop remounts, killing the crossfade | Replace with `AnimatePresence` crossfade |
| [hero-section.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/landing/components/hero-section.tsx) | CTA hover `hover:scale-105 transition-transform` | CSS Transition | ✅ Good, subtle | Keep |
| [header.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/layout/header.tsx) | Navbar scroll: `transition-all duration-300` | CSS Transition | ✅ Smooth bg/padding transition | Keep |
| [header.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/layout/header.tsx#L238) | ChevronDown `transition-transform duration-200 rotate-180` | CSS Transition | ✅ Good | Keep |
| [header.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/layout/header.tsx#L243) | User dropdown `animate-in fade-in slide-in-from-top-2 duration-150` | Tailwind `animate-in` | ⚠️ Enter only — no exit animation, unmounts instantly | Add exit animation via `AnimatePresence` |
| [header.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/layout/header.tsx#L374) | Mobile menu — conditional `{mobileMenuOpen && (...)}` | None | ❌ No animation at all — instant mount/unmount | Critical: needs slide-down enter + exit |
| [cart-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/cart-drawer.tsx) | Slide from right `translate-x-0/full`, backdrop opacity | CSS Transition | ✅ Clean, uses pointer-events trick | Works well. Could refine easing. |
| [cart-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/cart-drawer.tsx#L81) | Free shipping progress bar `transition-all duration-500` | CSS Transition | ✅ Good | Keep |
| [mobile-filter-drawer.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/products/components/mobile-filter-drawer.tsx) | Slide-up `translate-y-0/full` + backdrop fade + accordion grid-rows | CSS Transition | ✅ Good, recently added | Already includes `motion-reduce` |
| [mobile-sort-modal.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/products/components/mobile-sort-modal.tsx) | Slide-up + backdrop fade | CSS Transition | ✅ Good, recently added | Already includes `motion-reduce` |
| [product-card.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/product-card.tsx) | Image `group-hover/card:scale-105 duration-500` | CSS Transition | ✅ Premium feel | Keep |
| [product-card.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/product-card.tsx#L94) | Quick Add button `translate-y-full → translate-y-0` on hover | CSS Transition | ✅ Excellent | Keep — elegant reveal |
| [product-card.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/product-card.tsx#L87) | Wishlist heart `active:scale-125` | CSS Transition | ✅ Subtle | Keep |
| [curated-collections.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/landing/components/curated-collections.tsx) | Collection card image `group-hover:scale-105 duration-700`, overlay text `-translate-y-1` | CSS Transition | ✅ Good | Keep |
| [collections/page.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/collections/page.tsx) | Collection cards `hover:-translate-y-0.5 duration-500`, arrow `group-hover:translate-x-1.5` | CSS Transition | ✅ Good | Keep |
| [nabab-standard.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/landing/components/nabab-standard.tsx) | Icon circle `group-hover:scale-110 group-hover:bg-[#1b1c1c]` | CSS Transition | ✅ Nice on desktop | Keep |
| [product-gallery.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/products/components/product-gallery.tsx) | Thumbnail opacity `opacity-65 hover:opacity-100`, nav arrows `opacity-0 group-hover:opacity-100` | CSS Transition | ⚠️ No crossfade on main image switch — instant swap | Add crossfade |
| [product-info.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/features/products/components/product-info.tsx) | Wishlist heart `active:scale-125` | CSS Transition | ✅ Subtle | Could add fill animation |
| [whatsapp-cta.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/whatsapp-cta.tsx) | `hover:scale-105 active:scale-95`, icon `group-hover:rotate-12` | CSS Transition | ✅ Good | Keep |
| [toast-provider.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/providers/toast-provider.tsx) | Toast enter `animate-in fade-in slide-in-from-bottom-2` | Tailwind animate-in | ⚠️ Enter only — toasts disappear instantly on removal | Add exit animation |
| [confirm-modal.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/ui/confirm-modal.tsx) | Backdrop `animate-in fade-in`, modal `animate-in zoom-in-95` | Tailwind animate-in | ⚠️ Enter only — no exit animation | Add exit animation |
| [account-sidebar.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/components/shared/account-sidebar.tsx#L196) | Mobile account menu `animate-in slide-in-from-top-2 duration-150` | Tailwind animate-in | ⚠️ Enter only, no exit | Add exit animation |
| [loading.tsx](file:///home/azmain-siam/Documents/Projects/nobab-lungi/src/app/(store)/loading.tsx) | Spinner `animate-spin` | Tailwind utility | ✅ Functional | Keep |
| Loading skeletons | `animate-pulse` across shop, collections, profile, wishlist | Tailwind utility | ✅ Functional | Keep |

---

## 3. Page-by-Page Animation Opportunities

### A. Homepage `/`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Hero text (h1, p, CTA) | Staggered fade-in-up with 100ms delays | Entrance | CSS (add delay classes) | P1 | 🟢 |
| Hero carousel crossfade | Smooth crossfade between banner images instead of remount | State transition | **Framer Motion** (`AnimatePresence` + `motion.div`) | P0 | 🟢 |
| Nabab Standard section | Section fade-up on scroll into view | Scroll reveal | **Framer Motion** (`whileInView`) | P1 | 🟢 |
| Nabab Standard cards | Staggered card entrance on scroll | Scroll reveal | **Framer Motion** (`staggerChildren`) | P2 | 🟢 |
| Curated Collections section heading | Fade-up on scroll | Scroll reveal | **Framer Motion** (`whileInView`) | P1 | 🟢 |
| Collection bento cards | Staggered entrance | Scroll reveal | **Framer Motion** | P2 | 🟡 |
| Best Sellers section | Section heading + product grid staggered entrance | Scroll reveal | **Framer Motion** | P1 | 🟡 |
| New Arrivals section | Same as Best Sellers | Scroll reveal | **Framer Motion** | P1 | 🟡 |
| Brand Story section | Image slide-in from left, text from right | Scroll reveal | **Framer Motion** | P1 | 🟢 |

---

### B. Shop / Product Listing `/products`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Product grid cards | Staggered fade-up on initial load and filter change | Entrance | **Framer Motion** (`AnimatePresence` + `staggerChildren`) | P1 | 🟡 |
| Loading skeleton → content | Crossfade from skeleton to real grid | State transition | **Framer Motion** (`AnimatePresence`) or CSS opacity | P2 | 🟢 |
| Empty state | Fade-in when no results found | State transition | CSS | P2 | 🟢 |
| Desktop sidebar | Already works, no change needed | — | — | — | — |
| Mobile filter drawer | ✅ Already animated (slide-up/down, accordion, backdrop) | — | — | — | — |
| Mobile sort sheet | ✅ Already animated | — | — | — | — |
| Active filter chips | Subtle enter/exit on add/remove | Interaction | **Framer Motion** (`AnimatePresence` + `layoutId`) | P2 | 🟢 |

---

### C. Product Details `/products/[id]`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Image gallery main switch | Crossfade between selected images | State transition | CSS (`opacity transition` with absolute positioning) or **FM** | P0 | 🟢 |
| Thumbnail selection | Active thumbnail border transition ✅ exists | — | — | — | — |
| Gallery nav arrows | ✅ Already opacity-0 → opacity-100 on hover | — | — | — | — |
| Add to Cart button | Press feedback (`active:scale-[0.97]`) + brief success state | Interaction | CSS | P1 | 🟢 |
| Buy Now button | Same press feedback | Interaction | CSS | P1 | 🟢 |
| Wishlist heart toggle | Scale pulse on toggle (exists via `active:scale-125`) | Interaction | CSS | P2 | 🟢 |
| Quantity ±1 | Subtle number crossfade or none (keep fast) | Interaction | CSS or skip | P3 | 🟢 |
| Related Products section | Staggered card entrance on scroll | Scroll reveal | **Framer Motion** | P2 | 🟢 |
| Specifications section | No animation needed — static content | — | — | P3 | — |

---

### D. Collections Page `/collections`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Page heading | Fade-up on mount | Entrance | CSS or **FM** | P2 | 🟢 |
| Collection bento grid cards | Staggered fade-up entrance | Entrance | **Framer Motion** (`whileInView` + `staggerChildren`) | P1 | 🟡 |
| Card hover | ✅ Already has scale + translate effects | — | — | — | — |
| Arrow icon | ✅ Already has `translate-x-1.5` on hover | — | — | — | — |
| Skeleton loading | ✅ Already has `animate-pulse` | — | — | — | — |

---

### E. Collection Details `/collections/[slug]`

Page exists. Should share the same animation patterns as the Shop page. No separate animation system needed.

---

### F. Cart

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Cart drawer slide-in/out | ✅ Already implemented with CSS translate-x | — | — | — | — |
| Cart drawer backdrop | ✅ Already implemented with CSS opacity | — | — | — | — |
| Cart icon badge count | Brief scale pulse when count changes | Interaction | CSS (`scale` keyframe) or **FM** | P0 | 🟢 |
| Cart item removal | Fade-out + height collapse before removal | State transition | **Framer Motion** (`AnimatePresence`) | P1 | 🟢 |
| Quantity ± buttons | Subtle press feedback | Interaction | CSS `active:scale-[0.95]` | P2 | 🟢 |
| Empty cart state | Fade-in when last item removed | State transition | CSS opacity | P2 | 🟢 |
| Free shipping progress bar | ✅ Already has `transition-all duration-500` | — | — | — | — |

---

### G. Checkout `/checkout`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Form validation errors | Subtle shake or highlight border red | Interaction | CSS keyframe | P2 | 🟢 |
| Coupon apply success | Brief green highlight / checkmark fade-in | State transition | CSS | P2 | 🟢 |
| Coupon error | Red border flash | State transition | CSS | P2 | 🟢 |
| Place Order button loading | Spinner inside button + disabled state | State transition | CSS (already exists via other patterns) | P1 | 🟢 |
| Payment method toggle | No animation needed — keep fast and clear | — | — | P3 | — |

> [!IMPORTANT]
> Checkout should **prioritize speed and clarity** over decorative animation. Do not add entrance animations or scroll reveals here.

---

### H. Order Success `/order-success/[id]`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Success checkmark icon | Subtle scale-in entrance (not bouncy) | Entrance | CSS keyframe or **FM** | P1 | 🟢 |
| "Order Confirmed" badge | Fade-in after icon settles | Entrance | CSS (delay) | P2 | 🟢 |
| Thank You heading | Fade-up after badge | Entrance | CSS (delay) | P2 | 🟢 |
| Summary cards | Staggered fade-in | Entrance | CSS (delays) | P2 | 🟢 |

> [!NOTE]
> Keep this trustworthy and calm. No confetti, no excessive celebration. A professional confirmation feel.

---

### I. Order Details `/account/orders/[id]`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Order status timeline | Subtle animated progress indicator (currently static) | Visual enhancement | CSS or **FM** | P2 | 🟢 |
| Status badge | Color-coded, no animation needed | — | — | P3 | — |

---

### J. Customer Account Dashboard

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Mobile account sidebar menu | Currently `animate-in slide-in-from-top-2` enter only — needs exit animation | State transition | **Framer Motion** (`AnimatePresence`) or CSS grid-rows | P1 | 🟢 |
| Desktop sidebar | Static, appropriate — no animation needed | — | — | P3 | — |
| Dashboard stat cards | Subtle stagger on load | Entrance | CSS delays | P2 | 🟢 |
| Quick action cards | Hover scale effect already exists on some | — | — | P3 | — |

---

### K. Wishlist `/account/wishlist`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Wishlist card removal | Fade-out + collapse when removed | State transition | **Framer Motion** (`AnimatePresence`) | P1 | 🟢 |
| Empty state transition | Fade-in when last item removed | State transition | CSS | P2 | 🟢 |
| Navbar wishlist count | Brief pulse when count changes | Interaction | CSS | P1 | 🟢 |

---

### L. About Us `/about`

| Component | Animation Opportunity | Type | CSS / FM | Priority | Perf Risk |
|---|---|---|---|---|---|
| Hero section | Fade-up headline + subtitle with stagger | Entrance | CSS or **FM** | P1 | 🟢 |
| Brand story sections | Scroll-reveal fade-up for each section | Scroll reveal | **Framer Motion** (`whileInView`) | P1 | 🟢 |
| Craftsmanship stages (01–05) | Staggered entrance from left as scrolled into view | Scroll reveal | **Framer Motion** | P1 | 🟢 |
| Brand pillars grid | Staggered card entrance | Scroll reveal | **Framer Motion** | P2 | 🟢 |
| Brand values | Subtle reveal | Scroll reveal | **FM** or CSS | P2 | 🟢 |
| Images | Fade-in on scroll | Scroll reveal | **FM** or CSS `IntersectionObserver` | P2 | 🟢 |
| Final CTA | Fade-up | Entrance | CSS | P2 | 🟢 |

> [!TIP]
> The About page is the **single best candidate** for scroll-based storytelling motion. It's a brand page where visitors expect a premium visual experience.

---

## 4. Global Component Opportunities

| Component | Recommended Motion | Trigger | CSS / FM | Priority |
|---|---|---|---|---|
| **Mobile navbar menu** | Slide-down enter, slide-up exit (height animation) | Open/close toggle | **Framer Motion** (`AnimatePresence`) | **P0** |
| **User dropdown menu** | Fade-in + slide-down enter (✅ exists), fade-out + slide-up exit (❌ missing) | Open/close toggle | **Framer Motion** (`AnimatePresence`) | P1 |
| **Toast notifications** | Enter: ✅ exists. **Exit: ❌ missing** — toasts vanish instantly | Auto-dismiss + manual close | **Framer Motion** (`AnimatePresence`) | P0 |
| **Confirm modal** | Enter: ✅ exists. **Exit: ❌ missing** | Close/confirm | **Framer Motion** (`AnimatePresence`) | P1 |
| **Cart icon badge** | Scale pulse when count changes | Cart add/remove | CSS keyframe | P0 |
| **Wishlist icon badge** | Scale pulse when count changes | Wishlist toggle | CSS keyframe | P1 |
| **ProductCard** | Hover effects ✅ exist, Quick Add ✅ exists | — | — | — |
| **Button component** | Add `active:scale-[0.97]` press feedback globally | Press | CSS | P1 |
| **Loading spinner** | ✅ `animate-spin` already present | — | — | — |
| **Loading skeletons** | ✅ `animate-pulse` already present | — | — | — |
| **WhatsApp CTA** | ✅ Hover/active scale + icon rotate already present | — | — | — |

---

## 5. Recommended Framer Motion Usage

Only where Framer Motion provides **clear value over CSS**:

| Component | Animation | Why FM? | Why Not CSS? | Complexity | Perf |
|---|---|---|---|---|---|
| **Mobile navbar menu** | Height expand/collapse + fade | `AnimatePresence` exit animation — CSS can't animate unmount | Conditional rendering prevents CSS exit | Low | 🟢 |
| **User dropdown** | Fade+slide enter/exit | Same — needs exit before unmount | Same | Low | 🟢 |
| **Toast exit** | Fade-out + slide-down on auto-dismiss | Multiple toasts need individual exit animation | CSS can't animate removal from array | Low | 🟢 |
| **Hero carousel** | Crossfade between banner images | `AnimatePresence` `mode="wait"` handles enter/exit | `key` remount destroys CSS transition | Low | 🟢 |
| **Homepage section reveals** | `whileInView` fade-up with `once: true` | Built-in viewport detection + animation in one API | Would need custom IntersectionObserver + class toggling | Low | 🟢 |
| **Product grid stagger** | Staggered fade-up on load/filter | `staggerChildren` + `AnimatePresence` | Pure CSS stagger requires nth-child hacks, breaks on dynamic lists | Medium | 🟡 |
| **Cart item removal** | Fade-out + height collapse | `AnimatePresence` `exit` prop | CSS can't animate before DOM removal | Low | 🟢 |
| **Wishlist item removal** | Same as cart | Same | Same | Low | 🟢 |
| **About page scroll storytelling** | Coordinated section reveals | `whileInView` + stagger for stages 01–05 | Cleaner API than manual IntersectionObserver | Low | 🟢 |

---

## 6. CSS-Only Animations

These should **NOT** use Framer Motion:

| Animation | Technology | Notes |
|---|---|---|
| Navbar scroll transition | CSS `transition-all` | ✅ Already works |
| Product card hover (image scale, Quick Add slide) | CSS `transition` + `group-hover` | ✅ Already works |
| Collection card hover effects | CSS `transition` + `group-hover` | ✅ Already works |
| Button press feedback `active:scale-[0.97]` | CSS `transition-transform` | Add globally to Button component |
| Cart icon badge pulse | CSS `@keyframes` | Simple scale pulse: `1 → 1.25 → 1` |
| Wishlist icon badge pulse | CSS `@keyframes` | Same as above |
| Cart drawer slide | CSS `transition-transform` | ✅ Already works |
| Mobile filter/sort drawers | CSS `transition-transform` | ✅ Already works |
| Filter accordion expand/collapse | CSS Grid `grid-rows` | ✅ Already works |
| Accordion chevron rotation | CSS `transition-transform` | ✅ Already works |
| Loading skeletons | Tailwind `animate-pulse` | ✅ Keep |
| Loading spinner | Tailwind `animate-spin` | ✅ Keep |
| WhatsApp CTA hover/active | CSS transitions | ✅ Already works |
| Form validation border flash | CSS keyframe or `transition` | Simple approach |
| Coupon success/error indicator | CSS `transition` on border-color | Simple approach |
| Order success icon entrance | CSS `@keyframes` scale-in | Single element, no FM needed |
| Checkout "Place Order" button loading | CSS spinner inside button | Already established pattern |

---

## 7. Performance Risk Assessment

| Category | Risk | Notes |
|---|---|---|
| Homepage section reveals (FM `whileInView`) | 🟢 Low | `once: true` means animation runs once per page load. Uses transform/opacity only. |
| Product grid stagger (FM) | 🟡 Moderate | Animating 6–12 cards simultaneously. Use `transform` + `opacity` only. Avoid animating `height` or `width`. |
| Hero carousel crossfade (FM) | 🟢 Low | Only 2 elements (entering/exiting) at a time. |
| Cart item removal (FM) | 🟢 Low | Single item exit. |
| Toast exit (FM) | 🟢 Low | Max 2–3 toasts on screen. |
| About page scroll reveals (FM) | 🟢 Low | `once: true`, minimal elements. |
| Mobile menu exit (FM) | 🟢 Low | Single element height/opacity. |
| Parallax effects | 🔴 **High — NOT recommended** | Continuous scroll listeners with transform updates. Bad for mobile. Avoid. |
| Continuous looping animations | 🔴 **High — NOT recommended** | Battery drain on mobile. Avoid. The WhatsApp CTA is acceptable because it's static until hover. |

---

## 8. SEO & Rendering Impact

### Current Architecture

- Homepage: **SSR with revalidation** (ISR) — server component, content is in HTML
- Product pages: **Dynamic SSR** — server component
- Collections: **SSR with Suspense** — content in HTML
- About: **Static** — content in HTML
- Shop: **Client component** (`ShopView` is `use client`) — products fetched client-side

### Impact Assessment

| Concern | Risk | Mitigation |
|---|---|---|
| Adding Framer Motion to server components | ⚠️ Cannot use `motion.div` in server components | Wrap animated sections in thin client-side `<AnimatedSection>` wrapper components. Keep content as children (still server-rendered HTML). |
| Delaying content visibility with entrance animations | Low risk | Use CSS `will-change: transform, opacity` and ensure content is in the DOM immediately. Animations are visual only — content is rendered. |
| Lighthouse CLS (Cumulative Layout Shift) | 🟢 Low | All proposed animations use `transform` and `opacity`, which don't cause layout shift. |
| Lighthouse LCP (Largest Contentful Paint) | 🟢 Low | Hero image is already `priority` loaded. Animations don't delay image loading. |
| Search engine indexing | 🟢 No impact | All product content, headings, links, and structured data remain in server-rendered HTML. Motion is a visual layer only. |

### Recommendations

- Create a reusable `<RevealOnScroll>` client component wrapper that accepts `children` (server-rendered content) and adds `whileInView` animation
- Never move SEO-critical text into client-only rendered components
- Keep `<h1>`, product names, prices, and structured data in server components

---

## 9. Accessibility & Reduced Motion

### `prefers-reduced-motion` Strategy

| Animation Category | Behavior with Reduced Motion |
|---|---|
| Scroll reveal (fade-up) | **Disable** — show content immediately |
| Staggered entrances | **Disable** — show all items immediately |
| Hero carousel crossfade | **Reduce** — instant switch (no crossfade), keep auto-advance |
| Cart/drawer slide transitions | **Reduce** — instant open/close or very short duration (100ms) |
| Button press feedback | **Keep** — too subtle to cause issues |
| Hover effects (scale, color) | **Keep** — standard interaction, not distracting |
| Toast enter/exit | **Reduce** — instant appear/disappear |
| Loading spinner | **Keep** — functional, necessary |
| Loading skeleton pulse | **Reduce** — keep static gray, no pulse |

### Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

With Framer Motion: use `useReducedMotion()` hook and conditionally set `animate` to final values.

---

## 10. Recommended Motion Tokens

### Duration

| Token | Value | Use Case |
|---|---|---|
| `--duration-micro` | `150ms` | Button press, icon toggle, chip add/remove |
| `--duration-standard` | `250ms` | Hover effects, dropdown enter/exit, nav transitions |
| `--duration-drawer` | `300ms` | Cart drawer, filter drawer, sort sheet, mobile menu |
| `--duration-reveal` | `500ms` | Section scroll reveals, card entrance stagger |
| `--duration-hero` | `700ms` | Hero headline entrance, carousel crossfade |

### Easing

| Token | Value | Use Case |
|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals (fast start, gentle settle) |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Exits, drawer close (accelerating away) |

### Movement

| Token | Value | Use Case |
|---|---|---|
| `--move-sm` | `8px` | Chip entrance, badge pulse |
| `--move-md` | `16px` | Card fade-up, section reveal |
| `--move-lg` | `24px` | Hero text entrance, drawer slide |

---

## 11. Priority Roadmap

### Phase 1 — Essential UX Motion *(P0)*

Must-fix issues that feel broken or unpolished:

1. **Mobile navbar menu** — Add slide-down/up enter/exit animation
2. **Toast exit animation** — Add fade-out before removal
3. **Cart icon badge pulse** — Confirm visual feedback when adding to cart
4. **Hero carousel crossfade** — Fix broken transition between banner slides
5. **Product gallery image switch crossfade** — Add smooth transition between images

### Phase 2 — Premium Micro-interactions *(P1)*

High-value polish that elevates the perceived quality:

6. **User dropdown exit animation** — Fade-out before unmount
7. **Confirm modal exit animation** — Scale-out + fade before unmount
8. **Button press feedback** — Add `active:scale-[0.97]` to global Button component
9. **Wishlist count badge pulse** — Same as cart badge
10. **Cart item removal animation** — Fade-out + collapse
11. **Wishlist item removal animation** — Fade-out + collapse
12. **Account sidebar mobile menu exit** — Add exit animation

### Phase 3 — Storytelling / Scroll Motion *(P1–P2)*

Scroll-based reveals that make the site feel alive:

13. **Homepage section reveals** — `whileInView` fade-up for each major section
14. **About Us page scroll storytelling** — Staggered reveals for all 9 sections
15. **Product grid stagger** — Subtle fade-up stagger on Shop page
16. **Collections grid stagger** — Cards enter sequentially

### Phase 4 — Optional Polish *(P2–P3)*

Nice touches, implement if time allows:

17. **Order success page** — Sequenced entrance (icon → badge → heading → details)
18. **Dashboard stat card stagger** — Subtle entrance on account page
19. **Filter chip enter/exit** — `AnimatePresence` for active chips row
20. **Empty state transitions** — Fade between populated → empty state
21. **Skeleton → content crossfade** — Smooth transition from loading to loaded

---

## 12. Final Recommendation

### Should we introduce Framer Motion?

**Yes.** The storefront has 6+ components that need exit animations before unmount, which CSS alone cannot handle. Framer Motion's `AnimatePresence` is the clean solution. The library also provides `whileInView` for scroll reveals, which would otherwise require manual `IntersectionObserver` wiring.

### Which parts should use Framer Motion?

- `AnimatePresence` exit animations: mobile menu, user dropdown, toasts, confirm modal, cart item removal, wishlist item removal
- `AnimatePresence` crossfade: hero carousel
- `whileInView` scroll reveals: homepage sections, about page sections, collection/product grid stagger

### Which parts should remain CSS?

- All hover effects (product cards, collection cards, buttons, links)
- Cart drawer slide (already working well)
- Mobile filter/sort drawers (already working well)
- Filter accordions (already working well)
- Loading skeletons and spinners
- Button press feedback
- Badge count pulse
- Form validation indicators
- Navbar scroll transition

### What should be implemented first?

1. Mobile navbar menu animation (**feels broken without it**)
2. Toast exit animation (**currently jarring**)
3. Hero carousel crossfade (**currently broken due to key remount**)
4. Cart badge pulse (**missing critical feedback**)
5. Product gallery crossfade (**noticeable quality gap**)

### What should NOT be animated?

- ❌ Checkout form (speed > decoration)
- ❌ Product specifications section (static data, no benefit)
- ❌ Footer (static, no benefit)
- ❌ Breadcrumbs
- ❌ Pagination controls (keep instant)
- ❌ Any continuous/looping animation (except spinners)
- ❌ Parallax (performance risk, off-brand for minimal aesthetic)
- ❌ Page route transitions (adds complexity, delays navigation)

### What would provide the biggest improvement?

**The single highest-impact change** would be adding scroll-reveal animations to the **Homepage** and **About Us** page. These are the first pages visitors see, and right now every section appears statically in one block. Adding staggered `whileInView` reveals would instantly elevate the perceived quality of the entire brand from "well-designed" to "premium".

The second highest-impact change is **fixing the broken mobile menu** (no transition) and **toast exits** (vanish instantly). These are small fixes that remove noticeable quality gaps.

---

> [!IMPORTANT]
> This is an **audit report only**. No code has been modified, no packages installed, no components changed. The next step is a separate implementation phase based on the priorities above.
