'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export interface ProfileActionResult {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  name: string,
  phone: string
): Promise<ProfileActionResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: 'You must be signed in to update your profile.' };
  }

  const userId = (session.user as { id: string }).id;

  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      $set: {
        name: name.trim(),
        phone: phone.trim() || null,
      },
    });

    revalidatePath('/account');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile.';
    return { error: message };
  }
}

export async function updatePasswordAction(
  newPassword: string
): Promise<ProfileActionResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: 'You must be signed in to update your password.' };
  }

  const userId = (session.user as { id: string }).id;

  try {
    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      $set: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update password.';
    return { error: message };
  }
}
