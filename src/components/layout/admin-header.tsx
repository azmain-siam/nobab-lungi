'use client';

import { Menu, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/features/auth/hooks/use-user';
import { AdminBreadcrumbs } from '@/components/admin/admin-breadcrumbs';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user, profile } = useUser();

  const displayName = profile?.name || user?.user_metadata?.full_name || 'Admin User';
  const displayEmail = user?.email || 'admin@nobablungi.com';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e3e2e2] bg-[#fbf9f8]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 text-[#1b1c1c] hover:bg-[#efeded] transition"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 stroke-[1.5]" />
          </button>

          <AdminBreadcrumbs />
        </div>

        {/* Right: Quick Store View & Profile snippet */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5e5e5b] hover:text-[#1b1c1c] transition"
            title="Open Customer Storefront"
          >
            <ExternalLink className="h-3.5 w-3.5 stroke-[1.5]" />
            Storefront
          </Link>

          <div className="flex items-center gap-2 border-l border-[#e3e2e2] pl-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-800 text-white font-display font-bold text-xs">
              <ShieldCheck className="h-4 w-4 stroke-[2]" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-[#1b1c1c] leading-tight truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[10px] text-[#5e5e5b] truncate max-w-[120px] leading-tight">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
