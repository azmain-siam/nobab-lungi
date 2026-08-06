'use client';

import { useState, useEffect } from 'react';
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
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isOpen) {
      timer1 = setTimeout(() => setShouldRender(true), 0);
      timer2 = setTimeout(() => setAnimateIn(true), 20);
    } else {
      timer1 = setTimeout(() => setAnimateIn(false), 0);
      timer2 = setTimeout(() => setShouldRender(false), 300);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSelectOption = (id: string) => {
    onSortChange(id);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      {/* Backdrop overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        className={`relative z-10 flex flex-col w-full bg-[#fbf9f8] rounded-t-2xl shadow-2xl overflow-hidden border-t border-[#e3e2e2] transition-transform duration-300 ease-out transform motion-reduce:transition-none motion-reduce:transform-none ${
          animateIn ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e2e2] bg-white">
          <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Sort By</h2>
          <button
            onClick={handleClose}
            aria-label="Close Sort Modal"
            className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] active:scale-90 transition-transform duration-150 cursor-pointer"
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
                onClick={() => handleSelectOption(option.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors duration-150 active:scale-[0.98] cursor-pointer motion-reduce:transform-none ${
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
