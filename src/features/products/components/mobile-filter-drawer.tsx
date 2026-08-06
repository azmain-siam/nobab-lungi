'use client';

import React, { useState } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; label: string }[];
  collections: { id: string; label: string }[];
  fabrics: string[];
  patterns: string[];
  colors: string[];
  selectedCategories: string[];
  selectedCollections: string[];
  selectedFabrics: string[];
  selectedPatterns: string[];
  selectedColors: string[];
  inStockOnly: boolean;
  priceRange: [number, number];
  minPriceLimit: number;
  maxPriceLimit: number;
  onCategoryToggle: (categoryId: string) => void;
  onCollectionToggle: (collectionId: string) => void;
  onFabricToggle: (fabric: string) => void;
  onPatternToggle: (pattern: string) => void;
  onColorToggle: (color: string) => void;
  onInStockToggle: (inStock: boolean) => void;
  onPriceChange: (newRange: [number, number]) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

function getColorHex(colorName: string): string {
  const name = colorName.toLowerCase();
  if (name.includes('navy') || name.includes('blue')) return '#1e293b';
  if (name.includes('maroon') || name.includes('red') || name.includes('crimson')) return '#7f1d1d';
  if (name.includes('green') || name.includes('emerald')) return '#14532d';
  if (name.includes('black') || name.includes('charcoal')) return '#18181b';
  if (name.includes('white') || name.includes('cream') || name.includes('off')) return '#f8fafc';
  if (name.includes('grey') || name.includes('gray')) return '#64748b';
  if (name.includes('amber') || name.includes('yellow') || name.includes('gold')) return '#b45309';
  return '#475569';
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  collections,
  fabrics,
  patterns,
  colors,
  selectedCategories,
  selectedCollections,
  selectedFabrics,
  selectedPatterns,
  selectedColors,
  inStockOnly,
  priceRange,
  minPriceLimit,
  maxPriceLimit,
  onCategoryToggle,
  onCollectionToggle,
  onFabricToggle,
  onPatternToggle,
  onColorToggle,
  onInStockToggle,
  onPriceChange,
  onClearAll,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
  });

  if (!isOpen) return null;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden">
      {/* Backdrop overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Bottom Sheet / Full Height Drawer */}
      <div className="relative z-10 flex flex-col w-full max-h-[85vh] bg-[#fbf9f8] rounded-t-2xl shadow-2xl overflow-hidden border-t border-[#e3e2e2]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e2e2] bg-white">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-[#1b1c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount} Active
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close Filter Drawer"
            className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Scrollable Filter Groups */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divider-y divide-[#e3e2e2]">
          {/* 1. Category */}
          <div className="py-2 border-b border-[#e3e2e2] pb-4">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
            >
              <span>Category</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.category ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.category && (
              <div className="mt-3 space-y-2.5 pl-1">
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
                      <span className={isChecked ? 'font-semibold text-[#1b1c1c]' : ''}>
                        {cat.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Collection */}
          <div className="py-2 border-b border-[#e3e2e2] pb-4">
            <button
              onClick={() => toggleSection('collection')}
              className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
            >
              <span>Collection</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.collection ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.collection && (
              <div className="mt-3 space-y-2.5 pl-1">
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
                      <span className={isChecked ? 'font-semibold text-[#1b1c1c]' : ''}>
                        {col.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Fabric */}
          {fabrics.length > 0 && (
            <div className="py-2 border-b border-[#e3e2e2] pb-4">
              <button
                onClick={() => toggleSection('fabric')}
                className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
              >
                <span>Fabric</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSections.fabric ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.fabric && (
                <div className="mt-3 space-y-2.5 pl-1">
                  {fabrics.map((fabric) => {
                    const isChecked = selectedFabrics.includes(fabric);
                    return (
                      <label
                        key={fabric}
                        className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onFabricToggle(fabric)}
                          className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'font-semibold text-[#1b1c1c]' : ''}>
                          {fabric}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. Pattern */}
          {patterns.length > 0 && (
            <div className="py-2 border-b border-[#e3e2e2] pb-4">
              <button
                onClick={() => toggleSection('pattern')}
                className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
              >
                <span>Pattern</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSections.pattern ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.pattern && (
                <div className="mt-3 space-y-2.5 pl-1">
                  {patterns.map((pattern) => {
                    const isChecked = selectedPatterns.includes(pattern);
                    return (
                      <label
                        key={pattern}
                        className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onPatternToggle(pattern)}
                          className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'font-semibold text-[#1b1c1c]' : ''}>
                          {pattern}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. Color */}
          {colors.length > 0 && (
            <div className="py-2 border-b border-[#e3e2e2] pb-4">
              <button
                onClick={() => toggleSection('color')}
                className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
              >
                <span>Color</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openSections.color ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.color && (
                <div className="mt-3 space-y-2.5 pl-1">
                  {colors.map((color) => {
                    const isChecked = selectedColors.includes(color);
                    const hex = getColorHex(color);
                    return (
                      <label
                        key={color}
                        className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onColorToggle(color)}
                          className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                        />
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-stone-300 inline-block shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span className={isChecked ? 'font-semibold text-[#1b1c1c]' : ''}>
                          {color}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. Availability */}
          <div className="py-2 border-b border-[#e3e2e2] pb-4">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
            >
              <span>Availability</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.availability ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.availability && (
              <div className="mt-3 pl-1">
                <label className="flex items-center gap-3 text-xs text-[#5e5e5b] hover:text-[#1b1c1c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => onInStockToggle(e.target.checked)}
                    className="h-4 w-4 border-[#e3e2e2] rounded-none text-black focus:ring-0 cursor-pointer"
                  />
                  <span className={inStockOnly ? 'font-semibold text-[#1b1c1c]' : ''}>
                    In Stock Only
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 7. Price Range */}
          <div className="py-2 pb-6">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between py-1 text-left text-sm font-semibold text-[#1b1c1c] cursor-pointer"
            >
              <span>Price Range</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections.price ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openSections.price && (
              <div className="mt-4 pt-2 space-y-4 px-1">
                <div className="relative py-2">
                  <div className="h-1.5 w-full bg-[#e3e2e2] rounded-full relative">
                    <div
                      className="absolute top-0 bottom-0 bg-[#1b1c1c] rounded-full"
                      style={{
                        left: `${minPercent}%`,
                        width: `${Math.max(0, maxPercent - minPercent)}%`,
                      }}
                    />
                  </div>

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

                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#1b1c1c] border-2 border-white shadow-xs pointer-events-none z-20"
                    style={{ left: `calc(${minPercent}% - 8px)` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#1b1c1c] border-2 border-white shadow-xs pointer-events-none z-20"
                    style={{ left: `calc(${maxPercent}% - 8px)` }}
                  />
                </div>

                <div className="border-t border-[#e3e2e2] pt-3 flex items-center justify-between text-xs font-semibold text-[#1b1c1c]">
                  <span>৳{minVal.toLocaleString('en-BD')}</span>
                  <span>৳{maxVal.toLocaleString('en-BD')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="p-4 bg-white border-t border-[#e3e2e2] flex items-center gap-3">
          <button
            onClick={onClearAll}
            aria-label="Clear All Filters"
            className="flex-1 py-3 px-4 bg-white border border-[#e3e2e2] text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear All</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Apply Filters"
            className="flex-1 py-3 px-4 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition shadow-xs cursor-pointer"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
}
