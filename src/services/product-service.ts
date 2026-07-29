import { createClient } from '@/lib/supabase/server';
import type { ProductWithImages, Product } from '@/types';

export async function getNewArrivals(limit = 8): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .eq('is_new_arrival', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as ProductWithImages[]) ?? [];
}

export async function getBestSellers(limit = 8): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .eq('is_best_seller', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as ProductWithImages[]) ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as ProductWithImages[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return (data as ProductWithImages) ?? null;
}

export async function createProduct(productData: {
  name: string;
  sku?: string;
  description?: string;
  price: number; // whole BDT
  stock: number;
  category_id?: number;
  imageUrl?: string;
}): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const supabase = await createClient();
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug,
        sku: productData.sku || null,
        description: productData.description || null,
        price: Math.round(productData.price * 100), // poisha
        stock: productData.stock,
        category_id: productData.category_id || null,
        is_active: productData.stock > 0,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    if (productData.imageUrl && product) {
      await supabase.from('product_images').insert({
        product_id: product.id,
        url: productData.imageUrl,
        alt_text: product.name,
        sort_order: 0,
      });
    }

    return { success: true, product: product as Product };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product.';
    return { success: false, error: message };
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product.';
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return { success: false, error: message };
  }
}
