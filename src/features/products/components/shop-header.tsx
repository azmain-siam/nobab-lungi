'use client';

import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

export interface ActiveChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface ShopHeaderProps {
  searchQuery: string;
  selectedSort: string;
  activeFilterCount: number;
  activeChips: ActiveChip[];
  totalProducts: number;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: string) => void;
  onOpenFilter: () => void;
  onOpenSort: () => void;
}

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export function ShopHeader({
  searchQuery,
  selectedSort,
  activeFilterCount,
  activeChips,
  totalProducts,
  onSearchChange,
  onSortChange,
  onOpenFilter,
  onOpenSort,
}: ShopHeaderProps) {
  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === selectedSort)?.label || 'Featured';

  return (
    <div className="space-y-6 pb-6 lg:pb-8 border-b border-[#e3e2e2] mb-8 lg:mb-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1b1c1c]">
          Shop Collection
        </h1>
        <p className="mt-1.5 text-xs font-light text-[#5e5e5b] sm:text-sm">
          Browse our complete catalog of authentic Bangladeshi handloom products.
        </p>
      </div>

      {/* Search Bar & Desktop Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lungi, patterns..."
            className="w-full bg-white border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] placeholder:text-[#5e5e5b]/60 rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        {/* Desktop-Only Sort Select (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5e5e5b]">
            Sort by:
          </span>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-[#e3e2e2] px-3 py-2 text-xs font-medium text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition cursor-pointer"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile-Only Action Row (< 1024px): [ FILTER (3) ] [ SORT ] */}
      <div className="flex lg:hidden items-center gap-3 pt-1">
        <button
          onClick={onOpenFilter}
          aria-label="Open Filter Drawer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#1b1c1c] text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider hover:bg-[#1b1c1c] hover:text-white transition active:scale-[0.98] cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[1.8]" />
          <span>FILTER</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-[#1b1c1c] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSort}
          aria-label="Open Sort Modal"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#e3e2e2] text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider hover:border-[#1b1c1c] transition active:scale-[0.98] cursor-pointer"
        >
          <ArrowUpDown className="h-4 w-4 stroke-[1.8] text-[#5e5e5b]" />
          <span className="truncate">SORT: {currentSortLabel}</span>
        </button>
      </div>

      {/* Mobile Active Removable Chips Row (< 1024px) */}
      {activeChips.length > 0 && (
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f3f3] border border-[#e3e2e2] text-[11px] font-medium text-[#1b1c1c] whitespace-nowrap rounded-full shrink-0"
            >
              <span>{chip.label}</span>
              <button
                onClick={chip.onRemove}
                aria-label={`Remove filter ${chip.label}`}
                className="hover:text-red-600 transition p-0.5 cursor-pointer"
              >
                <X className="h-3 w-3 stroke-[2]" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Product Count Display */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
          <strong className="text-[#1b1c1c] font-bold">{totalProducts}</strong> Products Found
        </span>
      </div>
    </div>
  );
}
