import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_type: 'lungi' | 'saree';
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null },
    image_url: { type: String, default: null },
    parent_type: { type: String, enum: ['lungi', 'saree'], required: true },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Category;
}

export const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);
