import type { Metadata } from 'next';
import { AccountNav } from '@/features/auth/components/account-nav';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved products on Nobab Lungi.',
};

/**
 * Wishlist page — placeholder for Phase 5.
 */
export default function AccountWishlistPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">Products you&apos;ve saved for later.</p>
      </div>

      <AccountNav />

      <EmptyState
        icon="❤️"
        title="Your wishlist is empty"
        description="Save products you love and find them here later."
        action={{ label: 'Browse products', href: '/products' }}
      />
    </div>
  );
}
