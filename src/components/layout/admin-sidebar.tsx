'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

const ADMIN_NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/collections', label: 'Collections & Banners', icon: Layers },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 bg-[#1b1c1c] text-white shrink-0 min-h-screen flex flex-col justify-between p-6">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="space-y-1 border-b border-white/10 pb-5">
          <Link href="/dashboard" className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400 stroke-[2]" />
            Nabab Admin
          </Link>
          <span className="block text-[10px] font-medium text-white/60 tracking-wider uppercase">
            Merchant Portal
          </span>
        </div>

        {/* Navigation List */}
        <nav aria-label="Admin Navigation" className="space-y-1.5">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition rounded-none ${
                  isActive
                    ? 'bg-white text-[#1b1c1c]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.5]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Storefront */}
      <div className="border-t border-white/10 pt-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition"
        >
          <ExternalLink className="h-4 w-4 stroke-[1.5]" />
          View Storefront
        </Link>
      </div>
    </aside>
  );
}
