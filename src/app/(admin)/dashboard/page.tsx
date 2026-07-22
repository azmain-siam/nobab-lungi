import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Package,
  ClipboardList,
  Tag,
  Sparkles,
  Image,
  Ticket,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Nobab Lungi admin dashboard.',
};

const QUICK_LINKS = [
  { label: 'Products', href: '/dashboard/products', description: 'Add, edit, or remove products', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', description: 'View and update order statuses', icon: ClipboardList },
  { label: 'Categories', href: '/dashboard/categories', description: 'Manage product categories', icon: Tag },
  { label: 'Collections', href: '/dashboard/collections', description: 'Curate product collections', icon: Sparkles },
  { label: 'Banners', href: '/dashboard/banners', description: 'Manage homepage banners', icon: Image },
  { label: 'Coupons', href: '/dashboard/coupons', description: 'Create and manage discount codes', icon: Ticket },
] as const;

/**
 * Admin dashboard overview page.
 */
export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Nobab Lungi admin panel.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 transition hover:border-primary/30 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Phase 4 note */}
      <div className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Statistics and charts will be added in Phase 5 (Admin Dashboard).
        </p>
      </div>
    </div>
  );
}

