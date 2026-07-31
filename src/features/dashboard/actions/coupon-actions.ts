'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import {
  getAdminCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCouponCode,
} from '@/services/coupon-service';
import type { CouponInput } from '@/lib/validations/coupon';

export interface CouponActionResult {
  success?: boolean;
  couponId?: number;
  error?: string;
}

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchAdminCouponsAction(options?: {
  search?: string;
  filter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminCoupons(options);
}

export async function fetchCouponDetailsAction(id: number) {
  await verifyAdminSession();
  return getCouponById(id);
}

export async function createCouponAction(input: CouponInput): Promise<CouponActionResult> {
  try {
    await verifyAdminSession();
    const res = await createCoupon(input);
    if (res.success) {
      revalidatePath('/dashboard/coupons');
      revalidatePath('/checkout');
      return { success: true, couponId: res.couponId };
    }
    return { error: res.error || 'Failed to create coupon.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create coupon.';
    return { error: message };
  }
}

export async function updateCouponAction(id: number, input: CouponInput): Promise<CouponActionResult> {
  try {
    await verifyAdminSession();
    const res = await updateCoupon(id, input);
    if (res.success) {
      revalidatePath('/dashboard/coupons');
      revalidatePath('/checkout');
      return { success: true };
    }
    return { error: res.error || 'Failed to update coupon.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update coupon.';
    return { error: message };
  }
}

export async function deleteCouponAction(id: number): Promise<CouponActionResult> {
  try {
    await verifyAdminSession();
    const res = await deleteCoupon(id);
    if (res.success) {
      revalidatePath('/dashboard/coupons');
      revalidatePath('/checkout');
      return { success: true };
    }
    return { error: res.error || 'Failed to delete coupon.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete coupon.';
    return { error: message };
  }
}

export async function validateCouponAction(code: string, cartSubtotal: number) {
  return validateCouponCode(code, cartSubtotal);
}
