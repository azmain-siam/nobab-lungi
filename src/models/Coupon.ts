import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  id: number;
  code: string;
  description?: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_amount: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  one_per_customer: boolean;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: Number, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: null, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true },
    minimum_amount: { type: Number, default: 0 },
    max_discount_amount: { type: Number, default: null },
    usage_limit: { type: Number, default: null },
    used_count: { type: Number, default: 0 },
    one_per_customer: { type: Boolean, default: false },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Coupon;
}

export const Coupon: Model<ICoupon> =
  (mongoose.models.Coupon as Model<ICoupon>) || mongoose.model<ICoupon>('Coupon', CouponSchema);
