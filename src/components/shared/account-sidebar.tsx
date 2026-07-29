'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';

const ACCOUNT_NAV = [
  { href: '/account', label: 'Profile Overview', icon: User },
  { href: '/account/orders', label: 'Order History', icon: Package },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'My Wishlist', icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full space-y-6 lg:w-64 shrink-0">
      {/* User Welcome Card */}
      <div className="bg-white border border-[#e3e2e2] p-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1c1c] text-white font-display font-semibold text-base">
          RI
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold text-[#1b1c1c]">
            Rafiqul Islam
          </h2>
          <span className="block text-[11px] text-[#5e5e5b]">
            rafiqul@example.com
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Account Navigation" className="bg-white border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
        {ACCOUNT_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? 'bg-[#1b1c1c] text-white'
                  : 'text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
              }`}
            >
              <Icon className="h-4 w-4 stroke-[1.5]" />
              {item.label}
            </Link>
          );
        })}

        {/* Sign Out Action */}
        <button
          onClick={() => {
            alert('Signed out successfully.');
          }}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
