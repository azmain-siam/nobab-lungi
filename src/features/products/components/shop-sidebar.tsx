'use client';

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

      {/* Price Range Section */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">
          Price Range
        </h3>
        <div className="pt-2">
          <input
            type="range"
            min={minPriceLimit}
            max={maxPriceLimit}
            step={250}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([priceRange[0], parseInt(e.target.value, 10)])
            }
            className="w-full accent-black cursor-pointer bg-[#e3e2e2] h-1"
          />
          <div className="mt-3 border-t border-[#e3e2e2] pt-3 flex items-center justify-between text-xs font-semibold text-[#1b1c1c]">
            <span>৳{priceRange[0].toLocaleString()}</span>
            <span>৳{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
