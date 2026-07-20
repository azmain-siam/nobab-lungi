import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/types';

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('parent_type', { ascending: true })
    .order('sort_order', { ascending: true });

  return (data as Category[]) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  return (data as Category) ?? null;
}
