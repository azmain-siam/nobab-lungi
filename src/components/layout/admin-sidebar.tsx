'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Users,
  Settings,
  Grid,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sliders,
  X,
  Ticket,
  Heart,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/categories', label: 'Categories', icon: Grid },
  { href: '/dashboard/collections', label: 'Collections', icon: Layers },
  { href: '/dashboard/homepage', label: 'Homepage CMS', icon: Sliders },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/coupons', label: 'Coupons', icon: Ticket },
  { href: '/dashboard/wishlist', label: 'Wishlist Insights', icon: Heart },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className={`flex flex-col justify-between h-full space-y-6 ${isCollapsed ? 'p-3' : 'p-4 lg:p-6'}`}>
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="border-b border-white/10 pb-5">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/dashboard"
                className="font-display text-lg font-bold tracking-tight text-white flex items-center justify-center p-1"
                title="Nabab Admin Dashboard"
              >
                <ShieldCheck className="h-6 w-6 text-emerald-400 stroke-[2]" />
              </Link>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1 text-white/60 hover:text-white hover:bg-white/10 transition"
                  title="Expand sidebar"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={onMobileClose}
                className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-2 overflow-hidden"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-400 stroke-[2] shrink-0" />
                <span className="truncate">Nabab Admin</span>
              </Link>

              {/* Desktop collapse toggle button */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1 text-white/60 hover:text-white hover:bg-white/10 transition"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}

              {/* Mobile close button */}
              {onMobileClose && (
                <button
                  onClick={onMobileClose}
                  className="lg:hidden p-1 text-white/60 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav aria-label="Admin Navigation" className="space-y-1.5">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            if (isCollapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`h-10 w-10 mx-auto flex items-center justify-center transition ${
                    isActive
                      ? 'bg-white text-[#1b1c1c]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5 stroke-[1.5] shrink-0" />
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-white text-[#1b1c1c]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.5] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to Storefront */}
      <div className="border-t border-white/10 pt-4">
        {isCollapsed ? (
          <Link
            href="/"
            title="View Storefront"
            className="h-10 w-10 mx-auto flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <ExternalLink className="h-5 w-5 stroke-[1.5] shrink-0" />
          </Link>
        ) : (
          <Link
            href="/"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 px-2 py-1.5 text-xs font-medium text-white/70 hover:text-white transition"
          >
            <ExternalLink className="h-4 w-4 stroke-[1.5] shrink-0" />
            <span className="truncate">View Storefront</span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1b1c1c] text-white shrink-0 sticky top-0 h-screen transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Simple Animation */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Simple Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed inset-0 bg-black/50"
              onClick={onMobileClose}
            />

            {/* Simple Slide-in Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative z-10 w-72 max-w-[80vw] bg-[#1b1c1c] text-white h-full shadow-lg"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
