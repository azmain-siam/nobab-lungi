# DESIGN_SYSTEM.md - Nobab Lungi (Heritage Minimalist)

## 1. Design Philosophy

The **Nobab Lungi** interface embodies a **"Contemporary Heritage"** aesthetic—a bridge between traditional Bangladeshi textile craftsmanship and modern global minimalism.

- **Brand Personality**: Quiet, confident, authentic, and intentional.
- **Aesthetic Direction**: Minimalist with organic warmth. It captures the generous whitespace of Apple, the product-centric focus of COS, and the functional purity of Muji, grounded in natural Bangladeshi heritage (like Aarong).
- **Core Principles**:
  1. **Product-First**: UI elements exist only to support, frame, and highlight product photography.
  2. **Intentional Restraint**: Every border, shadow, and icon must earn its place.
  3. **Calm Authenticity**: Provide a serene, high-end gallery experience rather than a cluttered marketplace.
  4. **Whitespace as a Component**: Treat empty space as structural balance.

---

## 2. Target Audience & Localization

- **Demographic**: Bangladeshi consumers (ages 18–60) purchasing premium lungis, sarees, and traditional attire.
- **Mobile First**: Optimized for handheld devices (Android prioritized) with large touch targets, fast loading times, and intuitive one-thumb navigation.
- **Language & Fonts**:
  - **English Headings**: `Playfair Display` (editorial luxury typography)
  - **English Body & UI**: `Inter` (systematic precision & readability)
  - **Bangla Text**: `Hind Siliguri` (clean, modern Bangla font rendering)

---

## 3. Color Tokens & Palette

The palette is derived from natural plant dyes, woven cotton, raw earth, and parchment.

### Core Color Tokens

| Token Name | Hex Code | Role / Usage |
| :--- | :--- | :--- |
| **`surface` / `background`** | `#FAF9F5` | Warm Parchment off-white primary canvas |
| **`surface-container`** | `#EFEEEA` | Secondary background for section subtle contrast |
| **`surface-container-lowest`** | `#FFFFFF` | Card & container fill |
| **`primary` / `ink`** | `#181919` / `#2D2D2D` | Primary text, headers, primary solid buttons |
| **`secondary` / `terracotta`** | `#9A4523` | Secondary accent, primary action highlights, stock badges |
| **`tertiary` / `earth`** | `#281400` | Deep natural wood / textile accent |
| **`outline` / `border`** | `#E3E2DF` / `#E5E5E1` | Hairline borders and dividers |
| **`text-muted` / `on-surface-variant`** | `#444748` | Subtitles, helper text, inactive states |
| **`error`** | `#BA1A1A` | Validation errors, stock alerts |

### Tailwind CSS Mapping
```css
:root {
  --background: #faf9f5;
  --foreground: #1b1c1a;
  --card: #ffffff;
  --card-foreground: #1b1c1a;
  --popover: #ffffff;
  --popover-foreground: #1b1c1a;
  --primary: #181919;
  --primary-foreground: #ffffff;
  --secondary: #9a4523;
  --secondary-foreground: #ffffff;
  --muted: #efeeea;
  --muted-foreground: #444748;
  --accent: #9a4523;
  --accent-foreground: #ffffff;
  --destructive: #ba1a1a;
  --destructive-foreground: #ffffff;
  --border: #e3e2df;
  --input: #e3e2df;
  --ring: #2d2d2d;
  --radius: 0.5rem;
}
```

---

## 4. Typography Hierarchy

### Font Families
- **Editorial Headings**: `font-serif` -> `'Playfair Display', Georgia, serif`
- **Interface & Body**: `font-sans` -> `'Inter', sans-serif`
- **Bangla Text**: `font-bangla` -> `'Hind Siliguri', 'Inter', sans-serif`

### Type Scale

| Level | Font Family | Size | Weight | Line Height | Tracking / Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Playfair Display | `48px` (36px Mobile) | Bold (`700`) | `1.1` | `-0.02em` |
| `headline-md` | Playfair Display | `32px` | Semibold (`600`) | `1.3` | Default |
| `headline-sm` | Playfair Display | `24px` | Semibold (`600`) | `1.4` | Default |
| `body-lg` | Inter / Hind Siliguri | `18px` | Regular (`400`) | `1.6` | `0.01em` |
| `body-md` | Inter / Hind Siliguri | `16px` | Regular (`400`) | `1.6` | Normal |
| `label-caps` | Inter | `12px` | Semibold (`600`) | `1.0` | `UPPERCASE` (`0.1em`) |
| `button` | Inter / Hind Siliguri | `14px` | Medium (`500`) | `1.0` | `0.05em` |

---

## 5. Spacing System & Grid

Built on a strict **4px base unit grid**.

### Spacing Scale
- `xs`: `8px`
- `sm`: `16px`
- `md`: `24px`
- `lg`: `48px`
- `xl`: `80px`

### Layout Boundaries
- **Container Maximum**: `1280px`
- **Desktop Grid**: 12 columns with `24px` gutters and `48px–80px` outer margins (Gallery Frame effect).
- **Mobile Grid**: 4 columns with `16px` outer margins.
- **Section Gap**: `80px` to `120px` vertical spacing between homepage sections.

---

## 6. Shapes & Elevation

### Border Radius
- `sm` (`0.25rem` / `4px`): Badges & micro-elements.
- `DEFAULT` / `md` (`0.5rem` / `8px`): Standard radius for buttons, input fields, standard cards.
- `lg` / `xl` (`1.0rem`–`1.5rem` / `16px`): Featured promotional banners, modal dialogs, drawer sheets.
- `full` (`9999px`): Category chips, tags, circular icons.

### Elevation & Soft Depth
- **Hairline Strokes**: `1px solid #E3E2DF` for architectural clarity.
- **Soft Ambient Lift Shadow**: `box-shadow: 0 4px 12px rgba(45, 45, 45, 0.05)`.
- **Glassmorphic Navigation**: Semi-transparent background (`#FAF9F5CC`) with `backdrop-blur(12px)`.

---

## 7. Component Guidelines

### Buttons
- **Primary**: Solid Deep Charcoal (`#2D2D2D` / `#181919`) with white text. Radius: `8px`. No heavy shadow.
- **Secondary / Action**: Terracotta (`#9A4523`) filled for primary shopping triggers ("Add to Cart", "Checkout Now").
- **Outline / Ghost**: 1px border (`#2D2D2D`) with transparent background.
- **Interactive States**: Every button must implement distinct Hover, Active, Disabled, and Loading spinner states.

### Product Cards
- **Structure**: High-resolution product image filling the card container (`aspect-[3/4]`), clean borderless card container.
- **Text Alignment**: Left-aligned product title, price in Terracotta/Charcoal, optional discount tag in pill badge.
- **Hover Effect**: Subtle scale transition (`scale-102`) with soft lift shadow (`0 4px 12px rgba(45, 45, 45, 0.05)`).

### Forms & Inputs
- **Layout**: Single column for clarity.
- **Input Field**: `1px` border (`#E3E2DF`), `8px` radius, `#FFFFFF` background.
- **Focus State**: `1px` border transitions to Deep Charcoal (`#2D2D2D`).
- **Field Label**: Styled using `label-caps` (`12px`, uppercase, semibold, `tracking-wider`).

### Shopping Cart & Checkout (Pro Specs)
- **Cart Drawer/Page**: Sticky summary sidebar on desktop, full-width fixed bottom bar on mobile.
- **Checkout Flow**: Clear step indicator (Shipping Address -> Delivery Method -> Payment Method).
- **Payment Badges**: Cash on Delivery, bKash, Nagad, Visa/Mastercard cleanly displayed with subtle hairline badges.

---

## 8. Layout Hierarchy

1. **Top Header**: Minimal sticky navbar with logo, search bar, language toggle (EN/BN), wishlist, and cart drawer trigger.
2. **Hero Banner**: Full-width editorial storytelling with large serif headline (`Playfair Display`) and high-impact textile imagery.
3. **Featured Categories**: 4-card desktop / horizontal snap scroll mobile.
4. **New Arrivals Grid**: Responsive 4-column product grid.
5. **Collection Story Spotlight**: Asymmetrical split view highlighting handloom weaving heritage.
6. **Customer Reviews & Trust Badges**: Guaranteeing authentic Bangladeshi craftsmanship, easy returns, and fast delivery.
7. **Footer**: Clean multi-column links, contact info, payment icons, and copyright notice.

---

## 9. Design Rules

### Always:
- Maintain generous whitespace to allow products to breathe.
- Pair editorial headings with clean sans-serif/Bangla body copy.
- Enforce strict contrast for readability.
- Keep mobile touch targets at minimum `44x44px`.

### Never:
- Use bright saturated neon colors or heavy gradients.
- Overuse borders or dark drop shadows.
- Add flashy or distracting animations (keep transitions to smooth `ease-in-out` 150-200ms).