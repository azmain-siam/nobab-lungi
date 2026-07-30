import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX).'),
  deliveryArea: z.enum(['dhaka', 'outside']),
  fullAddress: z.string().min(10, 'Full shipping address must be at least 10 characters.'),
  paymentMethod: z.enum(['cod', 'bkash']),
  transactionId: z.string().optional(),
});
