import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(100, 'Category name cannot exceed 100 characters.'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters.')
    .max(100, 'Slug cannot exceed 100 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens only.'),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  parent_type: z.enum(['lungi', 'saree'], {
    message: 'Parent category type is required.',
  }),
  sort_order: z.coerce.number().int().min(0, 'Sort order must be a non-negative integer.').default(0),
  is_active: z.boolean().default(true),
  translations: z
    .object({
      bn: z
        .object({
          name: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
