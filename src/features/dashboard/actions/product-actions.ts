'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { productSchema, type ProductInput } from '@/lib/validations/product';
import { getAdminProducts } from '@/services/product-service';

export interface ProductActionResult {
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

export async function fetchAdminProductsAction(options?: {
  search?: string;
  categoryId?: number;
  collectionId?: number;
  status?: string;
  stockFilter?: string;
  flagFilter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await verifyAdminSession();
  return getAdminProducts(options);
}

export async function createProductAction(input: ProductInput): Promise<ProductActionResult> {
  try {
    await verifyAdminSession();

    const parsed = productSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    await connectToDatabase();

    // Unique checks for Name, Slug, and SKU
    const existingName = await Product.findOne({
      name: { $regex: `^${data.name.trim()}$`, $options: 'i' },
    });
    if (existingName) {
      return { error: `A product named "${data.name.trim()}" already exists.` };
    }

    const existingSlug = await Product.findOne({ slug: data.slug.trim().toLowerCase() });
    if (existingSlug) {
      return { error: `The URL slug "${data.slug.trim()}" is already in use.` };
    }

    const existingSku = await Product.findOne({ sku: { $regex: `^${data.sku.trim()}$`, $options: 'i' } });
    if (existingSku) {
      return { error: `The SKU code "${data.sku.trim()}" is already assigned to another product.` };
    }

    await Product.create({
      name: data.name.trim(),
      slug: data.slug.trim().toLowerCase(),
      sku: data.sku.trim().toUpperCase(),
      short_description: data.short_description?.trim() || null,
      description: data.description?.trim() || null,
      price: data.price,
      discount_price: data.discount_price && data.discount_price > 0 ? data.discount_price : null,
      stock: data.stock,
      category_id: data.category_id,
      collection_ids: data.collection_ids || [],
      fabric: data.fabric?.trim() || null,
      pattern: data.pattern?.trim() || null,
      color: data.color?.trim() || null,
      weight: data.weight?.trim() || null,
      country_of_origin: data.country_of_origin || 'Bangladesh',
      status: data.status || 'published',
      is_active: data.is_active ?? true,
      is_featured: data.is_featured ?? false,
      is_best_seller: data.is_best_seller ?? false,
      is_new_arrival: data.is_new_arrival ?? false,
      seo_title: data.seo_title?.trim() || null,
      seo_description: data.seo_description?.trim() || null,
      product_images: data.product_images.map((img, idx) => ({
        url: img.url,
        alt_text: img.alt_text || data.name,
        sort_order: img.sort_order ?? idx,
        is_cover: img.is_cover ?? idx === 0,
      })),
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product.';
    return { error: message };
  }
}

export async function updateProductAction(
  id: string,
  input: ProductInput
): Promise<ProductActionResult> {
  try {
    await verifyAdminSession();

    const parsed = productSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    await connectToDatabase();

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return { error: 'Product not found.' };
    }

    // Unique checks for Name, Slug, SKU (excluding current Product ID)
    const duplicateName = await Product.findOne({
      _id: { $ne: id },
      name: { $regex: `^${data.name.trim()}$`, $options: 'i' },
    });
    if (duplicateName) {
      return { error: `Another product named "${data.name.trim()}" already exists.` };
    }

    const duplicateSlug = await Product.findOne({
      _id: { $ne: id },
      slug: data.slug.trim().toLowerCase(),
    });
    if (duplicateSlug) {
      return { error: `The URL slug "${data.slug.trim()}" is already taken.` };
    }

    const duplicateSku = await Product.findOne({
      _id: { $ne: id },
      sku: { $regex: `^${data.sku.trim()}$`, $options: 'i' },
    });
    if (duplicateSku) {
      return { error: `The SKU code "${data.sku.trim()}" is already taken.` };
    }

    await Product.findByIdAndUpdate(id, {
      $set: {
        name: data.name.trim(),
        slug: data.slug.trim().toLowerCase(),
        sku: data.sku.trim().toUpperCase(),
        short_description: data.short_description?.trim() || null,
        description: data.description?.trim() || null,
        price: data.price,
        discount_price: data.discount_price && data.discount_price > 0 ? data.discount_price : null,
        stock: data.stock,
        category_id: data.category_id,
        collection_ids: data.collection_ids || [],
        fabric: data.fabric?.trim() || null,
        pattern: data.pattern?.trim() || null,
        color: data.color?.trim() || null,
        weight: data.weight?.trim() || null,
        country_of_origin: data.country_of_origin || 'Bangladesh',
        status: data.status || 'published',
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        is_best_seller: data.is_best_seller ?? false,
        is_new_arrival: data.is_new_arrival ?? false,
        seo_title: data.seo_title?.trim() || null,
        seo_description: data.seo_description?.trim() || null,
        product_images: data.product_images.map((img, idx) => ({
          url: img.url,
          alt_text: img.alt_text || data.name,
          sort_order: img.sort_order ?? idx,
          is_cover: img.is_cover ?? idx === 0,
        })),
      },
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product.';
    return { error: message };
  }
}

export async function deleteProductAction(id: string): Promise<ProductActionResult> {
  try {
    await verifyAdminSession();
    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return { error: 'Product not found.' };
    }

    await Product.findByIdAndDelete(id);

    revalidatePath('/dashboard/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return { error: message };
  }
}
