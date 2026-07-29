'use client';

import { Container } from '@/components/ui/container';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/cart-context';

interface HeaderProps {
  variant?: 'transparent' | 'light';
}

export function Header({ variant = 'light' }: HeaderProps) {
  const pathname = usePathname();
  const isTransparentVariant = variant === 'transparent';
  const [scrolled, setScrolled] = useState(false);
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
        return 'fixed top-0 left-0 right-0 z-50 w-full bg-[#1b1c1c]/60 backdrop-blur-md shadow-lg transition-all duration-300';
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
          {/* Brand Logo */}
          <Link
            href="/"
            className={`font-display text-xl font-bold tracking-tight transition hover:opacity-85 ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
          >
            Nabab Lungi
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/#collections"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition ${
                isDarkText
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
            className={`flex items-center gap-5 ${
              isDarkText ? 'text-[#1b1c1c]' : 'text-white'
            }`}
          >
            <button
              aria-label="Search"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button
              aria-label="Wishlist"
              className="transition hover:opacity-75 focus:outline-none cursor-pointer"
            >
              <Heart className="h-5 w-5 stroke-[1.5]" />
            </button>
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
      </nav>
    </header>
  );
}
