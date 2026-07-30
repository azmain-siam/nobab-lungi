import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  id: number;
  name: string;
  slug: string;
  description?: string;
  banner_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null },
    banner_url: { type: String, default: null },
    is_featured: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
