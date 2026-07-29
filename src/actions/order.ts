'use server';

import { createOrder, type CreateOrderParams } from '@/services/order-service';

export async function placeOrderAction(params: CreateOrderParams) {
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
