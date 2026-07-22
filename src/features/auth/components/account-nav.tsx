'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const ACCOUNT_TABS = [
  { label: 'Profile', href: '/account' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'Addresses', href: '/account/addresses' },
] as const;

/**
 * AccountNav — shared account section tab navigation.
 * Uses pathname for active tab detection to avoid prop drilling.
 */
export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account sections"
      className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-200 pb-0"
    >
      {ACCOUNT_TABS.map((tab) => {
        const isActive =
          tab.href === '/account' ? pathname === '/account' : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              '-mb-px whitespace-nowrap border-b-2 px-4 pb-3 text-sm font-medium transition',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
