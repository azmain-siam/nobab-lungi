'use client';

import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { logoutAction } from '@/features/auth/actions/auth-actions';

interface UserMenuButtonProps {
  user: User;
}

/**
 * Client Component — handles the interactive user dropdown in the Navbar.
 * Receives the already-fetched user from the Server Component (no extra fetch).
 */
export function UserMenuButton({ user }: UserMenuButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    user.user_metadata?.full_name?.split(' ')[0] ??
    user.email?.split('@')[0] ??
    'Account';

  return (
    <div ref={menuRef} className="relative">
      <button
        id="user-menu-button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none"
      >
        {/* Avatar initial */}
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white"
        >
          {displayName[0].toUpperCase()}
        </span>
        <span className="hidden sm:block">{displayName}</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          <a
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            My Profile
          </a>
          <a
            href="/account/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            My Orders
          </a>
          <a
            href="/account/wishlist"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Wishlist
          </a>
          <div className="my-1 border-t border-gray-100" />
          <form action={logoutAction}>
            <button
              id="user-menu-logout"
              type="submit"
              role="menuitem"
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
