import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Addresses',
  description: 'Manage your saved delivery addresses on Nobab Lungi.',
};

/**
 * Saved addresses page — placeholder for Phase 4.
 */
export default function AccountAddressesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your delivery addresses.</p>
      </div>

      {/* Account navigation */}
      <nav aria-label="Account sections" className="mb-8 flex gap-4 border-b border-gray-200">
        {[
          { label: 'Profile', href: '/account' },
          { label: 'Orders', href: '/account/orders' },
          { label: 'Wishlist', href: '/account/wishlist' },
          { label: 'Addresses', href: '/account/addresses' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
              item.href === '/account/addresses'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <p className="text-2xl">📍</p>
        <p className="mt-3 text-sm font-medium text-gray-700">No saved addresses</p>
        <p className="mt-1 text-sm text-gray-500">
          Addresses you add during checkout will be saved here.
        </p>
      </div>
    </div>
  );
}
