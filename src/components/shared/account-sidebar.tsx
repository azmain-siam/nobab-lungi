'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, Heart, User, LogOut, ShieldCheck } from 'lucide-react';
import { useUser } from '@/features/auth/hooks/use-user';
import { useToast } from '@/providers/toast-provider';

const ACCOUNT_NAV = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/profile', label: 'Profile Settings', icon: User },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, profile, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || 'My Account';
  const displayEmail = user?.email || 'Customer Account';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NL';

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* User Card */}
      <div className="bg-white border border-[#e3e2e2] p-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1c1c] text-white font-display font-semibold text-sm shrink-0">
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

      {/* Mobile Horizontal Navigation Bar */}
      <div className="lg:hidden bg-white border border-[#e3e2e2] p-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {ACCOUNT_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#1b1c1c] text-white'
                  : 'text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
              }`}
            >
              <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
              {item.label}
            </Link>
          );
        })}

        {profile?.role === 'admin' && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 whitespace-nowrap transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
            Admin
          </Link>
        )}

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 whitespace-nowrap transition cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
          Sign Out
        </button>
      </div>

      {/* Desktop Vertical Navigation Menu */}
      <nav aria-label="Account Navigation" className="hidden lg:block bg-white border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
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
