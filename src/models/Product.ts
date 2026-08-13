import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductImage {
  id?: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_cover?: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string | null;
  short_description?: string | null;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  stock: number;
  category_id?: number | null;
  collection_ids?: number[];
  fabric?: string | null;
  pattern?: string | null;
  color?: string | null;
  weight?: string | null;
  country_of_origin?: string;
  status: 'published' | 'draft';
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  translations?: Record<string, any> | null;
  product_images: IProductImage[];
  created_at: Date;
  updated_at: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt_text: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
    is_cover: { type: Boolean, default: false },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, default: null, trim: true },
    short_description: { type: String, default: null },
    description: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    discount_price: { type: Number, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category_id: { type: Number, default: null },
    collection_ids: { type: [Number], default: [] },
    fabric: { type: String, default: null },
    pattern: { type: String, default: null },
    color: { type: String, default: null },
    weight: { type: String, default: null },
    country_of_origin: { type: String, default: 'Bangladesh' },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    is_featured: { type: Boolean, default: false },
    is_best_seller: { type: Boolean, default: false },
    is_new_arrival: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    seo_title: { type: String, default: null },
    seo_description: { type: String, default: null },
    translations: { type: Schema.Types.Mixed, default: {} },
    product_images: [ProductImageSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

ProductSchema.index({ category_id: 1, status: 1 });
ProductSchema.index({ collection_ids: 1, status: 1 });
ProductSchema.index({ status: 1, created_at: -1 });
ProductSchema.index({ is_featured: 1, is_active: 1 });
ProductSchema.index({ is_best_seller: 1, is_active: 1 });
ProductSchema.index({ is_new_arrival: 1, is_active: 1 });

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Product;
}

export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);
