import { connectToDatabase } from '@/lib/db';
import { Coupon } from '@/models/Coupon';

export interface CouponValidationResult {
  success: boolean;
  code?: string;
  discountAmount?: number;
  type?: 'percentage' | 'fixed';
  value?: number;
  error?: string;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  try {
    await connectToDatabase();

    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      return { success: false, error: 'Please enter a coupon code.' };
    }

    const coupon = await Coupon.findOne({ code: normalizedCode, is_active: true }).lean();

    if (!coupon) {
      return { success: false, error: 'Invalid or expired coupon code.' };
    }

    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return { success: false, error: 'This coupon is not active yet.' };
    }

    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return { success: false, error: 'This coupon has expired.' };
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { success: false, error: 'Coupon usage limit reached.' };
    }

    if (coupon.minimum_amount && subtotal < coupon.minimum_amount) {
      return {
        success: false,
        error: `Minimum order amount of ৳${coupon.minimum_amount.toLocaleString('en-BD')} required for this coupon.`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return {
      success: true,
      code: coupon.code,
      discountAmount,
      type: coupon.type,
      value: coupon.value,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, error: 'Error validating coupon. Please try again.' };
  }
}
