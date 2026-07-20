'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// ── Update Profile ───────────────────────────────────────────

export interface ProfileActionResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  name: string,
  phone: string
): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'You must be signed in to update your profile.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ name: name.trim(), phone: phone.trim() || null })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/account');
  return { success: true };
}

// ── Update Password ──────────────────────────────────────────

export async function updatePasswordAction(
  newPassword: string
): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };
  return { success: true };
}
