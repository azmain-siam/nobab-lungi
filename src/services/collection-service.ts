import { connectToDatabase } from '@/lib/db';
import { Collection as CollectionModel } from '@/models/Collection';
import type { Collection } from '@/types';

function mapDocToCollection(doc: Record<string, unknown>): Collection {
  return {
    id: (doc.id || doc._id) as number,
    name: doc.name as string,
    slug: doc.slug as string,
    description: (doc.description as string) ?? null,
    banner_url: (doc.banner_url as string) ?? null,
    is_featured: (doc.is_featured as boolean) ?? false,
    sort_order: (doc.sort_order as number) ?? 0,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  try {
    await connectToDatabase();
    const collections = await CollectionModel.find({ is_featured: true })
      .sort({ sort_order: 1 })
      .lean();

    return collections.map((c) => mapDocToCollection(c as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    await connectToDatabase();
    const collection = await CollectionModel.findOne({ slug }).lean();

    if (!collection) return null;
    return mapDocToCollection(collection as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching collection by slug:', error);
    return null;
  }
}
