import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  id?: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  stock: number;
  category_id?: number | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  product_images: IProductImage[];
  created_at: Date;
  updated_at: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt_text: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, default: null },
    description: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    discount_price: { type: Number, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category_id: { type: Number, default: null },
    is_featured: { type: Boolean, default: false },
    is_best_seller: { type: Boolean, default: false },
    is_new_arrival: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    seo_title: { type: String, default: null },
    seo_description: { type: String, default: null },
    product_images: [ProductImageSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
