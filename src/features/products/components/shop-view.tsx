'use client';

import { useState, useEffect } from 'react';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { ShopHeader } from './shop-header';
import { ShopSidebar } from './shop-sidebar';
import { ShopPagination } from './shop-pagination';
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

  const priceStr = `৳${(product.discount_price ?? product.price).toLocaleString()}`;
  const originalPriceStr = product.discount_price
    ? `৳${product.price.toLocaleString()}`
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

export function ShopView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 10000]);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesData, setCategoriesData] = useState<{ id: string; label: string }[]>([]);
  const [collectionsData, setCollectionsData] = useState<{ id: string; label: string }[]>([]);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Fetch dynamic product and filter data from MongoDB
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetchPublicProductsAction({
        search: searchQuery,
        categories: selectedCategories,
        collections: selectedCollections,
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
        onSearchChange={handleSearchChange}
        onSortChange={(sort) => {
          setSelectedSort(sort);
          setCurrentPage(1);
        }}
      />

      {/* Main Split Layout: Left Sidebar + Right Product Grid */}
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        {/* Left Sidebar Filters */}
        <ShopSidebar
          categories={categoriesData}
          collections={collectionsData}
          selectedCategories={selectedCategories}
          selectedCollections={selectedCollections}
          priceRange={priceRange}
          minPriceLimit={1000}
          maxPriceLimit={10000}
          onCategoryToggle={handleCategoryToggle}
          onCollectionToggle={handleCollectionToggle}
          onPriceChange={(newRange) => {
            setPriceRange(newRange);
            setCurrentPage(1);
          }}
        />

        {/* Right Product Grid Area */}
        <div className="flex-1 space-y-8">
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                Try adjusting your search query, category, collection, or price range filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setSelectedCollections([]);
                  setPriceRange([1000, 10000]);
                  setSelectedSort('featured');
                  setCurrentPage(1);
                }}
                aria-label="Clear all filters"
                className="mt-6 bg-black text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-none hover:bg-black/90 transition"
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
    </div>
  );
}
