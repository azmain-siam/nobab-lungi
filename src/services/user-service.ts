import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import type { Profile } from '@/types';

function mapUserToProfile(doc: Record<string, unknown>): Profile {
  return {
    id: String(doc._id),
    name: (doc.name as string) ?? null,
    email: (doc.email as string) ?? null,
    phone: (doc.phone as string) ?? null,
    role: (doc.role as 'admin' | 'customer') || 'customer',
    avatar_url: (doc.avatar_url as string) ?? null,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
  };
}

/**
 * Fetch a user's profile by their User ID.
 * Returns null if not found or on error.
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).lean();
    if (!user) return null;

    return mapUserToProfile(user as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update a user's profile fields (name, phone, avatar_url).
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'name' | 'phone' | 'avatar_url'>>
): Promise<Profile> {
  await connectToDatabase();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new Error('User profile not found.');
  }

  return mapUserToProfile(updatedUser as unknown as Record<string, unknown>);
}
