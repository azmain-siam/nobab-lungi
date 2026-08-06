'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { ShopHeader, type ActiveChip } from './shop-header';
import { ShopSidebar } from './shop-sidebar';
import { ShopPagination } from './shop-pagination';
import { MobileFilterDrawer } from './mobile-filter-drawer';
import { MobileSortModal } from './mobile-sort-modal';
import { PackageX } from 'lucide-react';
import { fetchPublicProductsAction } from '@/features/products/actions/shop-actions';
import type { ProductWithImages } from '@/types';

const ITEMS_PER_PAGE = 6;

function mapProductToCardData(product: ProductWithImages): ProductCardData {
  const coverImage =
    product.product_images?.find((img) => img.is_cover)?.url ||
    product.product_images?.[0]?.url ||
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop';

  let badge: string | null = null;
  if (product.is_new_arrival) badge = 'New Arrival';
  else if (product.is_best_seller) badge = 'Best Seller';
  else if (product.is_featured) badge = 'Featured';

  const priceStr = `৳${(product.discount_price ?? product.price).toLocaleString('en-BD')}`;
  const originalPriceStr = product.discount_price
    ? `৳${product.price.toLocaleString('en-BD')}`
    : undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collectionTag: product.fabric || 'Heritage',
    description: product.short_description || product.description || undefined,
    image: coverImage,
    price: priceStr,
    originalPrice: originalPriceStr,
    badge,
  };
}

const DEFAULT_SHOP_CATEGORIES = [
  { id: 'lungi-premium-cotton', label: 'Premium Cotton' },
  { id: 'lungi-export-quality', label: 'Export Quality' },
  { id: 'lungi-check', label: 'Check Pattern' },
  { id: 'lungi-printed', label: 'Printed Lungi' },
  { id: 'lungi-handloom', label: 'Handloom Series' },
];

const DEFAULT_FABRICS = ['100% Combed Cotton', 'Fine Organic Linen', 'Mercerized Cotton', 'Traditional Handloom'];
const DEFAULT_PATTERNS = ['Classic Check', 'Elegance Stripe', 'Solid Tone', 'Printed Motif', 'Border Weave'];
const DEFAULT_COLORS = ['Navy Blue', 'Deep Maroon', 'Forest Green', 'Charcoal Black', 'Off White'];

export function ShopView() {
  const searchParams = useSearchParams();
  const initialCollectionParam = searchParams?.get('collection') || searchParams?.get('collections');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(() =>
    initialCollectionParam ? [initialCollectionParam] : []
  );
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile Drawer & Modal States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoriesData, setCategoriesData] = useState<{ id: string; label: string }[]>(DEFAULT_SHOP_CATEGORIES);
  const [collectionsData, setCollectionsData] = useState<{ id: string; label: string }[]>([]);
  const [fabricsData, setFabricsData] = useState<string[]>(DEFAULT_FABRICS);
  const [patternsData, setPatternsData] = useState<string[]>(DEFAULT_PATTERNS);
  const [colorsData, setColorsData] = useState<string[]>(DEFAULT_COLORS);
  const [loading, setLoading] = useState(true);

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  const handleCollectionToggle = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  const handleFabricToggle = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
    setCurrentPage(1);
  };

  const handlePatternToggle = (pattern: string) => {
    setSelectedPatterns((prev) =>
      prev.includes(pattern) ? prev.filter((p) => p !== pattern) : [...prev, pattern]
    );
    setCurrentPage(1);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleInStockToggle = (inStock: boolean) => {
    setInStockOnly(inStock);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedCollections([]);
    setSelectedFabrics([]);
    setSelectedPatterns([]);
    setSelectedColors([]);
    setInStockOnly(false);
    setPriceRange([100, 10000]);
    setSelectedSort('featured');
    setCurrentPage(1);
  };

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += selectedCategories.length;
    count += selectedCollections.length;
    count += selectedFabrics.length;
    count += selectedPatterns.length;
    count += selectedColors.length;
    if (inStockOnly) count += 1;
    if (priceRange[0] !== 100 || priceRange[1] !== 10000) count += 1;
    return count;
  }, [
    selectedCategories,
    selectedCollections,
    selectedFabrics,
    selectedPatterns,
    selectedColors,
    inStockOnly,
    priceRange,
  ]);

  // Compute active filter removable chips
  const activeChips = useMemo(() => {
    const chips: ActiveChip[] = [];

    selectedCategories.forEach((catId) => {
      const label = categoriesData.find((c) => c.id === catId)?.label || catId;
      chips.push({
        id: `cat-${catId}`,
        label,
        onRemove: () => handleCategoryToggle(catId),
      });
    });

    selectedCollections.forEach((colId) => {
      const label = collectionsData.find((c) => c.id === colId)?.label || colId;
      chips.push({
        id: `col-${colId}`,
        label,
        onRemove: () => handleCollectionToggle(colId),
      });
    });

    selectedFabrics.forEach((fabric) => {
      chips.push({
        id: `fab-${fabric}`,
        label: fabric,
        onRemove: () => handleFabricToggle(fabric),
      });
    });

    selectedPatterns.forEach((pattern) => {
      chips.push({
        id: `pat-${pattern}`,
        label: pattern,
        onRemove: () => handlePatternToggle(pattern),
      });
    });

    selectedColors.forEach((color) => {
      chips.push({
        id: `clr-${color}`,
        label: color,
        onRemove: () => handleColorToggle(color),
      });
    });

    if (inStockOnly) {
      chips.push({
        id: 'in-stock',
        label: 'In Stock Only',
        onRemove: () => handleInStockToggle(false),
      });
    }

    if (priceRange[0] !== 100 || priceRange[1] !== 10000) {
      chips.push({
        id: 'price-range',
        label: `৳${priceRange[0].toLocaleString()} - ৳${priceRange[1].toLocaleString()}`,
        onRemove: () => setPriceRange([100, 10000]),
      });
    }

    return chips;
  }, [
    selectedCategories,
    selectedCollections,
    selectedFabrics,
    selectedPatterns,
    selectedColors,
    inStockOnly,
    priceRange,
    categoriesData,
    collectionsData,
  ]);

  // Fetch dynamic product and filter data from MongoDB
  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      fetchPublicProductsAction({
        search: searchQuery,
        categories: selectedCategories,
        collections: selectedCollections,
        fabrics: selectedFabrics,
        patterns: selectedPatterns,
        colors: selectedColors,
        inStockOnly,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: selectedSort,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      })
        .then((res) => {
          if (!isMounted) return;
          const cardProducts = res.products.map(mapProductToCardData);
          setProducts(cardProducts);
          setTotalPages(res.pages || 1);
          setTotalCount(res.total || cardProducts.length);

          if (res.categories && res.categories.length > 0) {
            setCategoriesData(
              res.categories.map((c) => ({
                id: c.slug || c.id,
                label: c.name,
              }))
            );
          }
          if (res.collections && res.collections.length > 0) {
            setCollectionsData(
              res.collections.map((col) => ({
                id: col.slug || col.id,
                label: col.name,
              }))
            );
          }
          if (res.fabrics && res.fabrics.length > 0) {
            setFabricsData(res.fabrics);
          }
          if (res.patterns && res.patterns.length > 0) {
            setPatternsData(res.patterns);
          }
          if (res.colors && res.colors.length > 0) {
            setColorsData(res.colors);
          }
        })
        .catch((err) => {
          console.error('Error fetching dynamic products:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    selectedCategories,
    selectedCollections,
    selectedFabrics,
    selectedPatterns,
    selectedColors,
    inStockOnly,
    priceRange,
    selectedSort,
    currentPage,
  ]);

  return (
    <div>
      {/* Upper Heading Section & Search Bar */}
      <ShopHeader
        searchQuery={searchQuery}
        selectedSort={selectedSort}
        activeFilterCount={activeFilterCount}
        activeChips={activeChips}
        totalProducts={totalCount}
        onSearchChange={handleSearchChange}
        onSortChange={(sort) => {
          setSelectedSort(sort);
          setCurrentPage(1);
        }}
        onOpenFilter={() => setIsMobileFilterOpen(true)}
        onOpenSort={() => setIsMobileSortOpen(true)}
      />

      {/* Main Split Layout: Left Sidebar (Desktop Only) + Right Product Grid */}
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        {/* Desktop-Only Left Sidebar Filters (Hidden on Mobile) */}
        <div className="hidden lg:block w-64 shrink-0">
          <ShopSidebar
            categories={categoriesData}
            collections={collectionsData}
            fabrics={fabricsData}
            patterns={patternsData}
            colors={colorsData}
            selectedCategories={selectedCategories}
            selectedCollections={selectedCollections}
            selectedFabrics={selectedFabrics}
            selectedPatterns={selectedPatterns}
            selectedColors={selectedColors}
            inStockOnly={inStockOnly}
            priceRange={priceRange}
            minPriceLimit={100}
            maxPriceLimit={10000}
            onCategoryToggle={handleCategoryToggle}
            onCollectionToggle={handleCollectionToggle}
            onFabricToggle={handleFabricToggle}
            onPatternToggle={handlePatternToggle}
            onColorToggle={handleColorToggle}
            onInStockToggle={handleInStockToggle}
            onPriceChange={(newRange) => {
              setPriceRange(newRange);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Product Grid Area (2 Columns on Mobile, 3 Columns on Desktop) */}
        <div className="flex-1 space-y-8">
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[3/4] w-full bg-[#efeded]" />
                  <div className="h-3 w-1/3 bg-[#efeded]" />
                  <div className="h-4 w-2/3 bg-[#efeded]" />
                  <div className="h-3 w-full bg-[#efeded]" />
                  <div className="h-4 w-1/4 bg-[#efeded]" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-[#e3e2e2] bg-[#f5f3f3]/40">
              <PackageX className="h-10 w-10 text-[#5e5e5b] stroke-[1.2]" />
              <h3 className="mt-4 font-display text-base font-semibold text-[#1b1c1c]">
                No matching products found
              </h3>
              <p className="mt-1 text-xs text-[#5e5e5b] max-w-xs">
                Try adjusting your search query, fabric, pattern, color, or price range filter.
              </p>
              <button
                onClick={handleClearAll}
                aria-label="Clear all filters"
                className="mt-6 bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-black/90 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categoriesData}
        collections={collectionsData}
        fabrics={fabricsData}
        patterns={patternsData}
        colors={colorsData}
        selectedCategories={selectedCategories}
        selectedCollections={selectedCollections}
        selectedFabrics={selectedFabrics}
        selectedPatterns={selectedPatterns}
        selectedColors={selectedColors}
        inStockOnly={inStockOnly}
        priceRange={priceRange}
        minPriceLimit={100}
        maxPriceLimit={10000}
        onCategoryToggle={handleCategoryToggle}
        onCollectionToggle={handleCollectionToggle}
        onFabricToggle={handleFabricToggle}
        onPatternToggle={handlePatternToggle}
        onColorToggle={handleColorToggle}
        onInStockToggle={handleInStockToggle}
        onPriceChange={(newRange) => {
          setPriceRange(newRange);
          setCurrentPage(1);
        }}
        onClearAll={handleClearAll}
        activeFilterCount={activeFilterCount}
      />

      {/* Mobile Sort Modal */}
      <MobileSortModal
        isOpen={isMobileSortOpen}
        onClose={() => setIsMobileSortOpen(false)}
        selectedSort={selectedSort}
        onSortChange={(sort) => {
          setSelectedSort(sort);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
