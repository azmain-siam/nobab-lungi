import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWishlist extends Document {
  user_id: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user_id: { type: String, required: true, index: true },
    product_id: { type: String, required: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound Unique Index to prevent duplicate wishlist items at DB level
WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).Wishlist;
}

export const WishlistModel: Model<IWishlist> =
  (mongoose.models.Wishlist as Model<IWishlist>) ||
  mongoose.model<IWishlist>('Wishlist', WishlistSchema);
