'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, MessageCircle, ArrowRight } from 'lucide-react';
import { getMobileNavDataAction } from '@/actions/collections';
import type { Collection } from '@/types';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCollections?: Collection[];
  initialWhatsappNumber?: string;
}

const emptySubscribe = () => () => {};

export function MobileNavDrawer({
  isOpen,
  onClose,
  initialCollections = [],
  initialWhatsappNumber,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [viewMode, setViewMode] = useState<'main' | 'collections'>('main');
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>(initialWhatsappNumber);

  // Fetch navigation data dynamically on mount if not provided as props
  useEffect(() => {
    let isMounted = true;
    if (collections.length === 0 || !whatsappNumber) {
      getMobileNavDataAction()
        .then((res) => {
          if (!isMounted) return;
          if (res.collections.length > 0) {
            setCollections(res.collections);
          }
          if (res.whatsappNumber) {
            setWhatsappNumber(res.whatsappNumber);
          }
        })
        .catch((err) => console.error('Error loading mobile nav drawer data:', err));
    }
    return () => {
      isMounted = false;
    };
  }, [collections.length, whatsappNumber]);

  const handleClose = () => {
    setViewMode('main');
    onClose();
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setViewMode('main');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const phone = whatsappNumber || '+880 1712-345678';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Nobab Lungi! I would like to inquire about your premium handloom lungi collection.'
  )}`;

  const activeCollections = collections.filter((c) => c.is_active);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Left Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 bottom-0 h-full w-[84vw] max-w-xs bg-[#fbf9f8] border-r border-[#e3e2e2] shadow-2xl flex flex-col justify-between overflow-hidden z-[10000]"
          >
            {/* Header: Title & Close Button */}
            <div className="p-5 border-b border-[#e3e2e2] flex items-center justify-between bg-white shrink-0">
              <Link
                href="/"
                onClick={handleClose}
                className="font-display text-lg font-bold tracking-tight text-[#1b1c1c]"
              >
                Nabab Lungi
              </Link>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close navigation drawer"
                className="p-1 text-[#1b1c1c] hover:opacity-70 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Middle Section: Animated Sub-Panels */}
            <div className="flex-1 overflow-y-auto p-5 relative">
              <AnimatePresence mode="wait" initial={false}>
                {viewMode === 'main' ? (
                  <motion.div
                    key="main-view"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2"
                  >
                    {/* COLLECTIONS Button (Opens Sub-Panel) */}
                    <button
                      type="button"
                      onClick={() => setViewMode('collections')}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition text-left cursor-pointer ${
                        pathname.startsWith('/collections')
                          ? 'bg-[#1b1c1c] text-white'
                          : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
                      }`}
                    >
                      <span>Collections</span>
                      <ChevronRight className="h-4 w-4 stroke-[1.5]" />
                    </button>

                    {/* SHOP */}
                    <Link
                      href="/products"
                      onClick={handleClose}
                      className={`block p-3 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition ${
                        pathname.startsWith('/products')
                          ? 'bg-[#1b1c1c] text-white'
                          : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
                      }`}
                    >
                      Shop
                    </Link>

                    {/* ABOUT */}
                    <Link
                      href="/about"
                      onClick={handleClose}
                      className={`block p-3 rounded-lg text-xs font-semibold uppercase tracking-[0.15em] transition ${
                        pathname.startsWith('/about')
                          ? 'bg-[#1b1c1c] text-white'
                          : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
                      }`}
                    >
                      About
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collections-view"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setViewMode('main')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#5e5e5b] hover:text-[#1b1c1c] transition cursor-pointer pb-2 border-b border-[#e3e2e2] w-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back to Navigation</span>
                    </button>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b] px-2 pb-1">
                        Our Collections
                      </p>

                      {/* View All Collections Link */}
                      <Link
                        href="/collections"
                        onClick={handleClose}
                        className="flex items-center justify-between p-2.5 rounded-md text-xs font-bold text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                      >
                        <span>View All Collections</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      {/* Dynamic Collection Items */}
                      {activeCollections.length > 0 ? (
                        activeCollections.map((col) => (
                          <Link
                            key={col.id}
                            href={`/collections/${col.slug}`}
                            onClick={handleClose}
                            className="block p-2.5 rounded-md text-xs font-medium text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition truncate"
                          >
                            {col.name}
                          </Link>
                        ))
                      ) : (
                        <>
                          <Link
                            href="/collections/eid-special"
                            onClick={handleClose}
                            className="block p-2.5 rounded-md text-xs font-medium text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                          >
                            Eid Special Series
                          </Link>
                          <Link
                            href="/collections/summer-collection"
                            onClick={handleClose}
                            className="block p-2.5 rounded-md text-xs font-medium text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                          >
                            Summer Collection
                          </Link>
                          <Link
                            href="/collections/new-arrivals"
                            onClick={handleClose}
                            className="block p-2.5 rounded-md text-xs font-medium text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] transition"
                          >
                            New Arrivals
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Support Section */}
            <div className="p-5 border-t border-[#e3e2e2] bg-white shrink-0 space-y-2">
              <span className="block text-[11px] font-semibold text-[#5e5e5b]">
                Need help?
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg hover:bg-emerald-100 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-700 stroke-[1.8]" />
                  <span className="text-xs font-semibold">Chat with us on WhatsApp</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
