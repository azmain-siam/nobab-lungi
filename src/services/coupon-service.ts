import { connectToDatabase } from '@/lib/db';
import { Coupon } from '@/models/Coupon';
import type { Coupon as CouponType } from '@/types';
import { couponSchema, type CouponInput } from '@/lib/validations/coupon';

function mapDocToCoupon(doc: Record<string, unknown>): CouponType {
  return {
    id: Number(doc.id || doc._id),
    code: (doc.code as string).toUpperCase(),
    description: (doc.description as string) ?? null,
    type: doc.type as 'percentage' | 'fixed',
    value: doc.value as number,
    minimum_amount: (doc.minimum_amount as number) ?? 0,
    max_discount_amount: (doc.max_discount_amount as number) ?? null,
    usage_limit: (doc.usage_limit as number) ?? null,
    used_count: (doc.used_count as number) ?? 0,
    one_per_customer: (doc.one_per_customer as boolean) ?? false,
    start_date: doc.start_date ? new Date(doc.start_date as Date).toISOString() : null,
    end_date: doc.end_date ? new Date(doc.end_date as Date).toISOString() : null,
    is_active: (doc.is_active as boolean) ?? true,
    created_at: doc.created_at ? new Date(doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? new Date(doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getAdminCoupons(options?: {
  search?: string;
  filter?: string; // 'all' | 'active' | 'inactive' | 'expired' | 'percentage' | 'fixed'
  sort?: string;   // 'newest' | 'oldest' | 'expiry_date' | 'usage_count' | 'code'
  page?: number;
  limit?: number;
}): Promise<{ coupons: CouponType[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const filter = options?.filter || 'all';
    const sort = options?.sort || 'newest';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 8);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const now = new Date();

    if (filter === 'active') {
      query.is_active = true;
    } else if (filter === 'inactive') {
      query.is_active = false;
    } else if (filter === 'expired') {
      query.end_date = { $lt: now };
    } else if (filter === 'percentage') {
      query.type = 'percentage';
    } else if (filter === 'fixed') {
      query.type = 'fixed';
    }

    let sortOption: Record<string, 1 | -1> = { created_at: -1 };
    switch (sort) {
      case 'oldest':
        sortOption = { created_at: 1 };
        break;
      case 'expiry_date':
        sortOption = { end_date: 1 };
        break;
      case 'usage_count':
        sortOption = { used_count: -1 };
        break;
      case 'code':
        sortOption = { code: 1 };
        break;
      case 'newest':
      default:
        sortOption = { created_at: -1 };
    }

    const total = await Coupon.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const docs = await Coupon.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const coupons = docs.map((doc) => mapDocToCoupon(doc as unknown as Record<string, unknown>));

    return { coupons, total, pages };
  } catch (error) {
    console.error('Error fetching admin coupons:', error);
    return { coupons: [], total: 0, pages: 1 };
  }
}

export async function getCouponById(id: number): Promise<CouponType | null> {
  try {
    await connectToDatabase();
    const doc = await Coupon.findOne({ id }).lean();
    if (!doc) return null;
    return mapDocToCoupon(doc as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching coupon by ID:', error);
    return null;
  }
}

export async function createCoupon(input: CouponInput): Promise<{ success: boolean; couponId?: number; error?: string }> {
  try {
    await connectToDatabase();

    const parsed = couponSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    // Check code uniqueness
    const existing = await Coupon.findOne({ code: data.code }).lean();
    if (existing) {
      return { success: false, error: `Coupon code "${data.code}" already exists.` };
    }

    const numericId = Date.now();

    const newCoupon = await Coupon.create({
      id: numericId,
      code: data.code,
      description: data.description || null,
      type: data.type,
      value: data.value,
      minimum_amount: data.minimum_amount || 0,
      max_discount_amount: data.max_discount_amount || null,
      usage_limit: data.usage_limit || null,
      used_count: 0,
      one_per_customer: data.one_per_customer || false,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
      is_active: data.is_active,
    });

    return { success: true, couponId: newCoupon.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create coupon.';
    return { success: false, error: message };
  }
}

export async function updateCoupon(id: number, input: CouponInput): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const parsed = couponSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    // Check code uniqueness if changed
    const existing = await Coupon.findOne({ code: data.code, id: { $ne: id } }).lean();
    if (existing) {
      return { success: false, error: `Coupon code "${data.code}" is already in use by another coupon.` };
    }

    await Coupon.findOneAndUpdate(
      { id },
      {
        $set: {
          code: data.code,
          description: data.description || null,
          type: data.type,
          value: data.value,
          minimum_amount: data.minimum_amount || 0,
          max_discount_amount: data.max_discount_amount || null,
          usage_limit: data.usage_limit || null,
          one_per_customer: data.one_per_customer || false,
          start_date: data.start_date ? new Date(data.start_date) : null,
          end_date: data.end_date ? new Date(data.end_date) : null,
          is_active: data.is_active,
          updated_at: new Date(),
        },
      }
    );

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update coupon.';
    return { success: false, error: message };
  }
}

export async function deleteCoupon(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const res = await Coupon.deleteOne({ id });
    if (res.deletedCount === 0) {
      return { success: false, error: 'Coupon not found.' };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete coupon.';
    return { success: false, error: message };
  }
}

export async function validateCouponCode(
  code: string,
  cartSubtotal: number
): Promise<{
  isValid: boolean;
  discountAmount: number;
  coupon?: CouponType;
  error?: string;
}> {
  try {
    await connectToDatabase();

    const cleanCode = code.trim().toUpperCase();
    const doc = await Coupon.findOne({ code: cleanCode }).lean();

    if (!doc) {
      return { isValid: false, discountAmount: 0, error: `Invalid coupon code "${cleanCode}".` };
    }

    const coupon = mapDocToCoupon(doc as unknown as Record<string, unknown>);
    const now = new Date();

    if (!coupon.is_active) {
      return { isValid: false, discountAmount: 0, error: 'This coupon is currently inactive.' };
    }

    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return { isValid: false, discountAmount: 0, error: 'This coupon promotion has not started yet.' };
    }

    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return { isValid: false, discountAmount: 0, error: 'This coupon has expired.' };
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { isValid: false, discountAmount: 0, error: 'This coupon has reached its maximum usage limit.' };
    }

    if (cartSubtotal < coupon.minimum_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        error: `Minimum order subtotal of ৳${coupon.minimum_amount.toLocaleString('en-BD')} is required for this coupon.`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.value) / 100);
      if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
        discountAmount = coupon.max_discount_amount;
      }
    } else {
      discountAmount = Math.min(coupon.value, cartSubtotal);
    }

    return {
      isValid: true,
      discountAmount,
      coupon,
    };
  } catch (error) {
    console.error('Error validating coupon code:', error);
    return { isValid: false, discountAmount: 0, error: 'Failed to validate coupon code.' };
  }
}
