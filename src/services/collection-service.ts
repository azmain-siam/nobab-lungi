import { connectToDatabase } from '@/lib/db';
import { Collection as CollectionModel } from '@/models/Collection';
import type { Collection } from '@/types';

function mapDocToCollection(doc: Record<string, unknown>, productCount = 0, locale?: string): Collection {
  const translations = (doc.translations as Record<string, Record<string, string>>) || {};
  const bn = translations.bn || {};

  const name = (locale === 'bn' && bn.name) ? bn.name : (doc.name as string);
  const description = (locale === 'bn' && bn.description) ? bn.description : ((doc.description as string) ?? null);

  return {
    id: Number(doc.id || doc._id),
    name,
    slug: doc.slug as string,
    description,
    cover_image: (doc.cover_image as string) ?? null,
    banner_url: (doc.banner_url as string) ?? null,
    is_featured: (doc.is_featured as boolean) ?? false,
    sort_order: (doc.sort_order as number) ?? 0,
    is_active: (doc.is_active as boolean) ?? true,
    seo_title: (doc.seo_title as string) ?? null,
    seo_description: (doc.seo_description as string) ?? null,
    product_count: productCount,
    translations: doc.translations as Collection['translations'],
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getPublicCollections(locale?: string): Promise<Collection[]> {
  try {
    await connectToDatabase();
    const { Product } = await import('@/models/Product');

    const docs = await CollectionModel.find({ is_active: true })
      .sort({ sort_order: 1, created_at: -1 })
      .lean();

    // Aggregation query to count active products per collection
    const counts = await Product.aggregate([
      { $match: { is_active: true, status: 'published' } },
      { $unwind: '$collection_ids' },
      { $group: { _id: '$collection_ids', count: { $sum: 1 } } },
    ]);

    const countMap = new Map<number, number>();
    counts.forEach((item) => {
      countMap.set(Number(item._id), item.count);
    });

    const collections = docs
      .map((doc) => {
        const idNum = Number(doc.id);
        const productCount = countMap.get(idNum) || 0;
        return mapDocToCollection(doc as unknown as Record<string, unknown>, productCount, locale);
      })
      // Filter out any saree-related collections (Brand Requirement: LUNGI focused)
      .filter((c) => {
        const nameLower = c.name.toLowerCase();
        const descLower = (c.description || '').toLowerCase();
        return !nameLower.includes('saree') && !descLower.includes('saree');
      });

    return collections;
  } catch (error) {
    console.error('Error fetching public collections:', error);
    return [];
  }
}

export async function getFeaturedCollections(locale?: string): Promise<Collection[]> {
  try {
    await connectToDatabase();
    const collections = await CollectionModel.find({ is_featured: true, is_active: true })
      .sort({ sort_order: 1 })
      .lean();

    return collections
      .map((c) => mapDocToCollection(c as unknown as Record<string, unknown>, 0, locale))
      .filter((c) => {
        const nameLower = c.name.toLowerCase();
        const descLower = (c.description || '').toLowerCase();
        return !nameLower.includes('saree') && !descLower.includes('saree');
      });
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return [];
  }
}

export async function getAdminCollections(options?: {
  search?: string;
  status?: string;
  featured?: string;
  page?: number;
  limit?: number;
}): Promise<{ collections: Collection[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const status = options?.status || 'all';
    const featured = options?.featured || 'all';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 8);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'active') {
      query.is_active = true;
    } else if (status === 'inactive') {
      query.is_active = false;
    }

    if (featured === 'featured') {
      query.is_featured = true;
    } else if (featured === 'standard') {
      query.is_featured = false;
    }

    const total = await CollectionModel.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const docs = await CollectionModel.find(query)
      .sort({ sort_order: 1, created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const collections = docs.map((doc) => mapDocToCollection(doc as unknown as Record<string, unknown>, 0));

    return {
      collections,
      total,
      pages,
    };
  } catch (error) {
    console.error('Error fetching admin collections:', error);
    return { collections: [], total: 0, pages: 1 };
  }
}

export async function getCollectionBySlug(slug: string, locale?: string): Promise<Collection | null> {
  try {
    await connectToDatabase();
    const collection = await CollectionModel.findOne({ slug, is_active: true }).lean();

    if (!collection) return null;
    return mapDocToCollection(collection as unknown as Record<string, unknown>, 0, locale);
  } catch (error) {
    console.error('Error fetching collection by slug:', error);
    return null;
  }
}

export async function getCollectionById(id: number, locale?: string): Promise<Collection | null> {
  try {
    await connectToDatabase();
    const collection = await CollectionModel.findOne({ id }).lean();

    if (!collection) return null;
    return mapDocToCollection(collection as unknown as Record<string, unknown>, 0, locale);
  } catch (error) {
    console.error('Error fetching collection by id:', error);
    return null;
  }
}
