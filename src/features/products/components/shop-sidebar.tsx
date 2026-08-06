'use client';

import React from 'react';

interface ShopSidebarProps {
  categories: { id: string; label: string }[];
  collections: { id: string; label: string }[];
  selectedCategories: string[];
  selectedCollections: string[];
  priceRange: [number, number];
  minPriceLimit: number;
  maxPriceLimit: number;
  onCategoryToggle: (categoryId: string) => void;
  onCollectionToggle: (collectionId: string) => void;
  onPriceChange: (newRange: [number, number]) => void;
}

export function ShopSidebar({
  categories,
  collections,
  selectedCategories,
  selectedCollections,
  priceRange,
  minPriceLimit,
  maxPriceLimit,
  onCategoryToggle,
  onCollectionToggle,
  onPriceChange,
}: ShopSidebarProps) {
  const [minVal, maxVal] = priceRange;
  const step = 100;

  const minPercent = Math.min(
    100,
    Math.max(0, ((minVal - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100)
  );
  const maxPercent = Math.min(
    100,
    Math.max(0, ((maxVal - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100)
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    onPriceChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    onPriceChange([minVal, val]);
  };

  return (
    <aside className="w-full space-y-8 pr-4 lg:w-64 shrink-0">
      {/* Category Section */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onCategoryToggle(cat.id)}
                  className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                />
                <span className={isChecked ? 'font-medium text-[#1b1c1c]' : ''}>
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Collection Section */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">
          Collection
        </h3>
        <div className="space-y-2">
          {collections.map((col) => {
            const isChecked = selectedCollections.includes(col.id);
            return (
              <label
                key={col.id}
                className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onCollectionToggle(col.id)}
                  className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                />
                <span className={isChecked ? 'font-medium text-[#1b1c1c]' : ''}>
                  {col.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Both-Sided Dual Range Price Slider */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">
          Price Range
        </h3>
        <div className="pt-2 space-y-4">
          <div className="relative py-2">
            {/* Background line track */}
            <div className="h-1.5 w-full bg-[#e3e2e2] rounded-full relative">
              {/* Highlighted active price range segment */}
              <div
                className="absolute top-0 bottom-0 bg-[#1b1c1c] rounded-full"
                style={{
                  left: `${minPercent}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`,
                }}
              />
            </div>

            {/* Invisible Range Inputs for Mouse & Touch Drags */}
            <input
              type="range"
              min={minPriceLimit}
              max={maxPriceLimit}
              step={step}
              value={minVal}
              onChange={handleMinChange}
              aria-label="Minimum Price"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto z-30"
            />
            <input
              type="range"
              min={minPriceLimit}
              max={maxPriceLimit}
              step={step}
              value={maxVal}
              onChange={handleMaxChange}
              aria-label="Maximum Price"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto z-40"
            />

            {/* Visual Handles */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#1b1c1c] border-2 border-white shadow-xs pointer-events-none z-20"
              style={{ left: `calc(${minPercent}% - 8px)` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#1b1c1c] border-2 border-white shadow-xs pointer-events-none z-20"
              style={{ left: `calc(${maxPercent}% - 8px)` }}
            />
          </div>

          {/* Min & Max Price Display Labels */}
          <div className="border-t border-[#e3e2e2] pt-3 flex items-center justify-between text-xs font-semibold text-[#1b1c1c]">
            <span>৳{minVal.toLocaleString('en-BD')}</span>
            <span>৳{maxVal.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
