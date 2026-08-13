import { z } from 'zod';

export const collectionSchema = z.object({
  name: z
    .string()
    .min(2, 'Collection name must be at least 2 characters.')
    .max(100, 'Collection name cannot exceed 100 characters.'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters.')
    .max(100, 'Slug cannot exceed 100 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens only.'),
  description: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),
  banner_url: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0, 'Display order must be a non-negative integer.').default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  translations: z
    .object({
      bn: z
        .object({
          name: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          seo_title: z.string().optional().nullable(),
          seo_description: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
