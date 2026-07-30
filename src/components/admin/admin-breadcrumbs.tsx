'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const PATH_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  collections: 'Collections & Banners',
  orders: 'Orders',
  customers: 'Customers',
  coupons: 'Coupons',
  settings: 'Settings',
  new: 'Create New',
  edit: 'Edit',
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[#5e5e5b]">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-[#1b1c1c] transition font-medium"
      >
        <Home className="h-3.5 w-3.5 stroke-[1.5]" />
        <span className="hidden sm:inline">Admin</span>
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = PATH_LABELS[segment] || segment.replace(/-/g, ' ');

        return (
          <div key={url} className="flex items-center gap-1.5 capitalize">
            <ChevronRight className="h-3 w-3 text-[#5e5e5b]/60 stroke-[1.5]" />
            {isLast ? (
              <span className="font-semibold text-[#1b1c1c]">{label}</span>
            ) : (
              <Link href={url} className="hover:text-[#1b1c1c] transition font-medium">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
