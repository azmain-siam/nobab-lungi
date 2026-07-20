import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved products on Nobab Lungi.',
};

/**
 * Wishlist page — placeholder for Phase 4.
 */
export default function AccountWishlistPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">Products you&apos;ve saved for later.</p>
      </div>

      {/* Account navigation */}
      <nav aria-label="Account sections" className="mb-8 flex gap-4 border-b border-gray-200">
        {[
          { label: 'Profile', href: '/account' },
          { label: 'Orders', href: '/account/orders' },
          { label: 'Wishlist', href: '/account/wishlist' },
          { label: 'Addresses', href: '/account/addresses' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
              item.href === '/account/wishlist'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <p className="text-2xl">❤️</p>
        <p className="mt-3 text-sm font-medium text-gray-700">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-gray-500">
          Save products you love and find them here later.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
