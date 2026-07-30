import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: null },
    image_url: { type: String, required: true },
    link: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
