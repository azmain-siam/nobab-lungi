'use client';

import { Container } from '@/components/ui/container';
import { useCart } from '@/context/cart-context';
import { useUser } from '@/features/auth/hooks/use-user';
import { Heart, Menu, Search, ShoppingBag, User, X, ShieldCheck, LogOut, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface HeaderProps {
  variant?: 'transparent' | 'light';
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeVariant = variant ?? (pathname === '/' ? 'transparent' : 'light');
  const isTransparentVariant = activeVariant === 'transparent';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openCart, cartCount } = useCart();
  const { user, profile, signOut } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const getHeaderStyles = () => {
    if (isTransparentVariant) {
      if (scrolled) {
        return 'fixed top-0 left-0 right-0 z-50 w-full bg-[#1b1c1c]/70 backdrop-blur-md shadow-lg transition-all duration-300';
      }
      return 'absolute top-0 left-0 right-0 z-50 w-full bg-transparent transition-all duration-300';
    }
    return 'sticky top-0 z-50 w-full border-b border-[#e3e2e2] bg-[#fbf9f8]/95 backdrop-blur-md transition-all duration-300';
  };

  const isDarkText = !isTransparentVariant;

  return (
    <header className={getHeaderStyles()}>
      <nav aria-label="Main navigation">
        <Container
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'py-4' : 'py-5'
          }`}
        >
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1 focus:outline-none ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Brand Logo */}
          <Link
            href="/"
            className={`font-display text-xl font-bold tracking-tight transition hover:opacity-85 ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
          >
            Nabab Lungi
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/collections"
              className={`relative text-xs font-semibold uppercase tracking-[0.15em] transition ${
                pathname.startsWith('/collections')
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
              className={`relative text-xs font-semibold uppercase tracking-[0.15em] transition ${
                pathname.startsWith('/products')
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
              href="/#about"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition ${
                isDarkText
                  ? 'text-[#5e5e5b] hover:text-[#1b1c1c]'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              ABOUT
            </Link>
          </div>

          {/* Action Icons */}
          <div
            className={`flex items-center gap-4 sm:gap-5 ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
          >
            {/* Search */}
            <Link
              href="/products"
              aria-label="Search Catalog"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Heart className="h-5 w-5 stroke-[1.5]" />
            </Link>

            {/* Logged in Navigation Controls */}
            {user ? (
              <>
                <Link
                  href="/account/orders"
                  aria-label="My Orders"
                  className="transition hover:opacity-75 focus:outline-none cursor-pointer hidden sm:block"
                  title="My Orders"
                >
                  <Package className="h-5 w-5 stroke-[1.5]" />
                </Link>

                {profile?.role === 'admin' && (
                  <Link
                    href="/dashboard"
                    aria-label="Admin Dashboard"
                    className="transition hover:opacity-75 focus:outline-none cursor-pointer"
                    title="Admin Dashboard"
                  >
                    <ShieldCheck className="h-5 w-5 stroke-[1.5] text-emerald-600" />
                  </Link>
                )}

                <Link
                  href="/account"
                  aria-label="Account Profile"
                  className="transition hover:opacity-75 focus:outline-none cursor-pointer"
                  title="Profile"
                >
                  <User className="h-5 w-5 stroke-[1.5]" />
                </Link>

                <button
                  onClick={handleSignOut}
                  aria-label="Logout"
                  className="transition hover:opacity-75 focus:outline-none cursor-pointer hidden sm:block text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 stroke-[1.5]" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold uppercase tracking-wider transition hover:opacity-75"
                >
                  Login
                </Link>
                <span className="text-xs opacity-40">|</span>
                <Link
                  href="/register"
                  className="text-xs font-semibold uppercase tracking-wider transition hover:opacity-75"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Shopping Bag Drawer */}
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative transition hover:opacity-75 focus:outline-none cursor-pointer ml-1"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white ring-2 ring-[#fbf9f8]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#e3e2e2] bg-white p-6 space-y-4 shadow-xl">
            <div className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-wider">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1b1c1c] hover:text-[#5e5e5b]"
              >
                Collections
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1b1c1c] hover:text-[#5e5e5b]"
              >
                Shop
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1b1c1c] hover:text-[#5e5e5b]"
              >
                About
              </Link>

              <div className="border-t border-[#e3e2e2] pt-4 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#1b1c1c] hover:text-[#5e5e5b] flex items-center justify-between"
                    >
                      <span>Profile</span>
                      <span className="text-xs font-normal text-[#5e5e5b] lowercase">
                        {user.email}
                      </span>
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#1b1c1c] hover:text-[#5e5e5b] flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Orders
                    </Link>

                    {profile?.role === 'admin' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-emerald-700 hover:text-emerald-900 flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider cursor-pointer pt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#1b1c1c] hover:text-[#5e5e5b] block"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#5e5e5b] hover:text-[#1b1c1c] block"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
