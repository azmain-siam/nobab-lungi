import { createClient } from '@/lib/supabase/server';
import type { ProductWithImages } from '@/types';

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
