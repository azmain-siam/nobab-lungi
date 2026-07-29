import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required.'),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than 0.'),
  stock: z.number().int().nonnegative('Stock cannot be negative.'),
  category_id: z.number().optional(),
  imageUrl: z.string().url('Invalid image URL.').optional(),
});
