'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Collection } from '@/models/Collection';
import { collectionSchema, type CollectionInput } from '@/lib/validations/collection';
import { getAdminCollections } from '@/services/collection-service';

export interface CollectionActionResult {
  success?: boolean;
  error?: string;
}

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchAdminCollectionsAction(options?: {
  search?: string;
  status?: string;
  featured?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminCollections(options);
}

export async function createCollectionAction(input: CollectionInput): Promise<CollectionActionResult> {
  try {
    await verifyAdminSession();

    const parsed = collectionSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const {
      name,
      slug,
      description,
      cover_image,
      banner_url,
      is_featured,
      sort_order,
      is_active,
      seo_title,
      seo_description,
      translations,
    } = parsed.data;

    await connectToDatabase();

    // Check duplicate name or slug
    const existing = await Collection.findOne({
      $or: [
        { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (existing) {
      if (existing.name.toLowerCase() === name.trim().toLowerCase()) {
        return { error: `A collection named "${name.trim()}" already exists.` };
      }
      return { error: `The URL slug "${slug.trim()}" is already in use.` };
    }

    // Auto-generate next numeric ID
    const lastCollection = await Collection.findOne().sort({ id: -1 }).lean();
    const nextId = lastCollection && lastCollection.id ? lastCollection.id + 1 : 1;

    await Collection.create({
      id: nextId,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || null,
      cover_image: cover_image || null,
      banner_url: banner_url || null,
      is_featured: is_featured ?? false,
      sort_order: sort_order ?? 0,
      is_active: is_active ?? true,
      seo_title: seo_title?.trim() || null,
      seo_description: seo_description?.trim() || null,
      translations: translations || {},
    });

    revalidatePath('/dashboard/collections');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create collection.';
    return { error: message };
  }
}

export async function updateCollectionAction(
  id: number,
  input: CollectionInput
): Promise<CollectionActionResult> {
  try {
    await verifyAdminSession();

    const parsed = collectionSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const {
      name,
      slug,
      description,
      cover_image,
      banner_url,
      is_featured,
      sort_order,
      is_active,
      seo_title,
      seo_description,
      translations,
    } = parsed.data;

    await connectToDatabase();

    const currentCollection = await Collection.findOne({ id });
    if (!currentCollection) {
      return { error: 'Collection not found.' };
    }

    // Check duplicate name or slug on OTHER collections
    const duplicate = await Collection.findOne({
      id: { $ne: id },
      $or: [
        { name: { $regex: `^${name.trim()}$`, $options: 'i' } },
        { slug: slug.trim().toLowerCase() },
      ],
    });

    if (duplicate) {
      if (duplicate.name.toLowerCase() === name.trim().toLowerCase()) {
        return { error: `Another collection named "${name.trim()}" already exists.` };
      }
      return { error: `The URL slug "${slug.trim()}" is already taken.` };
    }

    await Collection.findOneAndUpdate(
      { id },
      {
        $set: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description?.trim() || null,
          cover_image: cover_image || null,
          banner_url: banner_url || null,
          is_featured: is_featured ?? false,
          sort_order: sort_order ?? 0,
          is_active: is_active ?? true,
          seo_title: seo_title?.trim() || null,
          seo_description: seo_description?.trim() || null,
          translations: translations || {},
        },
      }
    );

    revalidatePath('/dashboard/collections');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update collection.';
    return { error: message };
  }
}

export async function deleteCollectionAction(id: number): Promise<CollectionActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    const collection = await Collection.findOne({ id });
    if (!collection) {
      return { error: 'Collection not found.' };
    }

    await Collection.findOneAndDelete({ id });

    revalidatePath('/dashboard/collections');
    revalidatePath('/collections');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete collection.';
    return { error: message };
  }
}
