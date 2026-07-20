import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

/**
 * Fetch a user's profile by their Supabase Auth user ID.
 * Returns null if not found or on error.
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as Profile;
}

/**
 * Update a user's profile fields (name, phone, avatar_url).
 * Throws on Supabase error.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'name' | 'phone' | 'avatar_url'>>
): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}
