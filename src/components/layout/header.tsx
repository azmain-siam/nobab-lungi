'use client';

import { Container } from '@/components/ui/container';
import { Heart, Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-context';

interface HeaderProps {
  variant?: 'transparent' | 'light';
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const activeVariant = variant ?? (pathname === '/' ? 'transparent' : 'light');
  const isTransparentVariant = activeVariant === 'transparent';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, cartCount } = useCart();

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

  // Determine navbar styling dynamically based on variant and scroll position
  const getHeaderStyles = () => {
    if (isTransparentVariant) {
      if (scrolled) {
        return 'fixed top-0 left-0 right-0 z-50 w-full bg-[#1b1c1c]/90 backdrop-blur-md shadow-lg transition-all duration-300';
      }
      return 'absolute top-0 left-0 right-0 z-50 w-full bg-transparent transition-all duration-300';
    }
    return 'sticky top-0 z-50 w-full border-b border-[#e3e2e2] bg-[#fbf9f8]/95 backdrop-blur-md transition-all duration-300';
  };

  const isDarkText = !isTransparentVariant || (isTransparentVariant && scrolled);

  return (
    <header className={getHeaderStyles()}>
      <nav aria-label="Main navigation">
        <Container
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'py-4' : 'py-5'
          }`}
        >
          {/* Mobile Menu Toggle (Left on mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1 focus:outline-none ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

            {/* User Account */}
            <Link
              href="/account"
              aria-label="Account Profile"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <User className="h-5 w-5 stroke-[1.5]" />
            </Link>

            {/* Shopping Bag Drawer */}
            <button
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative transition hover:opacity-75 focus:outline-none cursor-pointer"
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
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1b1c1c] hover:text-[#5e5e5b]"
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
