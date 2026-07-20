'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/features/auth/actions/auth-actions';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Products', href: '/dashboard/products', icon: '📦' },
  { label: 'Categories', href: '/dashboard/categories', icon: '🏷️' },
  { label: 'Collections', href: '/dashboard/collections', icon: '✨' },
  { label: 'Orders', href: '/dashboard/orders', icon: '📋' },
  { label: 'Banners', href: '/dashboard/banners', icon: '🖼️' },
  { label: 'Coupons', href: '/dashboard/coupons', icon: '🎫' },
] as const;

/**
 * Admin sidebar — Client Component for active link highlighting.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="border-b border-gray-200 px-5 py-4">
        <Link href="/" className="text-base font-bold text-gray-900">
          Nobab Lungi
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-200 px-3 py-4">
        <form action={logoutAction}>
          <button
            id="admin-logout"
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <span aria-hidden="true">→</span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
