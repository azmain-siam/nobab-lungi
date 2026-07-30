import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_type: 'lungi' | 'saree';
  sort_order: number;
  created_at: Date;
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
