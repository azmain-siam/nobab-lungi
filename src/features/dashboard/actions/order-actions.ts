'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { getAdminOrders, getOrderById, updateAdminOrder } from '@/services/order-service';
import type { OrderStatus, PaymentStatus } from '@/types';
import {
  orderStatusSchema,
  paymentStatusSchema,
  deliveryInfoSchema,
  adminNoteSchema,
} from '@/lib/validations/order';

export interface OrderActionResult {
  success?: boolean;
  error?: string;
}

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchAdminOrdersAction(options?: {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminOrders(options);
}

export async function fetchOrderDetailsAction(orderId: string) {
  await verifyAdminSession();
  return getOrderById(orderId);
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<OrderActionResult> {
  try {
    const session = await verifyAdminSession();

    const parsed = orderStatusSchema.safeParse({ status, note });
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const adminName = session.user?.name || 'Admin';
    const statusLabel = status.toUpperCase();

    const res = await updateAdminOrder(orderId, {
      status,
      timelineEvent: {
        status,
        message: note ? `Status updated to ${statusLabel}: ${note}` : `Order status updated to ${statusLabel}`,
        updated_by: adminName,
      },
    });

    if (res.success) {
      revalidatePath('/dashboard/orders');
      revalidatePath('/account/orders');
      return { success: true };
    }
    return { error: res.error || 'Failed to update order status.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order status.';
    return { error: message };
  }
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus,
  note?: string
): Promise<OrderActionResult> {
  try {
    const session = await verifyAdminSession();

    const parsed = paymentStatusSchema.safeParse({ payment_status: paymentStatus, note });
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const adminName = session.user?.name || 'Admin';

    const res = await updateAdminOrder(orderId, {
      payment_status: paymentStatus,
      timelineEvent: {
        status: `payment_${paymentStatus}`,
        message: note
          ? `Payment status set to ${paymentStatus.toUpperCase()}: ${note}`
          : `Payment status updated to ${paymentStatus.toUpperCase()}`,
        updated_by: adminName,
      },
    });

    if (res.success) {
      revalidatePath('/dashboard/orders');
      revalidatePath('/account/orders');
      return { success: true };
    }
    return { error: res.error || 'Failed to update payment status.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update payment status.';
    return { error: message };
  }
}

export async function updateDeliveryInfoAction(
  orderId: string,
  courier: string,
  trackingNumber: string,
  deliveryStatus?: string
): Promise<OrderActionResult> {
  try {
    const session = await verifyAdminSession();

    const parsed = deliveryInfoSchema.safeParse({
      courier,
      tracking_number: trackingNumber,
      delivery_status: deliveryStatus,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const adminName = session.user?.name || 'Admin';

    const res = await updateAdminOrder(orderId, {
      courier: courier.trim(),
      tracking_number: trackingNumber.trim(),
      delivery_status: deliveryStatus?.trim() || 'In Transit',
      timelineEvent: {
        status: 'shipped',
        message: `Dispatched via ${courier.trim()} (Tracking #${trackingNumber.trim()})`,
        updated_by: adminName,
      },
    });

    if (res.success) {
      revalidatePath('/dashboard/orders');
      revalidatePath('/account/orders');
      return { success: true };
    }
    return { error: res.error || 'Failed to update delivery info.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update delivery info.';
    return { error: message };
  }
}

export async function addAdminNoteAction(orderId: string, note: string): Promise<OrderActionResult> {
  try {
    const session = await verifyAdminSession();

    const parsed = adminNoteSchema.safeParse({ note });
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const adminName = session.user?.name || 'Admin';

    const res = await updateAdminOrder(orderId, {
      admin_notes: note.trim(),
      timelineEvent: {
        status: 'note_added',
        message: `Internal admin note added: ${note.trim()}`,
        updated_by: adminName,
      },
    });

    if (res.success) {
      revalidatePath('/dashboard/orders');
      return { success: true };
    }
    return { error: res.error || 'Failed to add admin note.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add admin note.';
    return { error: message };
  }
}
