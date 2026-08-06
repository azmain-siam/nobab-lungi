'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/providers/toast-provider';
import {
  addToWishlistAction,
  removeFromWishlistAction,
  getWishlistProductIdsAction,
} from '@/actions/wishlist';

interface WishlistContextType {
  wishlistIds: Set<string>;
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: { id: string; name: string }) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  wishlistCount: 0,
  isWishlisted: () => false,
  toggleWishlist: async () => false,
  refreshWishlist: async () => {},
  loading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const toast = useToast();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIds = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setWishlistIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const ids = await getWishlistProductIdsAction();
      setWishlistIds(new Set(ids));
    } catch (err) {
      console.error('Error fetching wishlist IDs:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    let isMounted = true;

    if (status === 'authenticated' && session?.user?.id) {
      getWishlistProductIdsAction()
        .then((ids) => {
          if (isMounted) {
            setWishlistIds(new Set(ids));
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('Error fetching wishlist IDs:', err);
          if (isMounted) setLoading(false);
        });
    } else if (status === 'unauthenticated') {
      Promise.resolve().then(() => {
        if (isMounted) {
          setWishlistIds(new Set());
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, status]);

  const isWishlisted = useCallback(
    (productId: string): boolean => {
      if (!productId) return false;
      return wishlistIds.has(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = async (product: { id: string; name: string }): Promise<boolean> => {
    if (status !== 'authenticated' || !session?.user) {
      toast.error('Please sign in to save products to your wishlist.');
      return false;
    }

    const productId = product.id;
    const currentlyWishlisted = wishlistIds.has(productId);

    // Optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (currentlyWishlisted) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      if (currentlyWishlisted) {
        const res = await removeFromWishlistAction(productId);
        if (!res.success) {
          // Rollback on failure
          setWishlistIds((prev) => new Set(prev).add(productId));
          toast.error(res.error || 'Failed to remove from wishlist.');
          return false;
        }
        toast.success(`"${product.name}" removed from wishlist.`);
        return true;
      } else {
        const res = await addToWishlistAction(productId);
        if (!res.success) {
          // Rollback on failure
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
          toast.error(res.error || 'Failed to save to wishlist.');
          return false;
        }
        toast.success(`"${product.name}" saved to your wishlist!`);
        return true;
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      // Rollback
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (currentlyWishlisted) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
      toast.error('Something went wrong. Please try again.');
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.size,
        isWishlisted,
        toggleWishlist,
        refreshWishlist: fetchIds,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
