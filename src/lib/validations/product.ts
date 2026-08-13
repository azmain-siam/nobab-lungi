import { z } from 'zod';

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL.'),
  alt_text: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
  is_cover: z.boolean().default(false),
});

export const productSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Product name must be at least 2 characters.')
      .max(150, 'Product name cannot exceed 150 characters.'),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters.')
      .max(150, 'Slug cannot exceed 150 characters.')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens only.'),
    sku: z
      .string()
      .min(2, 'SKU must be at least 2 characters.')
      .max(50, 'SKU cannot exceed 50 characters.'),
    short_description: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    price: z.coerce.number().min(0, 'Regular price must be a non-negative number.'),
    discount_price: z.coerce.number().min(0, 'Sale price must be a non-negative number.').optional().nullable(),
    stock: z.coerce.number().int().min(0, 'Stock quantity cannot be negative.'),
    category_id: z.coerce.number().int({ message: 'Category is required.' }).min(1, 'Category is required.'),
    collection_ids: z.array(z.coerce.number().int()).default([]),
    fabric: z.string().optional().nullable(),
    pattern: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    weight: z.string().optional().nullable(),
    country_of_origin: z.string().default('Bangladesh'),
    product_images: z
      .array(productImageSchema)
      .min(1, 'At least one product image is required.'),
    status: z.enum(['published', 'draft']).default('published'),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    is_best_seller: z.boolean().default(false),
    is_new_arrival: z.boolean().default(false),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
    translations: z
      .object({
        bn: z
          .object({
            name: z.string().optional().nullable(),
            short_description: z.string().optional().nullable(),
            description: z.string().optional().nullable(),
            fabric: z.string().optional().nullable(),
            pattern: z.string().optional().nullable(),
            color: z.string().optional().nullable(),
            country_of_origin: z.string().optional().nullable(),
            seo_title: z.string().optional().nullable(),
            seo_description: z.string().optional().nullable(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.discount_price !== undefined && data.discount_price !== null && data.discount_price > 0) {
        return data.discount_price <= data.price;
      }
      return true;
    },
    {
      message: 'Sale price cannot exceed regular price.',
      path: ['discount_price'],
    }
  );

export type ProductInput = z.infer<typeof productSchema>;
