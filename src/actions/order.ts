'use server';

import { createOrder, type CreateOrderParams } from '@/services/order-service';
import { checkoutSchema } from '@/lib/validations/order';

export async function placeOrderAction(params: CreateOrderParams) {
  const parsed = checkoutSchema.safeParse({
    fullName: params.fullName,
    phone: params.phone,
    deliveryArea: params.deliveryArea,
    fullAddress: params.fullAddress,
    paymentMethod: params.paymentMethod,
    transactionId: params.transactionId,
    couponCode: params.couponCode,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  try {
    const result = await createOrder(params);
    return result;
  } catch (error) {
    console.error('placeOrderAction Error:', error);
    return {
      success: false,
      error: 'Failed to place order. Please try again.',
    };
  }
}
