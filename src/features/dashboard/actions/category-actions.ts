'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { categorySchema, type CategoryInput } from '@/lib/validations/category';

export interface CategoryActionResult {
  success?: boolean;
  error?: string;
}

import { getAdminCategories } from '@/services/category-service';

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchAdminCategoriesAction(options?: {
  search?: string;
  status?: string;
  parentType?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminCategories(options);
}

export async function createCategoryAction(input: CategoryInput): Promise<CategoryActionResult> {
  try {
    await verifyAdminSession();

    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, slug, description, image_url, parent_type, sort_order, is_active } = parsed.data;

    await connectToDatabase();

    // Check duplicate name or slug
    const existing = await Category.findOne({
      $or: [
        { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (existing) {
      if (existing.name.toLowerCase() === name.trim().toLowerCase()) {
        return { error: `A category named "${name.trim()}" already exists.` };
      }
      return { error: `The URL slug "${slug.trim()}" is already in use by another category.` };
    }

    // Auto-generate next numeric ID
    const lastCategory = await Category.findOne().sort({ id: -1 }).lean();
    const nextId = lastCategory && lastCategory.id ? lastCategory.id + 1 : 1;

    await Category.create({
      id: nextId,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      image_url: image_url || null,
      parent_type,
      sort_order: sort_order ?? 0,
      is_active: is_active ?? true,
    });

    revalidatePath('/dashboard/categories');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create category.';
    return { error: message };
  }
}

export async function updateCategoryAction(
  id: number,
  input: CategoryInput
): Promise<CategoryActionResult> {
  try {
    await verifyAdminSession();

    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, slug, description, image_url, parent_type, sort_order, is_active } = parsed.data;

    await connectToDatabase();

    const currentCategory = await Category.findOne({ id });
    if (!currentCategory) {
      return { error: 'Category not found.' };
    }

    // Check duplicate name or slug on OTHER categories
    const duplicate = await Category.findOne({
      id: { $ne: id },
      $or: [
        { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (duplicate) {
      if (duplicate.name.toLowerCase() === name.trim().toLowerCase()) {
        return { error: `Another category named "${name.trim()}" already exists.` };
      }
      return { error: `The URL slug "${slug.trim()}" is already taken.` };
    }

    await Category.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description?.trim() || null,
          image_url: image_url || null,
          parent_type,
          sort_order: sort_order ?? 0,
          is_active: is_active ?? true,
        },
      }
    );

    revalidatePath('/dashboard/categories');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update category.';
    return { error: message };
  }
}

export async function deleteCategoryAction(id: number): Promise<CategoryActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    const category = await Category.findOne({ id });
    if (!category) {
      return { error: 'Category not found.' };
    }

    // Prevent deletion if products belong to this category
    const productCount = await Product.countDocuments({ category_id: Number(id) });

    if (productCount > 0) {
      return {
        error: `Cannot delete category "${category.name}" because ${productCount} product(s) belong to it. Please re-assign or delete those products first.`,
      };
    }

    await Category.findOneAndDelete({ id });

    revalidatePath('/dashboard/categories');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete category.';
    return { error: message };
  }
}
