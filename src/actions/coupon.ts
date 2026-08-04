'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  validateCoupon,
  getAllAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  type CouponValidationResult,
  type CreateCouponInput,
} from '@/services/coupon-service';

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function validateCouponAction(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  return await validateCoupon(code, subtotal);
}

export async function getAdminCouponsAction(options?: {
  search?: string;
  status?: string;
}) {
  await verifyAdminSession();
  return await getAllAdminCoupons(options);
}

export async function createCouponAction(input: CreateCouponInput) {
  await verifyAdminSession();
  return await createCoupon(input);
}

export async function updateCouponAction(
  idOrCode: string | number,
  input: Partial<CreateCouponInput>
) {
  await verifyAdminSession();
  return await updateCoupon(idOrCode, input);
}

export async function deleteCouponAction(idOrCode: string | number) {
  await verifyAdminSession();
  return await deleteCoupon(idOrCode);
}

export async function toggleCouponStatusAction(idOrCode: string | number) {
  await verifyAdminSession();
  return await toggleCouponStatus(idOrCode);
}
