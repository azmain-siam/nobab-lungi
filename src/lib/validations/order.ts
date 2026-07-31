import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required.'),
  phone: z.string().min(11, 'Valid phone number is required.'),
  deliveryArea: z.enum(['dhaka', 'outside']),
  fullAddress: z.string().min(5, 'Full delivery address is required.'),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad']),
  transactionId: z.string().optional().nullable(),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ]),
  note: z.string().optional().nullable(),
});

export const paymentStatusSchema = z.object({
  payment_status: z.enum(['unpaid', 'pending_verification', 'paid', 'refunded']),
  note: z.string().optional().nullable(),
});

export const deliveryInfoSchema = z.object({
  courier: z.string().min(2, 'Courier name is required.'),
  tracking_number: z.string().min(2, 'Tracking number is required.'),
  delivery_status: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const adminNoteSchema = z.object({
  note: z.string().min(1, 'Admin note cannot be empty.'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type PaymentStatusInput = z.infer<typeof paymentStatusSchema>;
export type DeliveryInfoInput = z.infer<typeof deliveryInfoSchema>;
