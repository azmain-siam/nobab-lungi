import { connectToDatabase } from '@/lib/db';
import { Coupon as CouponModel } from '@/models/Coupon';
import type { Coupon as CouponType } from '@/types';

export interface CouponValidationResult {
  success: boolean;
  code?: string;
  discountAmount?: number;
  type?: 'percentage' | 'fixed';
  value?: number;
  error?: string;
}

function mapDocToCoupon(doc: Record<string, unknown>): CouponType {
  return {
    id: Number(doc.id || doc._id),
    code: (doc.code as string) || '',
    type: (doc.type as 'percentage' | 'fixed') || 'fixed',
    value: Number(doc.value) || 0,
    minimum_amount: Number(doc.minimum_amount) || 0,
    max_discount_amount: typeof doc.max_discount_amount === 'number' ? doc.max_discount_amount : null,
    usage_limit: typeof doc.usage_limit === 'number' ? doc.usage_limit : null,
    used_count: Number(doc.used_count) || 0,
    start_date: doc.start_date ? new Date(doc.start_date as Date).toISOString() : null,
    end_date: doc.end_date ? new Date(doc.end_date as Date).toISOString() : null,
    is_active: doc.is_active !== false,
    created_at: doc.created_at ? new Date(doc.created_at as Date).toISOString() : new Date().toISOString(),
  };
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

    const coupon = await CouponModel.findOne({ code: normalizedCode, is_active: true }).lean();

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
      return { success: false, error: 'Coupon usage limit has been reached.' };
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

export async function incrementCouponUsage(code: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const normalizedCode = code.trim().toUpperCase();
    const res = await CouponModel.updateOne(
      { code: normalizedCode },
      { $inc: { used_count: 1 } }
    );
    return res.modifiedCount > 0;
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
    return false;
  }
}

export async function getAllAdminCoupons(options?: {
  search?: string;
  status?: string; // 'all' | 'active' | 'inactive' | 'expired'
}): Promise<CouponType[]> {
  try {
    await connectToDatabase();

    const query: Record<string, unknown> = {};
    const search = options?.search?.trim();
    const status = options?.status || 'all';

    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    if (status === 'active') {
      query.is_active = true;
    } else if (status === 'inactive') {
      query.is_active = false;
    }

    const docs = await CouponModel.find(query).sort({ created_at: -1 }).lean();
    let coupons = docs.map((d) => mapDocToCoupon(d as unknown as Record<string, unknown>));

    if (status === 'expired') {
      const now = new Date().toISOString();
      coupons = coupons.filter((c) => c.end_date && c.end_date < now);
    }

    return coupons;
  } catch (error) {
    console.error('Error fetching admin coupons:', error);
    return [];
  }
}

export interface CreateCouponInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount?: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

export async function createCoupon(
  input: CreateCouponInput
): Promise<{ success: boolean; coupon?: CouponType; error?: string }> {
  try {
    await connectToDatabase();

    const normalizedCode = input.code.trim().toUpperCase();
    if (!normalizedCode) {
      return { success: false, error: 'Coupon code is required.' };
    }

    const existing = await CouponModel.findOne({ code: normalizedCode }).lean();
    if (existing) {
      return { success: false, error: `Coupon code "${normalizedCode}" already exists.` };
    }

    const maxDoc = await CouponModel.findOne().sort({ id: -1 }).lean();
    const nextId = maxDoc && typeof maxDoc.id === 'number' ? maxDoc.id + 1 : 1;

    const newCoupon = await CouponModel.create({
      id: nextId,
      code: normalizedCode,
      type: input.type,
      value: input.value,
      minimum_amount: input.minimum_amount || 0,
      max_discount_amount: input.max_discount_amount ?? null,
      usage_limit: input.usage_limit ?? null,
      used_count: 0,
      start_date: input.start_date ? new Date(input.start_date) : null,
      end_date: input.end_date ? new Date(input.end_date) : null,
      is_active: input.is_active !== false,
    });

    return {
      success: true,
      coupon: mapDocToCoupon(JSON.parse(JSON.stringify(newCoupon))),
    };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return { success: false, error: 'Failed to create coupon.' };
  }
}

export async function updateCoupon(
  idOrCode: string | number,
  input: Partial<CreateCouponInput>
): Promise<{ success: boolean; coupon?: CouponType; error?: string }> {
  try {
    await connectToDatabase();

    const query = typeof idOrCode === 'number' || !isNaN(Number(idOrCode))
      ? { id: Number(idOrCode) }
      : { code: String(idOrCode).toUpperCase() };

    const coupon = await CouponModel.findOne(query);
    if (!coupon) {
      return { success: false, error: 'Coupon not found.' };
    }

    if (input.code) {
      const newCode = input.code.trim().toUpperCase();
      if (newCode !== coupon.code) {
        const existing = await CouponModel.findOne({ code: newCode }).lean();
        if (existing) {
          return { success: false, error: `Coupon code "${newCode}" is already in use.` };
        }
        coupon.code = newCode;
      }
    }

    if (input.type) coupon.type = input.type;
    if (typeof input.value === 'number') coupon.value = input.value;
    if (typeof input.minimum_amount === 'number') coupon.minimum_amount = input.minimum_amount;
    if (input.max_discount_amount !== undefined) coupon.max_discount_amount = input.max_discount_amount;
    if (input.usage_limit !== undefined) coupon.usage_limit = input.usage_limit;
    if (input.start_date !== undefined) coupon.start_date = input.start_date ? new Date(input.start_date) : null;
    if (input.end_date !== undefined) coupon.end_date = input.end_date ? new Date(input.end_date) : null;
    if (typeof input.is_active === 'boolean') coupon.is_active = input.is_active;

    await coupon.save();

    return {
      success: true,
      coupon: mapDocToCoupon(coupon.toObject() as unknown as Record<string, unknown>),
    };
  } catch (error) {
    console.error('Error updating coupon:', error);
    return { success: false, error: 'Failed to update coupon.' };
  }
}

export async function deleteCoupon(
  idOrCode: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const query = typeof idOrCode === 'number' || !isNaN(Number(idOrCode))
      ? { id: Number(idOrCode) }
      : { code: String(idOrCode).toUpperCase() };

    const res = await CouponModel.deleteOne(query);
    if (res.deletedCount === 0) {
      return { success: false, error: 'Coupon not found.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return { success: false, error: 'Failed to delete coupon.' };
  }
}

export async function toggleCouponStatus(
  idOrCode: string | number
): Promise<{ success: boolean; is_active?: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const query = typeof idOrCode === 'number' || !isNaN(Number(idOrCode))
      ? { id: Number(idOrCode) }
      : { code: String(idOrCode).toUpperCase() };

    const coupon = await CouponModel.findOne(query);
    if (!coupon) {
      return { success: false, error: 'Coupon not found.' };
    }

    coupon.is_active = !coupon.is_active;
    await coupon.save();

    return { success: true, is_active: coupon.is_active };
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return { success: false, error: 'Failed to toggle status.' };
  }
}
