---
name: Heritage Editorial
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#636360'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002020'
  on-tertiary-container: '#5f8c8b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2de'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#bcebeb'
  tertiary-fixed-dim: '#a1cfce'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#204e4e'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
  surface-bg: '#fbf9f8'
  outline-muted: '#c4c7c7'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
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
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 96px
  container-max: 1280px
---

## Brand & Style

The brand identity is rooted in **Heritage Luxury**—a blend of traditional South Asian craftsmanship and modern high-fashion editorial aesthetics. It targets a discerning audience that values cultural authenticity, premium materiality, and timeless sophistication. 

The visual style is **Minimalist-Editorial**, characterized by expansive high-resolution photography, generous whitespace, and a restrained color palette. It avoids flashy ornamentation, relying instead on structural grid layouts (Bento-style), sharp typography, and subtle tonal layering to evoke a sense of quiet luxury and artisanal pride. The interface acts as a gallery, allowing the textures and patterns of the product to lead the experience.

## Colors

The palette is anchored in a high-contrast **Monochrome Foundation** (#000000 and #FFFFFF), punctuated by earthy, organic neutrals. 

- **Primary:** Stark black is used for core branding, primary calls-to-action, and high-level headings to maintain a premium feel.
- **Surface:** The background uses a warm "Paper" off-white (#fbf9f8) rather than pure white to reduce eye strain and feel more like a physical luxury publication.
- **Accents:** Tertiary tones are inspired by natural dyes like deep indigo and forest greens, used sparingly to highlight secondary information without breaking the editorial flow.
- **Neutrals:** Grays are warm-toned to maintain harmony with the paper-like background.

## Typography

The system utilizes a dual-sans-serif approach. **Hanken Grotesk** provides a sharp, contemporary edge for large display and headline roles, featuring a slight geometric rigor that feels modern. **Inter** handles all functional, body, and label text, chosen for its exceptional legibility and systematic, utilitarian feel.

Hierarchy is established through extreme scale shifts (e.g., 64px display vs 16px body) and the use of all-caps for labels and buttons to create a rhythmic, structural feel. Wide letter spacing (0.1em) is applied to labels and buttons to reinforce the "luxury boutique" aesthetic.

## Layout & Spacing

The layout utilizes a **12-column Fixed Grid** (max-width 1280px) for desktop, centered on the screen with generous 64px side margins. For mobile, the grid collapses to a single column with 20px margins.

A **Bento-style Grid** model is used for curated sections, where elements span varied column widths (e.g., 8-col vs 4-col) to create visual interest. Vertical rhythm is driven by large `section-gap` units (96px) to ensure every content block has enough "room to breathe," mimicking the layout of a coffee-table book.

## Elevation & Depth

The design uses **Tonal Layering** and **Ambient Shadows** rather than traditional elevation.

- **Surface Tiers:** Depth is communicated by placing content on `surface-container-lowest` (pure white) cards against a `background` (warm off-white). 
- **Shadows:** A very soft, "Ambient Shadow" (`0 10px 30px 4px rgba(0, 0, 0, 0.04)`) is used for large container sections to make them appear softly lifted off the page.
- **Glassmorphism:** The navigation bar uses a high-blur (`backdrop-blur-md`) translucent background to maintain a sense of space while scrolling.

## Shapes

The shape language is a mix of **Sharp Editorial** and **Modern Softness**.

- **Buttons & Functional Elements:** Use 0px roundedness (sharp corners) to communicate architectural precision and high-fashion severity.
- **Cards & Image Containers:** Use `rounded-2xl` (1rem / 16px) to soften the overall interface and provide a modern, "app-like" containerization for photography.
- **Icons:** Material Symbols are used with a light weight (300) to match the thin stroke widths of the typography.

## Components

### Buttons
- **Primary:** Sharp corners, black background, white text, all-caps, 14px tracking. Hover state involves a subtle shift to dark gray or a slight opacity change.
- **Secondary/Ghost:** Sharp corners, 1px border (color-matched to text), no fill.

### Cards (Product/Collection)
- Featured collection cards use a "Bento" layout with a `rounded-2xl` clipping mask and high-resolution background images.
- Text on images is placed at the bottom-left over a soft black-to-transparent gradient (50% opacity max) to ensure legibility.

### Navigation
- A fixed top bar with high-blur background. Links are `all-caps`, using `font-semibold` with a 1px border-bottom for the active state to mimic traditional editorial links.

### Input & Interactions
- Quick-add buttons on product cards are hidden by default and slide up from the bottom (`translate-y`) on hover, maintaining a clean visual state until the user expresses intent.
- Icons use the `material-symbols-outlined` variant with a light stroke weight (300) to maintain the delicate brand feel.