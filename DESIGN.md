---
name: Heritage Minimalist
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#181919'
  on-primary: '#ffffff'
  primary-container: '#2d2d2d'
  on-primary-container: '#959494'
  inverse-primary: '#c8c6c6'
  secondary: '#9a4523'
  on-secondary: '#ffffff'
  secondary-container: '#ff946c'
  on-secondary-container: '#772b0a'
  tertiary: '#281400'
  on-tertiary: '#ffffff'
  tertiary-container: '#442602'
  on-tertiary-container: '#ba8b5d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e2e1'
  primary-fixed-dim: '#c8c6c6'
  on-primary-fixed: '#1b1c1c'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#7b2f0e'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system embodies a "Contemporary Heritage" aesthetic—a bridge between traditional Bangladeshi craftsmanship and modern global minimalism. The brand personality is quiet, confident, and intentional, prioritizing the tactile beauty of textiles over loud interface elements.

The style is **Minimalist with an Organic Warmth**. It draws from the whitespace of Apple and the product-centric focus of COS, but avoids clinical coldness by utilizing a warm base palette and soft elevation. The emotional response should be one of "Calm Authenticity"—where the user feels they are browsing a high-end gallery rather than a cluttered marketplace. 

Key principles include:
- **Product-First:** UI elements exist only to support and frame the photography.
- **Intentional Restraint:** Every border, shadow, and icon must earn its place.
- **Rhythmic Balance:** Utilizing asymmetrical whitespace to evoke the flow of traditional drapes.

## Colors
The palette is rooted in natural dyes and raw materials. 

- **Base:** The primary background (#FDFCF8) is a soft off-white, providing a warm, parchment-like canvas that feels more premium and organic than pure white.
- **Ink:** Deep Charcoal (#2D2D2D) is used for all primary text and structural elements, ensuring high legibility and a sharp, sophisticated contrast.
- **Earth Tones:** Accents like Terracotta and Sage are reserved for functional cues (e.g., "In Stock" labels, seasonal collection tags) or very specific call-to-actions to maintain a serene environment.
- **Subtle Borders:** Hairline strokes (#E5E5E1) are used only when necessary to define boundaries without breaking the visual flow.

## Typography
The typography pairing reflects the dual nature of the brand. **Playfair Display** provides an editorial, authoritative voice for headings, reminiscent of luxury fashion publishing. **Inter** handles all functional and body text with systematic precision and high readability.

- **Hierarchical Contrast:** Use large display type for collection titles and minimal body text.
- **Leading & Breathing Room:** Maintain generous line heights (1.6x for body) to ensure the text feels unhurried.
- **The Label Style:** Use `label-caps` for category tags or small metadata to provide a structured, "catalog" feel inspired by Muji and Uniqlo.

## Layout & Spacing
The layout follows a **Fluid Grid with Fixed Maximums**. 

- **Desktop:** A 12-column grid with 24px gutters. Use wide margins (48px-80px) to create a "gallery frame" effect around the content.
- **Mobile:** A 4-column grid with 16px margins.
- **Spacing Rhythm:** Use a 4px base unit. Preferred spacing increments are 16px (sm), 24px (md), and 48px (lg).
- **Whitespace as a Component:** Treat empty space as a structural element. Do not feel the need to fill every corner; let the products breathe.

## Elevation & Depth
Depth is conveyed through **Soft, Natural Shadows** and **Tonal Layering**, avoiding heavy gradients or stark outlines.

- **The "Lift" Technique:** Use very low-opacity shadows (e.g., `y: 4px, blur: 12px, color: rgba(45, 45, 45, 0.05)`) for cards to make them appear as if they are resting lightly on a fabric surface.
- **Tonal Contrast:** Use a slightly darker off-white (#F5F4F0) for secondary background sections to create depth without using lines.
- **Glassmorphism:** For navigation bars, use a backdrop-blur (10px-20px) with a semi-transparent version of the background color (#FDFCF8CC) to maintain context while scrolling through vibrant product images.

## Shapes
The shape language is "Softly Geometric." 

- **Base Radius:** 8px (`rounded`) is the standard for cards and input fields to provide a modern yet approachable feel.
- **Large Radius:** 16px (`rounded-xl`) is used for featured promotional cards or modal containers.
- **Pill Shapes:** Reserved exclusively for tags (chips) or secondary buttons to distinguish them from primary structural elements.
- **Borders:** Use 1px hairline strokes for inputs and subtle dividers.

## Components
Consistent component styling maintains the "Premium Minimalist" vision:

- **Buttons:** 
  - *Primary:* Solid Deep Charcoal (#2D2D2D) with white text. No shadow, 8px radius.
  - *Secondary:* Ghost style with a 1px border (#2D2D2D) and 8px radius.
- **Product Cards:** No borders. The image should fill the container. Text (Title, Price) should be left-aligned underneath with 12px of padding. Use a subtle lift shadow on hover.
- **Inputs:** 1px border (#E5E5E1). On focus, the border transitions to Deep Charcoal (#2D2D2D). Label text should use the `label-caps` style.
- **Chips/Tags:** Use the `accent_sage` or `tertiary_mustard` with 10% opacity for the background and full opacity for the text. Pill-shaped (fully rounded).
- **Lists:** Clean lines with 1px dividers. High vertical padding (16px-24px) between items to maintain the "luxury" feel.
- **Icons:** Use thin-stroke (1.5px) linear icons. Avoid filled icons unless indicating an active state (e.g., a filled heart for "Wishlisted").