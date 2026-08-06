'use client';

import { X, Check } from 'lucide-react';

interface MobileSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export function MobileSortModal({
  isOpen,
  onClose,
  selectedSort,
  onSortChange,
}: MobileSortModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Sheet */}
      <div className="relative z-10 flex flex-col w-full bg-[#fbf9f8] rounded-t-2xl shadow-2xl overflow-hidden border-t border-[#e3e2e2]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e2e2] bg-white">
          <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Sort By</h2>
          <button
            onClick={onClose}
            aria-label="Close Sort Modal"
            className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 space-y-1">
          {SORT_OPTIONS.map((option) => {
            const isSelected = selectedSort === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onSortChange(option.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-none transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1b1c1c] text-white'
                    : 'text-[#1b1c1c] hover:bg-[#e3e2e2]/40'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-4 w-4 stroke-[2]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
