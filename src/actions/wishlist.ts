'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getUserWishlistProductIds,
  getAdminWishlistInsights,
} from '@/services/wishlist-service';
import type { ProductWithImages, WishlistInsights } from '@/types';
import { revalidatePath } from 'next/cache';

export async function addToWishlistAction(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    const res = await addToWishlist(session.user.id, productId);
    if (res.success) {
      revalidatePath('/account/wishlist');
      revalidatePath('/dashboard/wishlist');
    }
    return res;
  } catch (error) {
    console.error('addToWishlistAction error:', error);
    return { success: false, error: 'Failed to update wishlist' };
  }
}

export async function removeFromWishlistAction(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'UNAUTHORIZED' };
    }

    const res = await removeFromWishlist(session.user.id, productId);
    if (res.success) {
      revalidatePath('/account/wishlist');
      revalidatePath('/dashboard/wishlist');
    }
    return res;
  } catch (error) {
    console.error('removeFromWishlistAction error:', error);
    return { success: false, error: 'Failed to remove item from wishlist' };
  }
}

export async function getUserWishlistAction(): Promise<{ success: boolean; items: ProductWithImages[]; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: true, items: [] };
    }

    const items = await getUserWishlist(session.user.id);
    return { success: true, items };
  } catch (error) {
    console.error('getUserWishlistAction error:', error);
    return { success: false, items: [], error: 'Failed to fetch wishlist' };
  }
}

export async function getWishlistProductIdsAction(): Promise<string[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await getUserWishlistProductIds(session.user.id);
  } catch (error) {
    console.error('getWishlistProductIdsAction error:', error);
    return [];
  }
}

export async function getAdminWishlistInsightsAction(): Promise<{ success: boolean; insights?: WishlistInsights; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden: Admin access required' };
    }

    const insights = await getAdminWishlistInsights();
    return { success: true, insights };
  } catch (error) {
    console.error('getAdminWishlistInsightsAction error:', error);
    return { success: false, error: 'Failed to fetch wishlist insights' };
  }
}
