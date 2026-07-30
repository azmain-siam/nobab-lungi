'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, ShieldCheck } from 'lucide-react';
import { useUser } from '@/features/auth/hooks/use-user';

const ACCOUNT_NAV = [
  { href: '/account', label: 'Profile Overview', icon: User },
  { href: '/account/orders', label: 'Order History', icon: Package },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'My Wishlist', icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || 'My Account';
  const displayEmail = user?.email || 'Guest User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NL';

  return (
    <aside className="w-full space-y-6 lg:w-64 shrink-0">
      {/* User Welcome Card */}
      <div className="bg-white border border-[#e3e2e2] p-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1c1c] text-white font-display font-semibold text-base shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <h2 className="font-display text-sm font-semibold text-[#1b1c1c] truncate">
            {displayName}
          </h2>
          <span className="block text-[11px] text-[#5e5e5b] truncate">
            {displayEmail}
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

        {profile?.role === 'admin' && (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/60 transition"
          >
            <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
            Admin Dashboard
          </Link>
        )}

        {/* Sign Out Action */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
