'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ProductReviews } from './product-reviews';

export type OptionType = 'code' | 'description' | 'reviews' | null;

export interface ProductSpecifications {
  sku?: string | null;
  description?: string;
  fabricDetails?: string | null;
  color?: string | null;
  pattern?: string | null;
  weight?: string | null;
  craftsmanship?: string | null;
  origin?: string | null;
}

interface ProductOptionsDrawerProps {
  activeOption: OptionType;
  onClose: () => void;
  specs: ProductSpecifications;
}

export function ProductOptionsDrawer({
  activeOption,
  onClose,
  specs,
}: ProductOptionsDrawerProps) {
  // Handle Escape key close listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeOption !== null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOption, onClose]);

  // Lock body scroll on desktop when drawer is active
  useEffect(() => {
    if (activeOption !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeOption]);

  const drawerTitle =
    activeOption === 'description'
      ? 'PRODUCT DESCRIPTION'
      : activeOption === 'reviews'
      ? 'CUSTOMER REVIEWS'
      : activeOption === 'code'
      ? 'PRODUCT CODE'
      : '';

  return (
    <AnimatePresence>
      {activeOption !== null && (
        <div className="fixed inset-0 z-[100] hidden lg:block">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Right Slide-Over Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={drawerTitle}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-10 flex h-full w-full max-w-lg flex-col justify-between bg-[#fbf9f8] shadow-2xl border-l border-[#e3e2e2]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#e3e2e2] px-6 py-5 bg-white">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-[#1b1c1c]">
                {drawerTitle}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="p-1.5 text-[#1b1c1c] hover:opacity-70 transition cursor-pointer"
              >
                <X className="h-5 w-5 stroke-[1.8]" />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeOption === 'description' && (
                <div className="space-y-6">
                  {/* Narrative Description */}
                  {specs.description && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                        Overview
                      </h3>
                      <p className="text-xs leading-relaxed text-[#5e5e5b] font-light">
                        {specs.description}
                      </p>
                    </div>
                  )}

                  {/* Specifications Table */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                      Specifications
                    </h3>
                    <div className="border border-[#e3e2e2] overflow-hidden rounded-none text-xs">
                      <div className="flex justify-between p-3 bg-white border-b border-[#e3e2e2]/60">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Colour</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">{specs.color || 'Heritage Multi'}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-[#f5f3f3] border-b border-[#e3e2e2]/60">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Fabric</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">{specs.fabricDetails || '100% Organic Superfine Cotton'}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white border-b border-[#e3e2e2]/60">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Value Addition</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">{specs.pattern || specs.craftsmanship || 'Handloom Weave'}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-[#f5f3f3] border-b border-[#e3e2e2]/60">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Measurement Unit</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">Inch / Free Size (Standard)</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white border-b border-[#e3e2e2]/60">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Craftsmanship</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">{specs.craftsmanship || 'Traditional Bangladesh Weave'}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-[#f5f3f3]">
                        <span className="font-medium text-[#5e5e5b] w-1/3">Care</span>
                        <span className="text-[#1b1c1c] font-normal w-2/3">Hand Wash With Mild Detergent In Cold Water. Do Not Bleach.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeOption === 'reviews' && (
                <div className="space-y-4">
                  <ProductReviews />
                </div>
              )}

              {activeOption === 'code' && (
                <div className="space-y-4 bg-white p-5 border border-[#e3e2e2]">
                  <p className="text-xs text-[#5e5e5b]">
                    Official Product SKU Code for reference and store inquiries:
                  </p>
                  <div className="flex items-center justify-between bg-[#f5f3f3] p-3 border border-[#e3e2e2]">
                    <span className="font-mono text-sm font-bold text-[#1b1c1c] tracking-wider">
                      {specs.sku || 'NL-HERITAGE-01'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
