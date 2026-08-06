'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, type CreateOrderParams, getOrderById, updateAdminOrder } from '@/services/order-service';
import { checkoutSchema } from '@/lib/validations/order';
import { revalidatePath } from 'next/cache';

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

export async function cancelCustomerOrderAction(orderId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: 'You must be logged in to cancel an order.' };
    }

    const userId = (session.user as { id?: string }).id;
    const userRole = (session.user as { role?: string }).role;

    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: 'Order not found.' };
    }

    // Verify ownership
    if (order.user_id !== userId && userRole !== 'admin') {
      return { success: false, error: 'You are not authorized to cancel this order.' };
    }

    // Verify status allows cancellation (only pending or confirmed)
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return {
        success: false,
        error: `Order cannot be cancelled at status "${order.status}".`,
      };
    }

    const updateRes = await updateAdminOrder(order.id, {
      status: 'cancelled',
      timelineEvent: {
        status: 'cancelled',
        message: 'Order cancelled by customer.',
        updated_by: 'Customer',
      },
    });

    if (!updateRes.success) {
      return { success: false, error: updateRes.error || 'Failed to cancel order.' };
    }

    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath(`/account/orders`);
    revalidatePath('/account');

    return { success: true };
  } catch (error) {
    console.error('cancelCustomerOrderAction Error:', error);
    return { success: false, error: 'An unexpected error occurred while cancelling order.' };
  }
}
