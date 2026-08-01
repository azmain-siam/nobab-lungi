import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  desktop_image: string;
  mobile_image?: string | null;
  primary_btn_text?: string | null;
  primary_btn_url?: string | null;
  secondary_btn_text?: string | null;
  secondary_btn_url?: string | null;
  is_active: boolean;
  is_primary: boolean;
  sort_order: number;
  start_date?: Date | null;
  end_date?: Date | null;
  created_at: Date;
  updated_at: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: null },
    description: { type: String, default: null },
    desktop_image: { type: String, required: true },
    mobile_image: { type: String, default: null },
    primary_btn_text: { type: String, default: null },
    primary_btn_url: { type: String, default: null },
    secondary_btn_text: { type: String, default: null },
    secondary_btn_url: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    is_primary: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Banner;
}

export const Banner: Model<IBanner> =
  (mongoose.models.Banner as Model<IBanner>) || mongoose.model<IBanner>('Banner', BannerSchema);
