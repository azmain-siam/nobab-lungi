import { createClient } from '@/lib/supabase/server';
import type { Banner } from '@/types';

export async function getActiveBanners(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return (data as Banner[]) ?? [];
}
