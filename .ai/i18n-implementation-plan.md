# Storefront Localization Implementation Plan

This is a comprehensive, phased execution plan to add full Bangla localization (i18n) to the **Storefront and User Panel** using `next-intl` and MongoDB, ensuring maximum performance, perfect SEO, and zero disruption to the existing English layout and Admin Panel.

## Phase 1: Setup & Routing Foundation
**Goal:** Install dependencies, configure middleware, and establish the localized routing structure.

1. **Install `next-intl`**: Industry standard for Next.js App Router i18n with zero client-side footprint.
2. **Configure Middleware**: Create `middleware.ts` to redirect and resolve locales (`/en` and `/bn`). We will explicitly configure it to **ignore** `/dashboard` (Admin) and `/api` routes.
3. **Restructure Routes**: Move `(store)` and `(auth)` into an `app/[locale]/` directory. (e.g. `app/[locale]/(store)`).
4. **Dictionary Setup**: Create `messages/en.json` and `messages/bn.json` for static translations.
5. **Dynamic Font Configuration**: 
   - Import `Hind_Siliguri` from `next/font/google`.
   - Update `app/layout.tsx` to check the current `locale`. 
   - If `en`, keep exactly what we have (`Hanken Grotesk` & `Inter`).
   - If `bn`, override the Tailwind font-family variables so all text defaults to `Hind Siliguri` seamlessly.

## Phase 2: Static UI Localization
**Goal:** Translate all hardcoded text in the storefront layout and landing pages.

1. **Locale Switcher**: Build a sleek `LanguageToggle` button and place it in the Header/Navbar.
2. **Translate Layout Elements**: Update `Header`, `Footer`, and `AnnouncementBar` to use the `useTranslations()` hook.
3. **Translate Landing Pages**: Convert the hardcoded English text in `Hero`, `CuratedCollections`, `BrandStory`, and `NababStandard` to pull from the JSON dictionaries.

## Phase 3: Database Translation Strategy (MongoDB)
**Goal:** Update the backend architecture to support translated content without creating duplicate products.

1. **Schema Updates**: Update Mongoose models (`Product`, `Collection`, `Category`) to include an Embedded Document for translations:
   ```typescript
   translations: {
     bn: {
       name: String,
       description: String,
       short_description: String
     }
   }
   ```
2. **Service Mapping**: Update backend services (`getProducts`, `getProductById`). The functions will accept the active `locale` as an argument. 
   - If `locale === 'bn'`, the service will automatically overwrite the default English fields with the Bengali translations before passing the data to the frontend.
3. **Store Settings**: Allow dynamic shipping fees/policies (from `Settings` model) to also have `translations.bn` overrides.

## Phase 4: Frontend Data Binding
**Goal:** Pass the active locale to our data fetchers so the UI automatically displays the correct language.

1. **Server Components**: In storefront pages (e.g., `ShopView`, `ProductInfo`), extract the `locale` from the page `params` (e.g., `params.locale`).
2. **Data Fetching**: Pass the `locale` down to the `getProducts(filters, locale)` and `getProductById(id, locale)` server functions. 
3. *Because the mapping happens in Phase 3's backend services, the frontend components (like `ProductCard`) do not need to change at all—they just render `product.name` as usual!*
