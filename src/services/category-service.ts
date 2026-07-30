import { connectToDatabase } from '@/lib/db';
import { Category as CategoryModel } from '@/models/Category';
import type { Category } from '@/types';

function mapDocToCategory(doc: Record<string, unknown>): Category {
  return {
    id: (doc.id || doc._id) as number,
    name: doc.name as string,
    slug: doc.slug as string,
    description: (doc.description as string) ?? null,
    image_url: (doc.image_url as string) ?? null,
    parent_type: doc.parent_type as 'lungi' | 'saree',
    sort_order: (doc.sort_order as number) ?? 0,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find()
      .sort({ parent_type: 1, sort_order: 1 })
      .lean();

    return categories.map((c) => mapDocToCategory(c as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    await connectToDatabase();
    const category = await CategoryModel.findOne({ slug }).lean();

    if (!category) return null;
    return mapDocToCategory(category as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}
