import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary SDK configuration.
 * Used in Server Actions and Route Handlers for image uploads.
 * Never call this in Client Components.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

export { cloudinary };

// Folder structure in Cloudinary:
// nobab-lungi/products/   → product images
// nobab-lungi/banners/    → homepage banners
// nobab-lungi/collections/→ collection banners
// nobab-lungi/categories/ → category thumbnails
// nobab-lungi/avatars/    → user avatars

export const CLOUDINARY_FOLDERS = {
  PRODUCTS:    'nobab-lungi/products',
  BANNERS:     'nobab-lungi/banners',
  COLLECTIONS: 'nobab-lungi/collections',
  CATEGORIES:  'nobab-lungi/categories',
  AVATARS:     'nobab-lungi/avatars',
} as const;
