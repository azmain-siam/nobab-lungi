import type { User } from '@supabase/supabase-js';
import { UserMenuButton } from './user-menu-button';

interface NavbarProps {
  user: User | null;
}

/**
 * Store Navbar — Server Component.
 * Receives user from the store layout (no extra DB fetch here).
 */
export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:text-gray-700"
        >
          Nobab Lungi
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex" role="list">
          <li>
            <a href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Products
            </a>
          </li>
          <li>
            <a
              href="/collections"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Collections
            </a>
          </li>
          <li>
            <a
              href="/categories"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Categories
            </a>
          </li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart icon (stub — Phase 4) */}
          <a
            href="/cart"
            aria-label="Cart"
            className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </a>

          {/* Auth section */}
          {user ? (
            <UserMenuButton user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Sign in
              </a>
              <a
                href="/register"
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
