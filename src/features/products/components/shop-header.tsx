'use client';

import { Search } from 'lucide-react';

interface ShopHeaderProps {
  searchQuery: string;
  selectedSort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: string) => void;
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
  onSearchChange,
  onSortChange,
}: ShopHeaderProps) {
  return (
    <div className="space-y-6 pb-8 border-b border-[#e3e2e2] mb-10">
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
          Shop Collection
        </h1>
        <p className="mt-2 text-xs font-light text-[#5e5e5b] sm:text-sm">
          Browse our complete catalog of authentic Bangladeshi handloom products.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lungi, saree, patterns..."
            className="w-full bg-white border border-[#e3e2e2] py-2.5 pl-10 pr-4 text-xs text-[#1b1c1c] placeholder:text-[#5e5e5b]/60 rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
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
    </div>
  );
}
