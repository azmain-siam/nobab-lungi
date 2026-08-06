'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Headphones,
} from 'lucide-react';
import { useUser } from '@/features/auth/hooks/use-user';
import { useToast } from '@/providers/toast-provider';

const CUSTOMER_NAV = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || 'Valued Customer';
  const displayEmail = user?.email || 'customer@nabablungi.com';
  const avatarUrl = profile?.avatar_url || (profile as unknown as { image?: string })?.image || null;

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NL';

  const currentPageLabel =
    CUSTOMER_NAV.find((item) => item.href === pathname)?.label || 'My Account';

  const sidebarNavContent = (
    <div className="space-y-6">
      {/* 1. User Profile Header Card */}
      <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-5 text-center space-y-3">
        <div className="relative mx-auto h-16 w-16 rounded-full overflow-hidden border-2 border-[#e3e2e2] bg-white flex items-center justify-center shadow-xs">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#1b1c1c] text-white flex items-center justify-center font-display font-semibold text-lg tracking-wider">
              {initials}
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h2 className="font-display text-base font-bold text-[#1b1c1c] truncate px-2">
            {displayName}
          </h2>
          <p className="text-[11px] text-[#5e5e5b] truncate font-light px-2">
            {displayEmail}
          </p>
        </div>
      </div>

      {/* 2. Customer Navigation List */}
      <nav aria-label="Customer Account Navigation" className="bg-white border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
        {CUSTOMER_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-5 py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? 'bg-[#1b1c1c] text-white'
                  : 'text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#fbf9f8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 stroke-[1.5] ${isActive ? 'text-white' : 'text-[#5e5e5b]'}`} />
                <span>{item.label}</span>
              </div>

              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}

        {profile?.role === 'admin' && (
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 transition"
          >
            <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
            Admin Dashboard
          </Link>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(false);
            handleSignOut();
          }}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          Sign Out
        </button>
      </nav>

      {/* 3. Sidebar Footer — Support Card */}
      <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 text-[#1b1c1c] font-semibold">
          <Headphones className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
          <span>Customer Support</span>
        </div>
        <p className="text-[11px] text-[#5e5e5b] leading-relaxed">
          Need help with an order or inquiry?
        </p>
        <div className="pt-1 text-[11px] font-mono text-[#1b1c1c] font-medium">
          +880 1700-000000
        </div>
      </div>
    </div>
  );

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      {/* Mobile Navigation Header Toggle Bar */}
      <div className="lg:hidden bg-white border border-[#e3e2e2] p-4 space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-[#1b1c1c] text-white flex items-center justify-center font-display font-semibold text-xs shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-display text-xs font-bold text-[#1b1c1c] truncate">
                {displayName}
              </h2>
              <span className="block text-[10px] text-[#5e5e5b] truncate font-medium">
                Current: <span className="text-[#1b1c1c]">{currentPageLabel}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#fbf9f8] border border-[#e3e2e2] text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:bg-[#f5f3f3] active:scale-95 transition cursor-pointer"
          >
            <span>Menu</span>
            {isMobileMenuOpen ? (
              <ChevronUp className="h-4 w-4 text-[#5e5e5b]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#5e5e5b]" />
            )}
          </button>
        </div>

        {/* Collapsible Mobile Menu Content with Framer Motion Exit */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pt-3 border-t border-[#e3e2e2] overflow-hidden"
            >
              {sidebarNavContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sticky Light/Warm Sidebar */}
      <div className="hidden lg:block sticky top-24">
        {sidebarNavContent}
      </div>
    </aside>
  );
}
