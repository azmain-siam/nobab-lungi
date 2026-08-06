import { connectToDatabase } from '@/lib/db';
import { WishlistModel } from '@/models/Wishlist';
import { Product as ProductModel } from '@/models/Product';
import type { ProductWithImages, WishlistInsights, MostWishlistedProductItem } from '@/types';
import mongoose from 'mongoose';

function mapProductDocToWithImages(doc: Record<string, unknown>): ProductWithImages {
  const images = (doc.product_images as Record<string, unknown>[]) || [];
  const rawCollectionIds = doc.collection_ids || doc.collections;
  const collection_ids = Array.isArray(rawCollectionIds)
    ? (rawCollectionIds as unknown[]).map((id) => Number(id)).filter((id) => !isNaN(id))
    : [];

  return {
    id: String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    sku: (doc.sku as string) ?? null,
    short_description: (doc.short_description as string) ?? null,
    description: (doc.description as string) ?? null,
    price: doc.price as number,
    discount_price: (doc.discount_price as number) ?? null,
    stock: doc.stock as number,
    category_id: (doc.category_id as number) ?? null,
    collection_ids,
    fabric: (doc.fabric as string) ?? null,
    pattern: (doc.pattern as string) ?? null,
    color: (doc.color as string) ?? null,
    weight: (doc.weight as string) ?? null,
    country_of_origin: (doc.country_of_origin as string) ?? 'Bangladesh',
    status: (doc.status as 'published' | 'draft') ?? 'published',
    is_featured: (doc.is_featured as boolean) ?? false,
    is_best_seller: (doc.is_best_seller as boolean) ?? false,
    is_new_arrival: (doc.is_new_arrival as boolean) ?? false,
    is_active: (doc.is_active as boolean) ?? true,
    seo_title: (doc.seo_title as string) ?? null,
    seo_description: (doc.seo_description as string) ?? null,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
    product_images: images.map((img) => ({
      id: img._id ? String(img._id) : String(doc._id),
      product_id: String(doc._id),
      url: img.url as string,
      alt_text: (img.alt_text as string) ?? null,
      sort_order: (img.sort_order as number) ?? 0,
      is_cover: (img.is_cover as boolean) ?? false,
    })),
  };
}

export async function addToWishlist(userId: string, productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    // Verify product exists
    const filterQuery: Record<string, unknown> = {};
    if (mongoose.Types.ObjectId.isValid(productId)) {
      filterQuery._id = productId;
    } else {
      filterQuery.slug = productId;
    }

    const product = await ProductModel.findOne(filterQuery).lean();
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const targetProductId = String(product._id);

    // Upsert into wishlist collection
    try {
      await WishlistModel.create({
        user_id: userId,
        product_id: targetProductId,
      });
    } catch (err: unknown) {
      // 11000 is Mongo duplicate key error; item is already wishlisted
      const isDuplicate = err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 11000;
      if (!isDuplicate) {
        throw err;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'Failed to add product to wishlist' };
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();

    let targetProductId = productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const product = await ProductModel.findOne({ slug: productId }).lean();
      if (product) targetProductId = String(product._id);
    }

    await WishlistModel.deleteOne({ user_id: userId, product_id: targetProductId });
    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: 'Failed to remove product from wishlist' };
  }
}

export async function getUserWishlistProductIds(userId: string): Promise<string[]> {
  try {
    await connectToDatabase();
    const items = await WishlistModel.find({ user_id: userId }).select('product_id').lean();
    return items.map((i) => String(i.product_id));
  } catch (error) {
    console.error('Error fetching wishlist product IDs:', error);
    return [];
  }
}

export async function getUserWishlist(userId: string): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();

    const wishlistDocs = await WishlistModel.find({ user_id: userId }).sort({ created_at: -1 }).lean();
    if (!wishlistDocs.length) return [];

    const productIds = wishlistDocs.map((w) => w.product_id);
    const validObjectIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    // Batch query to fetch products matching user's wishlist
    const productDocs = await ProductModel.find({
      _id: { $in: validObjectIds },
      is_active: true,
      status: 'published',
    }).lean();

    const productMap = new Map<string, Record<string, unknown>>();
    productDocs.forEach((p) => {
      productMap.set(String(p._id), p as unknown as Record<string, unknown>);
    });

    // Clean up stale wishlist entries if referenced product was permanently deleted
    const staleProductIds = productIds.filter((id) => !productMap.has(id));
    if (staleProductIds.length > 0) {
      WishlistModel.deleteMany({ user_id: userId, product_id: { $in: staleProductIds } }).catch((e) =>
        console.error('Error cleaning up stale wishlist records:', e)
      );
    }

    // Preserve order of user's wishlist created_at
    const result: ProductWithImages[] = [];
    for (const doc of wishlistDocs) {
      const rawProduct = productMap.get(doc.product_id);
      if (rawProduct) {
        result.push(mapProductDocToWithImages(rawProduct));
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching user wishlist:', error);
    return [];
  }
}

export async function checkIsWishlisted(userId: string, productId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    let targetProductId = productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const product = await ProductModel.findOne({ slug: productId }).lean();
      if (product) targetProductId = String(product._id);
    }

    const count = await WishlistModel.countDocuments({ user_id: userId, product_id: targetProductId });
    return count > 0;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }
}

export async function getAdminWishlistInsights(): Promise<WishlistInsights> {
  try {
    await connectToDatabase();

    const total_saves = await WishlistModel.countDocuments();
    const uniqueCustomers = await WishlistModel.distinct('user_id');

    // Aggregate wishlist items grouped by product_id
    const aggregated = await WishlistModel.aggregate([
      { $group: { _id: '$product_id', wishlist_count: { $sum: 1 } } },
      { $sort: { wishlist_count: -1 } },
    ]);

    const wishlisted_products_count = aggregated.length;

    const targetProductIds = aggregated
      .map((item) => String(item._id))
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const productDocs = await ProductModel.find({ _id: { $in: targetProductIds } }).lean();

    const productMap = new Map<string, Record<string, unknown>>();
    productDocs.forEach((p) => productMap.set(String(p._id), p as unknown as Record<string, unknown>));

    let high_demand_low_stock_count = 0;
    const most_wishlisted_products: MostWishlistedProductItem[] = [];

    for (const item of aggregated) {
      const productIdStr = String(item._id);
      const rawProduct = productMap.get(productIdStr);
      if (!rawProduct) continue;

      const stock = Number(rawProduct.stock || 0);
      const wishlistCount = Number(item.wishlist_count || 0);
      const isHighDemandLowStock = wishlistCount >= 2 && stock <= 5;

      if (isHighDemandLowStock) {
        high_demand_low_stock_count++;
      }

      const images = (rawProduct.product_images as Record<string, unknown>[]) || [];
      const coverImage =
        images.find((img) => img.is_cover)?.url as string ||
        images[0]?.url as string ||
        'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop';

      most_wishlisted_products.push({
        id: String(rawProduct._id),
        name: rawProduct.name as string,
        slug: rawProduct.slug as string,
        image: coverImage,
        price: Number(rawProduct.discount_price ?? rawProduct.price ?? 0),
        stock,
        status: (rawProduct.status as 'published' | 'draft') ?? 'published',
        wishlist_count: wishlistCount,
        is_high_demand_low_stock: isHighDemandLowStock,
      });
    }

    return {
      total_saves,
      unique_customers: uniqueCustomers.length,
      wishlisted_products_count,
      high_demand_low_stock_count,
      most_wishlisted_products,
    };
  } catch (error) {
    console.error('Error fetching admin wishlist insights:', error);
    return {
      total_saves: 0,
      unique_customers: 0,
      wishlisted_products_count: 0,
      high_demand_low_stock_count: 0,
      most_wishlisted_products: [],
    };
  }
}
