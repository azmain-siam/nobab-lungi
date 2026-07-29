## Project Identity

Project Name: Traditional Clothing E-commerce (Nobab Lungi)
Business Type: Bangladeshi Lungi & Saree Store
Primary Product: Lungi
Secondary Product: Saree

Tech Stack:

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Supabase
- Cloudinary
- Vercel

There is NO separate backend.

The application is a full-stack Next.js application.

---

# Core Principles

1. Simplicity over complexity.
2. Mobile-first design.
3. SEO-friendly implementation.
4. Minimal hosting cost.
5. Fast loading.
6. Easily maintainable by a single developer.
7. Easy admin experience for non-technical users.

---

# Architecture Rules

## Data Fetching

Prefer:

- Server Components
- Server Actions

Avoid:

- Unnecessary client components
- Excessive useEffect
- Excessive API routes

Use Route Handlers only when absolutely necessary.

---

# Authentication

Use Supabase Auth.

Roles:

- ADMIN
- CUSTOMER

Never implement custom JWT authentication.

---

# Database

Database: Supabase PostgreSQL.

Never introduce:

- Prisma
- MongoDB
- Separate backend
- Redis

---

# Image Storage

Use Cloudinary.

Store:

- Product Images
- Banner Images
- Collection Images

Never store images inside Supabase.

---

# Code Quality Rules

## TypeScript

- Strict Mode
- No any
- No ts-ignore
- Prefer interfaces for shared types.

---

# Component Rules

Components should:

- Be reusable.
- Have single responsibility.
- Stay under 200 lines whenever possible.

Extract complex logic into hooks.

---

# State Management

Prefer:

1. Server State
2. URL State
3. React State

Avoid global state unless necessary.

Use Context only when appropriate.

Do not add Redux.

---

# Forms

Use:

- React Hook Form
- Zod

All forms must have:

- Validation
- Loading state
- Error state
- Success state

---

# UI Rules

Design should be:

- Heritage Editorial Luxury (Minimalist, High-Fashion Editorial)
- Minimal & Elegant with generous whitespace
- Product-First gallery presentation
- Bento Grid layout structure

Typography:

- Display & Headings: `Hanken Grotesk` (geometric, sharp editorial typography)
- Body & Functional UI: `Inter` (utilitarian, high legibility)
- Bangla Typography: `Hind Siliguri`

Target users:

- Bangladeshi customers
- Mobile users (Android prioritized)
- Non-technical users

---

# Styling Rules

Use:

- TailwindCSS v4 with CSS variables defined in `.ai/DESIGN.md`
- Paper surface background (`#FBF9F8`) with high-contrast monochrome foundation (`#000000`/`#FFFFFF`)
- Sharp architectural 0px corners (`rounded-none`) for buttons & functional controls
- Soft `rounded-2xl` (16px) for cards & image containers
- Material Symbols Outlined (weight 300) or stroke-based icons

Avoid:

- Inline styles
- Saturated neon colors or flashy gradients
- Heavy drop shadows (use soft ambient `0 10px 30px 4px rgba(0,0,0,0.04)`)
- Unnecessary animations

---

# Naming Rules

Components:
PascalCase

Variables:
camelCase

Files:
kebab-case

Constants:
UPPER_SNAKE_CASE

---

# Folder Structure

src/

app/
components/
features/
actions/
hooks/
lib/
services/
types/
utils/
providers/
constants/

---

# Feature Structure

features/

cart/
checkout/
products/
orders/
collections/
auth/
dashboard/

---

# Error Handling

Every feature must implement:

- Loading state
- Empty state
- Error state

---

# Performance Rules

Use:

- Server Components
- Suspense
- Dynamic imports
- Image optimization
- Pagination

Avoid:

- Unnecessary re-renders
- Large client bundles

---

# SEO Rules

Every public page must have:

- Metadata
- Open Graph
- Canonical URL

Products and collections must generate dynamic metadata.

---

# Accessibility

Use:

- Semantic HTML
- Proper labels
- Keyboard accessibility
- Sufficient color contrast

---

# Security Rules

Never expose:

- Service Role Key
- Secrets
- Environment variables

Validate all user input.

Use Supabase Row Level Security.

---

# Before Implementing Any Feature

1. Understand requirements.
2. Explain approach.
3. Mention files to be created.
4. Implement.
5. Summarize changes.

---

# When Generating Code

Prefer:

- Readable code
- Small functions
- Reusable components
- Simplicity

Avoid:

- Overengineering
- Premature optimization
- Unnecessary abstractions
