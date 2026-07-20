import { createClient } from '@/lib/supabase/server';
import type { Collection } from '@/types';

export async function getFeaturedCollections(): Promise<Collection[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });

  return (data as Collection[]) ?? [];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  return (data as Collection) ?? null;
}
