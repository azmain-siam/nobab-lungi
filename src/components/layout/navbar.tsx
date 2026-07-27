'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Search, Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { User } from '@supabase/supabase-js';
import { UserMenuButton } from './user-menu-button';

interface NavbarProps {
  user: User | null;
}

const NAV_LINKS = [
  { label: 'Lungis', href: '/products?category=lungi' },
  { label: 'Sarees', href: '/products?category=saree' },
  { label: 'Collections', href: '/collections' },
  { label: 'All Products', href: '/products' },
] as const;

/**
 * Store Navbar — Glassmorphic Heritage Minimalist Header.
 * Uses backdrop blur and Playfair Display typography.
 */
export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-wider text-foreground transition hover:opacity-85"
        >
          NOBAB
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-xs font-semibold uppercase tracking-widest transition-colors',
                  pathname.startsWith(link.href)
                    ? 'text-secondary font-bold'
                    : 'text-foreground/80 hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            aria-label="Search"
            className="rounded-full p-2 text-foreground/80 transition hover:bg-black/5 hover:text-foreground"
          >
            <Search aria-hidden="true" className="h-5 w-5 stroke-[1.5]" />
          </Link>

          <Link
            href="/account"
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-foreground/80 transition hover:bg-black/5 hover:text-foreground sm:block"
          >
            <Heart aria-hidden="true" className="h-5 w-5 stroke-[1.5]" />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative rounded-full p-2 text-foreground/80 transition hover:bg-black/5 hover:text-foreground"
          >
            <ShoppingBag aria-hidden="true" className="h-5 w-5 stroke-[1.5]" />
          </Link>

          {/* User Account / Auth section — Desktop */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {user ? (
              <UserMenuButton user={user} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary-hover"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-foreground/80 transition hover:bg-black/5 md:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          className="border-t border-border bg-background/95 backdrop-blur-lg md:hidden"
        >
          <ul className="space-y-1 px-4 py-4" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    'block rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition',
                    pathname.startsWith(link.href)
                      ? 'bg-secondary-light text-secondary'
                      : 'text-foreground/90 hover:bg-black/5',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-border px-4 py-4">
            {user ? (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {user.user_metadata?.full_name?.split(' ')[0] ??
                    user.email?.split('@')[0] ??
                    'Account'}
                </p>
                <Link
                  href="/account"
                  onClick={closeMobile}
                  className="text-xs font-semibold uppercase tracking-wider text-secondary underline underline-offset-4"
                >
                  My Account
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="flex-1 rounded-md border border-border py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-foreground transition hover:bg-black/5"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
                  className="flex-1 rounded-md bg-primary py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary-hover"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
