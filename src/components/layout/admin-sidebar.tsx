'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  Sparkles,
  ClipboardList,
  Image,
  Ticket,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { logoutAction } from '@/features/auth/actions/auth-actions';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Collections', href: '/dashboard/collections', icon: Sparkles },
  { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
  { label: 'Banners', href: '/dashboard/banners', icon: Image },
  { label: 'Coupons', href: '/dashboard/coupons', icon: Ticket },
] as const;

/**
 * Admin sidebar — Client Component for active link highlighting.
 * Uses Lucide icons as specified in DESIGN_SYSTEM.md.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="border-b border-gray-200 px-5 py-4">
        <Link href="/" className="text-base font-bold text-gray-900 transition hover:text-primary">
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
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
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
            <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
