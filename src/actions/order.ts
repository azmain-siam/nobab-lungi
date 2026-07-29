'use server';

import { createOrder, updateOrderStatus, updatePaymentStatus, type CreateOrderParams } from '@/services/order-service';
import { checkoutSchema } from '@/lib/validations/order';
import type { OrderStatus, PaymentStatus } from '@/types';

export async function placeOrderAction(params: CreateOrderParams) {
  const parsed = checkoutSchema.safeParse({
    fullName: params.fullName,
    phone: params.phone,
    deliveryArea: params.deliveryArea,
    fullAddress: params.fullAddress,
    paymentMethod: params.paymentMethod,
    transactionId: params.transactionId,
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

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  return await updateOrderStatus(orderId, status);
}

export async function updatePaymentStatusAction(orderId: string, paymentStatus: PaymentStatus) {
  return await updatePaymentStatus(orderId, paymentStatus);
}
