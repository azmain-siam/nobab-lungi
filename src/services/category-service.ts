import { connectToDatabase } from '@/lib/db';
import { Category as CategoryModel } from '@/models/Category';
import { Product as ProductModel } from '@/models/Product';
import type { Category } from '@/types';

function mapDocToCategory(doc: Record<string, unknown>, productCount = 0, locale?: string): Category {
  const translations = (doc.translations as Record<string, Record<string, string>>) || {};
  const bn = translations.bn || {};

  const name = (locale === 'bn' && bn.name) ? bn.name : (doc.name as string);
  const description = (locale === 'bn' && bn.description) ? bn.description : ((doc.description as string) ?? null);

  return {
    id: Number(doc.id || doc._id),
    name,
    slug: doc.slug as string,
    description,
    image_url: (doc.image_url as string) ?? null,
    parent_type: doc.parent_type as 'lungi' | 'saree',
    sort_order: (doc.sort_order as number) ?? 0,
    is_active: (doc.is_active as boolean) ?? true,
    product_count: productCount,
    translations: doc.translations as Category['translations'],
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
  };
}

export async function getAllCategories(locale?: string): Promise<Category[]> {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find({ is_active: true })
      .sort({ parent_type: 1, sort_order: 1 })
      .lean();

    return categories.map((c) => mapDocToCategory(c as unknown as Record<string, unknown>, 0, locale));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getAdminCategories(options?: {
  search?: string;
  status?: string;
  parentType?: string;
  page?: number;
  limit?: number;
}): Promise<{ categories: Category[]; total: number; pages: number }> {
  try {
    await connectToDatabase();

    const search = options?.search?.trim();
    const status = options?.status || 'all';
    const parentType = options?.parentType || 'all';
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 10);

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

    if (parentType !== 'all') {
      query.parent_type = parentType;
    }

    const total = await CategoryModel.countDocuments(query);
    const pages = Math.ceil(total / limit) || 1;

    const docs = await CategoryModel.find(query)
      .sort({ parent_type: 1, sort_order: 1, created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Fetch product counts for each category
    const categoriesWithCount = await Promise.all(
      docs.map(async (doc) => {
        const catId = doc.id;
        const count = await ProductModel.countDocuments({ category_id: Number(catId) });
        return mapDocToCategory(doc as unknown as Record<string, unknown>, count);
      })
    );

    return {
      categories: categoriesWithCount,
      total,
      pages,
    };
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    return { categories: [], total: 0, pages: 1 };
  }
}

export async function getCategoryBySlug(slug: string, locale?: string): Promise<Category | null> {
  try {
    await connectToDatabase();
    const category = await CategoryModel.findOne({ slug }).lean();

    if (!category) return null;
    return mapDocToCategory(category as unknown as Record<string, unknown>, 0, locale);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function getCategoryById(id: number, locale?: string): Promise<Category | null> {
  try {
    await connectToDatabase();
    const category = await CategoryModel.findOne({ id }).lean();

    if (!category) return null;
    return mapDocToCategory(category as unknown as Record<string, unknown>, 0, locale);
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
}
