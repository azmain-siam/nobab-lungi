import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { Category as CategoryModel } from '@/models/Category';
import type { ProductWithImages } from '@/types';

export interface AdminProductListItem extends ProductWithImages {
  category_name?: string | null;
}

function mapProductToProductWithImages(doc: Record<string, unknown>): ProductWithImages {
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
    short_description: (doc.short_description as string) ?? (doc.summary as string) ?? null,
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

export async function getNewArrivals(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_new_arrival: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export async function getBestSellers(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_best_seller: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_featured: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getAdminProducts(options?: {
  search?: string;
  categoryId?: number;
  collectionId?: number;
  status?: string; // 'published' | 'draft' | 'all'
  stockFilter?: string; // 'in_stock' | 'out_of_stock' | 'all'
  flagFilter?: string; // 'featured' | 'best_seller' | 'new_arrival' | 'all'
  sort?: string; // 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'
  page?: number;
  limit?: number;
}): Promise<{ products: AdminProductListItem[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const categoryId = options?.categoryId;
    const collectionId = options?.collectionId;
    const status = options?.status || 'all';
    const stockFilter = options?.stockFilter || 'all';
    const flagFilter = options?.flagFilter || 'all';
    const sort = options?.sort || 'newest';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 8);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId && categoryId > 0) {
      query.category_id = Number(categoryId);
    }

    if (collectionId && collectionId > 0) {
      query.collection_ids = Number(collectionId);
    }

    if (status === 'published') {
      query.status = 'published';
    } else if (status === 'draft') {
      query.status = 'draft';
    }

    if (stockFilter === 'in_stock') {
      query.stock = { $gt: 0 };
    } else if (stockFilter === 'out_of_stock') {
      query.stock = { $lte: 0 };
    }

    if (flagFilter === 'featured') {
      query.is_featured = true;
    } else if (flagFilter === 'best_seller') {
      query.is_best_seller = true;
    } else if (flagFilter === 'new_arrival') {
      query.is_new_arrival = true;
    }

    let sortOption: Record<string, 1 | -1> = { created_at: -1 };

    switch (sort) {
      case 'oldest':
        sortOption = { created_at: 1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'stock_asc':
        sortOption = { stock: 1 };
        break;
      case 'stock_desc':
        sortOption = { stock: -1 };
        break;
      default:
        sortOption = { created_at: -1 };
    }

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const docs = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Map category names for display
    const categories = await CategoryModel.find().lean();
    const categoryMap = new Map<number, string>();
    categories.forEach((c) => categoryMap.set(c.id, c.name));

    const products: AdminProductListItem[] = docs.map((doc) => {
      const p = mapProductToProductWithImages(doc as unknown as Record<string, unknown>);
      const catName = p.category_id ? categoryMap.get(p.category_id) || null : null;
      return {
        ...p,
        category_name: catName,
      };
    });

    return { products, total, pages };
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return { products: [], total: 0, pages: 1 };
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug, is_active: true }).lean();

    if (!product) return null;
    return mapProductToProductWithImages(product as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  try {
    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) return null;
    return mapProductToProductWithImages(product as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return null;
  }
}
