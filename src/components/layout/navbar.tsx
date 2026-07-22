'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { User } from '@supabase/supabase-js';
import { UserMenuButton } from './user-menu-button';

interface NavbarProps {
  user: User | null;
}

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Categories', href: '/categories' },
] as const;

/**
 * Store Navbar — Client Component for mobile menu state.
 * Receives user from the store layout (no extra DB fetch here).
 */
export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 transition hover:text-primary"
        >
          Nobab Lungi
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-medium transition',
                  pathname.startsWith(link.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
          </Link>

          {/* Auth section — desktop */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {user ? (
              <UserMenuButton user={user} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <ul className="space-y-1 px-4 py-3" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    'block rounded-md px-3 py-2.5 text-sm font-medium transition',
                    pathname.startsWith(link.href)
                      ? 'bg-primary-light text-primary'
                      : 'text-gray-700 hover:bg-gray-100',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile auth */}
          <div className="border-t border-gray-100 px-4 py-3">
            {user ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  {user.user_metadata?.full_name?.split(' ')[0] ??
                    user.email?.split('@')[0] ??
                    'Account'}
                </p>
                <Link
                  href="/account"
                  onClick={closeMobile}
                  className="text-sm font-medium text-primary underline underline-offset-4"
                >
                  My Account
                </Link>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="flex-1 rounded-md border border-gray-300 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
                  className="flex-1 rounded-md bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-hover"
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
