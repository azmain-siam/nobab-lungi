'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as { id?: string }).id : undefined;

    const result = await createOrder({
      ...params,
      userId: userId || params.userId,
    });
    return result;
  } catch (error) {
    console.error('placeOrderAction Error:', error);
    return {
      success: false,
      error: 'Failed to place order. Please try again.',
    };
  }
}
