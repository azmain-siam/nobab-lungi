'use server';

import { validateCoupon, type CouponValidationResult } from '@/services/coupon-service';

export async function validateCouponAction(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  return await validateCoupon(code, subtotal);
}
