# Nabab Lungi (নবাব লুঙ্গি)

> **Heritage Handloom Apparel E-Commerce Storefront & Admin CMS**  
> *Crafted with Next.js 16 (App Router), React 19, MongoDB, Tailwind CSS v4, and Bilingual Localization (`en` / `bn`).*

---

## 🌟 Project Overview

**Nabab Lungi (নবাব লুঙ্গি)** is a luxury e-commerce platform dedicated to premium Bangladeshi handloom lungis and sarees. The application features an editorial storefront, localized user experience (English & Bengali), an interactive shopping experience, and an Admin Management Dashboard (`/dashboard`) for dynamic inventory management, CMS configuration, and order tracking.

---

## ✨ Key Features

### 🛍️ Storefront (Bilingual `en` & `bn`)
- **Dynamic Homepage**: Highlighting CMS hero banners, featured categories, curated collections, best sellers, new arrivals, and brand heritage stories.
- **Bilingual Localization (`next-intl`)**: Seamless switching between English and Bengali with automatic URL routing (`/en`, `/bn`). Uses **Hind Siliguri** font for Bengali typography.
- **Product Catalog & Filtering**: Browse by fabric, color, pattern, collection, and price with instant search and sort filters.
- **Interactive Cart & Wishlist**: Slide-over drawer cart, persistent local wishlist state, and seamless customer checkout flow.
- **Customer Account Portal**: Profile management, order history tracking, and saved delivery addresses.
- **Transparent Sticky Navigation**: Dynamic transparent header for hero sections that transitions into a sticky navbar on scroll.

### 🛡️ Admin Management Panel (`/dashboard`)
- **Product Management**: Full CRUD drawer interface supporting multiple image uploads, stock/pricing controls, SEO meta tags, and **Bengali translation overrides**.
- **Category & Collection Management**: Organize inventory into curated series with custom banners and Bengali translation support.
- **Homepage CMS Manager**: Live control over Hero Banners, Heritage Brand Story, "Why Choose Us" feature cards, and Newsletter settings.
- **Order Processing & Customer Analytics**: Track order statuses, customer metrics, and wishlist insights.
- **Store Settings**: Customize store details, contact info, and social integration parameters.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT Session strategy with Role-Based Access Control)
- **Styling & Animation**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion 13](https://www.framer.com/motion/)
- **Localization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) image upload integration
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
nobab-lungi/
├── messages/                   # Localization dictionaries (en.json, bn.json)
├── public/                     # Static assets & brand imagery
├── src/
│   ├── app/
│   │   ├── (admin)/            # Admin Panel routes (/dashboard)
│   │   ├── [locale]/           # Localized Storefront routes (/en, /bn)
│   │   └── api/                # NextAuth API endpoints
│   ├── components/
│   │   ├── admin/              # Admin breadcrumbs & UI helpers
│   │   ├── layout/             # Header, Footer, Admin Sidebar, Language Toggle
│   │   ├── shared/             # Reusable product cards, account sidebars
│   │   └── ui/                 # Base UI primitives (button, container, section)
│   ├── features/               # Feature-sliced modules (dashboard, auth, landing)
│   ├── lib/                    # DB connection, Cloudinary, Zod validation schemas
│   ├── models/                 # Mongoose Schemas (Product, Category, Collection, Banner, etc.)
│   ├── services/               # Data fetching services (product-service, homepage-service)
│   ├── types/                  # TypeScript interface definitions
│   └── proxy.ts                # Next.js Middleware (Auth guard & locale bypass)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm` (v9+)
- **Database**: MongoDB Database Connection URI

### 1. Environment Setup

Create a `.env.local` file in the project root:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nobab-lungi

# NextAuth Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Cloudinary Storage Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Installation

Install project dependencies:

```bash
npm install
```

### 3. Running Development Server

Start the local development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

Verify TypeScript types and build the production bundle:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## 🔒 Admin Access

To access the Admin Dashboard (`/dashboard`):
1. Create or log in with an account having the role `admin` in your MongoDB `users` collection.
2. Navigate to `http://localhost:3000/dashboard` or click **Admin Dashboard** in the user header menu.

---

## 📝 License

Private Repository — All Rights Reserved.  
© 2026 **Nabab Lungi** (নবাব লুঙ্গি).
