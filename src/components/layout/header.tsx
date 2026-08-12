'use client';

import { Container } from '@/components/ui/container';
import { useCart } from '@/context/cart-context';
import { useWishlist } from '@/providers/wishlist-provider';
import { useUser } from '@/features/auth/hooks/use-user';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
  ShieldCheck,
  LogOut,
  Package,
  MapPin,
  Tag,
  Grid,
  ChevronDown,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// import { AnnouncementBar } from './announcement-bar';
import { MobileNavDrawer } from './mobile-nav-drawer';
import type { Collection } from '@/types';

interface HeaderProps {
  variant?: 'transparent' | 'light';
  collections?: Collection[];
  whatsappNumber?: string;
}

const emptySubscribe = () => () => { };

export function Header({ variant, collections = [], whatsappNumber }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openCart, cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, profile, signOut } = useUser();

  // Scroll position listener with passive option for mobile performance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push('/login');
    router.refresh();
  };

  // Unified transparent vs light mode calculation
  const isHomepage = isClient ? pathname === '/' : false;
  const forcedVariant = variant;
  const isTransparentMode = forcedVariant
    ? forcedVariant === 'transparent' && !scrolled
    : isHomepage && !scrolled;

  const isDarkText = !isTransparentMode;

  const getHeaderStyles = () => {
    if (isTransparentMode) {
      return 'absolute top-0 left-0 right-0 z-50 w-full bg-transparent transition-all duration-300';
    }
    if (isHomepage && scrolled) {
      return 'fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md shadow transition-all duration-300';
    }
    return 'sticky top-0 z-50 w-full bg-[#fbf9f8]/95 backdrop-blur-md transition-all duration-300 shadow';
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'NL';

  const isAdmin = profile?.role === 'admin';

  return (
    <header className={getHeaderStyles()}>
      {/* <AnnouncementBar /> */}
      <nav aria-label="Main navigation">
        <Container
          className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3.5' : 'py-5'
            }`}
        >
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1 focus:outline-none cursor-pointer transition-colors ${isDarkText ? 'text-[#1b1c1c]' : 'text-white'
              }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Brand Logo */}
          <Link
            href="/"
            className={`font-display text-xl font-bold tracking-tight transition hover:opacity-85 ${isDarkText ? 'text-[#1b1c1c]' : 'text-white'
              }`}
          >
            Nabab Lungi
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/collections"
              className={`relative text-xs font-semibold uppercase tracking-[0.15em] transition ${pathname.startsWith('/collections')
                ? isDarkText
                  ? 'text-[#1b1c1c] after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-[#1b1c1c]'
                  : 'text-white after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-white'
                : isDarkText
                  ? 'text-[#5e5e5b] hover:text-[#1b1c1c]'
                  : 'text-white/80 hover:text-white'
                }`}
            >
              COLLECTIONS
            </Link>
            <Link
              href="/products"
              className={`relative text-xs font-semibold uppercase tracking-[0.15em] transition ${pathname.startsWith('/products')
                ? isDarkText
                  ? 'text-[#1b1c1c] after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-[#1b1c1c]'
                  : 'text-white after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-white'
                : isDarkText
                  ? 'text-[#5e5e5b] hover:text-[#1b1c1c]'
                  : 'text-white/80 hover:text-white'
                }`}
            >
              SHOP
            </Link>
            <Link
              href="/about"
              className={`relative text-xs font-semibold uppercase tracking-[0.15em] transition ${pathname.startsWith('/about')
                ? isDarkText
                  ? 'text-[#1b1c1c] after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-[#1b1c1c]'
                  : 'text-white after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-white'
                : isDarkText
                  ? 'text-[#5e5e5b] hover:text-[#1b1c1c]'
                  : 'text-white/80 hover:text-white'
                }`}
            >
              ABOUT
            </Link>
          </div>

          {/* Action Icons Section */}
          <div
            className={`flex items-center gap-4 sm:gap-5 transition-colors ${isDarkText ? 'text-[#1b1c1c]' : 'text-white'
              }`}
          >
            {/* 1. Search */}
            <Link
              href="/products"
              aria-label="Search Catalog"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </Link>

            {/* 2. Wishlist */}
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="relative transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Heart className="h-5 w-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <motion.span
                  key={`wishlist-badge-${wishlistCount}`}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [1.35, 1], opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-[#fbf9f8]"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* 3. Shopping Bag Drawer Button */}
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <motion.span
                  key={`cart-badge-${cartCount}`}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: [1.35, 1], opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white ring-2 ring-[#fbf9f8]"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* 4. User Profile Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User Account Menu"
                className="flex items-center gap-1.5 focus:outline-none transition hover:opacity-85 cursor-pointer"
              >
                {user ? (
                  profile?.avatar_url ? (
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-[#e3e2e2]">
                      <Image
                        src={profile.avatar_url}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold font-display ${isAdmin ? 'bg-emerald-800 text-white' : 'bg-[#1b1c1c] text-white'
                      }`}>
                      {initials}
                    </div>
                  )
                ) : (
                  <UserIcon className="h-5 w-5 stroke-[1.5]" />
                )}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu Card */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3 w-60 bg-white border border-[#e3e2e2] shadow-2xl py-2 z-50 text-left text-[#1b1c1c]"
                  >
                    {user ? (
                      <>
                        {/* Header snippet */}
                        <div className="px-4 py-3 border-b border-[#e3e2e2] bg-[#fbf9f8]">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#1b1c1c] truncate">{displayName}</p>
                            {isAdmin && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 tracking-wider">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5e5e5b] truncate mt-0.5">{displayEmail}</p>
                        </div>

                        {/* Menu Options */}
                        <div className="py-1">
                          {isAdmin ? (
                            <>
                              <Link
                                href="/dashboard"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <ShieldCheck className="h-4 w-4 text-emerald-700 stroke-[1.5]" />
                                Admin Dashboard
                              </Link>
                              <Link
                                href="/dashboard/products"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <Tag className="h-4 w-4 stroke-[1.5]" />
                                Manage Products
                              </Link>
                              <Link
                                href="/dashboard/orders"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <Package className="h-4 w-4 stroke-[1.5]" />
                                Manage Orders
                              </Link>
                              <Link
                                href="/dashboard/collections"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <Grid className="h-4 w-4 stroke-[1.5]" />
                                Manage Collections
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/account"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <UserIcon className="h-4 w-4 stroke-[1.5]" />
                                My Profile
                              </Link>
                              <Link
                                href="/account/orders"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <Package className="h-4 w-4 stroke-[1.5]" />
                                Order History
                              </Link>
                              <Link
                                href="/account/addresses"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <MapPin className="h-4 w-4 stroke-[1.5]" />
                                Saved Addresses
                              </Link>
                              <Link
                                href="/account/wishlist"
                                onClick={() => setUserDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                              >
                                <Heart className="h-4 w-4 stroke-[1.5]" />
                                My Wishlist
                              </Link>
                            </>
                          )}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-[#e3e2e2] pt-1 mt-1">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                          >
                            <LogOut className="h-4 w-4 stroke-[1.5]" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-1">
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                        >
                          <UserIcon className="h-4 w-4 stroke-[1.5]" />
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                        >
                          <Tag className="h-4 w-4 stroke-[1.5]" />
                          Create Account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Container>

        {/* Mobile Left Navigation Drawer */}
        <MobileNavDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          initialCollections={collections}
          initialWhatsappNumber={whatsappNumber}
        />
      </nav>
    </header>
  );
}
