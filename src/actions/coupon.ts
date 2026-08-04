'use server';

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
  return await getAllAdminCoupons(options);
}

export async function createCouponAction(input: CreateCouponInput) {
  return await createCoupon(input);
}

export async function updateCouponAction(
  idOrCode: string | number,
  input: Partial<CreateCouponInput>
) {
  return await updateCoupon(idOrCode, input);
}

export async function deleteCouponAction(idOrCode: string | number) {
  return await deleteCoupon(idOrCode);
}

export async function toggleCouponStatusAction(idOrCode: string | number) {
  return await toggleCouponStatus(idOrCode);
}
