import { z } from 'zod';

export const storeSettingsSchema = z.object({
  general: z.object({
    store_name: z.string().min(2, 'Store name is required.'),
    store_logo: z.string().optional().nullable(),
    store_favicon: z.string().optional().nullable(),
    store_description: z.string().optional().nullable(),
    store_email: z.string().email('Valid store email is required.'),
    store_phone: z.string().min(5, 'Valid store phone number is required.'),
    whatsapp_number: z.string().min(5, 'Valid WhatsApp number is required.'),
  }),
  address: z.object({
    store_address: z.string().min(3, 'Store address is required.'),
    city: z.string().min(2, 'City is required.'),
    district: z.string().min(2, 'District is required.'),
    postal_code: z.string().min(2, 'Postal code is required.'),
    country: z.string().min(2, 'Country is required.'),
  }),
  social: z.object({
    facebook_url: z.string().optional().nullable(),
    instagram_url: z.string().optional().nullable(),
    youtube_url: z.string().optional().nullable(),
    tiktok_url: z.string().optional().nullable(),
  }),
  delivery: z.object({
    inside_dhaka_charge: z.number().min(0, 'Inside Dhaka delivery charge cannot be negative.'),
    outside_dhaka_charge: z.number().min(0, 'Outside Dhaka delivery charge cannot be negative.'),
    free_delivery_min_amount: z.number().min(0).optional().nullable(),
    estimated_delivery_time: z.string().min(2, 'Estimated delivery time text is required.'),
  }),
  payment: z.object({
    cod_enabled: z.boolean(),
    bkash_enabled: z.boolean(),
    bkash_merchant_number: z.string().optional().nullable(),
    nagad_enabled: z.boolean(),
    nagad_merchant_number: z.string().optional().nullable(),
    bank_transfer_enabled: z.boolean(),
  }),
  seo: z.object({
    default_meta_title: z.string().min(3, 'Default meta title is required.'),
    default_meta_description: z.string().min(5, 'Default meta description is required.'),
    default_og_image: z.string().optional().nullable(),
  }),
  homepage: z.object({
    products_per_page: z.number().min(1, 'Products per page must be at least 1.'),
    featured_products_limit: z.number().min(1, 'Featured products limit must be at least 1.'),
    new_arrivals_limit: z.number().min(1, 'New arrivals limit must be at least 1.'),
    best_sellers_limit: z.number().min(1, 'Best sellers limit must be at least 1.'),
  }),
  maintenance: z.object({
    maintenance_mode: z.boolean(),
    maintenance_message: z.string().min(3, 'Maintenance message is required when enabled.'),
  }),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
