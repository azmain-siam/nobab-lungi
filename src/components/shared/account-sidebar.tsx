'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
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
  X,
  MessageCircle,
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

const emptySubscribe = () => () => {};

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, profile, signOut } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut();
    toast.success('Signed out successfully.');
    router.push('/login');
    router.refresh();
  };

  // Lock body scroll when mobile bottom sheet is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile bottom sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

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
    CUSTOMER_NAV.find((item) => item.href === pathname)?.label || 'Account';

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      {/* ================================================= */}
      {/* 1. MOBILE COMPACT ACCOUNT HEADER (lg:hidden) */}
      {/* ================================================= */}
      <div className="lg:hidden bg-white border border-[#e3e2e2] p-3.5 flex items-center justify-between mb-4 shadow-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#e3e2e2] bg-[#1b1c1c] text-white flex items-center justify-center font-display font-semibold text-xs shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="overflow-hidden min-w-0">
            <h2 className="font-display text-xs font-bold text-[#1b1c1c] truncate">
              {displayName}
            </h2>
            <p className="text-[10px] text-[#5e5e5b] truncate font-medium">
              Section: <span className="text-[#1b1c1c] font-semibold">{currentPageLabel}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fbf9f8] border border-[#e3e2e2] text-xs font-bold uppercase tracking-wider text-[#1b1c1c] hover:bg-[#f5f3f3] transition cursor-pointer"
        >
          <span>Menu</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#5e5e5b]" />
        </button>
      </div>

      {/* ================================================= */}
      {/* 2. MOBILE BOTTOM SHEET MENU (PORTAL) */}
      {/* ================================================= */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[9999] lg:hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
                  aria-hidden="true"
                />

                {/* Bottom Sheet Card */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#fbf9f8] border-t border-[#e3e2e2] rounded-t-2xl shadow-2xl z-[10000] flex flex-col justify-between overflow-hidden"
                >
                  {/* Sheet Header / Handle */}
                  <div className="p-4 border-b border-[#e3e2e2] bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-8 rounded-full bg-[#e3e2e2] mx-auto hidden sm:block" />
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                        Account Navigation
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 text-[#1b1c1c] hover:opacity-70 transition cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Navigation List */}
                  <div className="p-4 overflow-y-auto space-y-1">
                    {CUSTOMER_NAV.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                            isActive
                              ? 'bg-[#1b1c1c] text-white'
                              : 'text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-4 w-4 stroke-[1.8] ${isActive ? 'text-white' : 'text-[#5e5e5b]'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                        </Link>
                      );
                    })}

                    {profile?.role === 'admin' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 transition"
                      >
                        <ShieldCheck className="h-4 w-4 stroke-[1.8] text-emerald-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {/* Separator */}
                    <div className="pt-2 pb-1 border-t border-[#e3e2e2] my-2" />

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50/60 border border-red-100 hover:bg-red-100 transition text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 stroke-[1.8]" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  {/* Sheet Footer WhatsApp CTA */}
                  <div className="p-4 border-t border-[#e3e2e2] bg-white shrink-0">
                    <a
                      href="https://wa.me/8801712345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-emerald-700" />
                        <span>Need help with an order?</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700">Chat WhatsApp →</span>
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ================================================= */}
      {/* 3. DESKTOP STICKY LIGHT SIDEBAR (hidden lg:block) */}
      {/* ================================================= */}
      <div className="hidden lg:block sticky top-24 space-y-6">
        {/* User Profile Header Card */}
        <div className="bg-white border border-[#e3e2e2] p-6 text-center space-y-3">
          <div className="relative mx-auto h-16 w-16 rounded-full overflow-hidden border-2 border-[#e3e2e2] bg-[#1b1c1c] text-white flex items-center justify-center font-display font-bold text-lg shadow-xs">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="space-y-0.5">
            <h2 className="font-display text-base font-bold text-[#1b1c1c] truncate px-2">
              {displayName}
            </h2>
            <p className="text-xs text-[#5e5e5b] truncate font-light px-2">
              {displayEmail}
            </p>
          </div>
        </div>

        {/* Customer Navigation List */}
        <nav aria-label="Customer Account Navigation" className="bg-white border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
          {CUSTOMER_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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

                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
              </Link>
            );
          })}

          {profile?.role === 'admin' && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 transition"
            >
              <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
              Admin Dashboard
            </Link>
          )}

          {/* Visually Separated Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4 stroke-[1.5]" />
            Sign Out
          </button>
        </nav>

        {/* Support Card */}
        <div className="bg-white border border-[#e3e2e2] p-4 text-xs space-y-2">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b1c1c]">
            Customer Support
          </span>
          <p className="text-[11px] text-[#5e5e5b] leading-relaxed">
            Need assistance with your orders or delivery?
          </p>
          <a
            href="https://wa.me/8801712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-1"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Chat on WhatsApp →</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
