import Link from 'next/link';

/**
 * Store Footer — Server Component.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-base font-bold text-gray-900">Nobab Lungi</p>
            <p className="mt-2 text-sm text-gray-500">
              Premium Bangladeshi Lungi &amp; Saree. Fast delivery across Bangladesh.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Shop</p>
            <ul className="mt-3 space-y-2" role="list">
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-sm text-gray-600 hover:text-gray-900">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">Account</p>
            <ul className="mt-3 space-y-2" role="list">
              <li>
                <Link href="/account" className="text-sm text-gray-600 hover:text-gray-900">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-gray-600 hover:text-gray-900">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="text-sm text-gray-600 hover:text-gray-900">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          &copy; {currentYear} Nobab Lungi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
