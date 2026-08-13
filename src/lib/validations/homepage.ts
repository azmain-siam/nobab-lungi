import { z } from 'zod';

export const bannerSchema = z.object({
  title: z
    .string()
    .min(2, 'Banner title must be at least 2 characters.')
    .max(120, 'Banner title cannot exceed 120 characters.'),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  desktop_image: z.string().url('Desktop image is required.'),
  mobile_image: z.string().optional().nullable(),
  primary_btn_text: z.string().optional().nullable(),
  primary_btn_url: z.string().optional().nullable(),
  secondary_btn_text: z.string().optional().nullable(),
  secondary_btn_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  is_primary: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).default(0),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  translations: z
    .object({
      bn: z
        .object({
          title: z.string().optional().nullable(),
          subtitle: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          primary_btn_text: z.string().optional().nullable(),
          secondary_btn_text: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const homepageSectionSchema = z.object({
  key: z.string(),
  name: z.string(),
  is_visible: z.boolean(),
  sort_order: z.coerce.number().int(),
});

export const brandStorySchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  image_url: z.string().optional().nullable(),
  button_text: z.string().optional().nullable(),
  button_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  translations: z
    .object({
      bn: z
        .object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
          button_text: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const whyChooseUsCardSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1, 'Icon is required.'),
  title: z.string().min(2, 'Card title is required.'),
  description: z.string().min(5, 'Card description is required.'),
  sort_order: z.coerce.number().int().default(0),
  translations: z
    .object({
      bn: z
        .object({
          title: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export const newsletterSchema = z.object({
  heading: z.string().min(2, 'Heading is required.'),
  description: z.string().min(5, 'Description is required.'),
  is_enabled: z.boolean().default(true),
  translations: z
    .object({
      bn: z
        .object({
          heading: z.string().optional().nullable(),
          description: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

export type BannerInput = z.infer<typeof bannerSchema>;
