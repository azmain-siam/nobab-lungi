import { z } from 'zod';

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Coupon code must be at least 3 characters.')
      .max(25, 'Coupon code cannot exceed 25 characters.')
      .transform((val) => val.trim().toUpperCase()),
    description: z.string().optional().nullable(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().positive('Discount value must be greater than 0.'),
    minimum_amount: z.number().min(0, 'Minimum amount cannot be negative.').default(0),
    max_discount_amount: z.number().min(0).optional().nullable(),
    usage_limit: z.number().min(1, 'Usage limit must be at least 1.').optional().nullable(),
    one_per_customer: z.boolean().default(false),
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage' && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: 'Percentage discount cannot exceed 100%.',
      path: ['value'],
    }
  )
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: 'Expiry date must be after or equal to start date.',
      path: ['end_date'],
    }
  );

export type CouponInput = z.infer<typeof couponSchema>;
