'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { getStoreSettings, updateStoreSettings } from '@/services/settings-service';
import type { StoreSettingsInput } from '@/lib/validations/settings';

async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== 'admin') {
    throw new Error('Unauthorized access. Admin privileges required.');
  }
  return session;
}

export async function fetchStoreSettingsAction() {
  await verifyAdminSession();
  return getStoreSettings();
}

export async function updateStoreSettingsAction(input: StoreSettingsInput) {
  try {
    await verifyAdminSession();

    const res = await updateStoreSettings(input);
    if (res.success) {
      revalidatePath('/dashboard/settings');
      revalidatePath('/');
      revalidatePath('/checkout');
      return { success: true };
    }
    return { error: res.error || 'Failed to update store settings.' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update store settings.';
    return { error: message };
  }
}
