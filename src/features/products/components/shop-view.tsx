'use client';

import { useState, useMemo } from 'react';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { ShopHeader } from './shop-header';
import { ShopSidebar } from './shop-sidebar';
import { ShopPagination } from './shop-pagination';
import { PackageX } from 'lucide-react';

const CATEGORIES_DATA = [
  { id: 'cotton', label: 'Cotton' },
  { id: 'silk-blend', label: 'Silk Blend' },
  { id: 'executive', label: 'Executive' },
];

const COLLECTIONS_DATA = [
  { id: 'heritage', label: 'Heritage' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'daily-elegance', label: 'Daily Elegance' },
];

const SHOP_PRODUCTS: (ProductCardData & {
  category: string;
  collection: string;
  rawPrice: number;
  dateAdded: string;
})[] = [
  {
    id: '1',
    name: 'Midnight Indigo',
    collectionTag: 'Heritage',
    description: 'Hand-woven fine cotton with traditional pattern borders.',
    category: 'cotton',
    collection: 'heritage',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
    price: '৳2,450',
    rawPrice: 2450,
    badge: 'New Arrival',
    subTag: null,
    dateAdded: '2026-07-20',
  },
  {
    id: '2',
    name: 'Charcoal Silk Weave',
    collectionTag: 'Luxury',
    description: 'Premium silk blend for executive comfort and occasion wear.',
    category: 'silk-blend',
    collection: 'luxury',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    price: '৳4,800',
    originalPrice: '৳5,500',
    rawPrice: 4800,
    badge: 'Premium',
    subTag: null,
    dateAdded: '2026-07-25',
  },
  {
    id: '3',
    name: 'Earth Tone Essential',
    collectionTag: 'Daily Elegance',
    description: 'Breathable everyday cotton comfort designed for easy lounge.',
    category: 'executive',
    collection: 'daily-elegance',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
    price: '৳1,850',
    rawPrice: 1850,
    badge: null,
    subTag: 'Limited Edition',
    dateAdded: '2026-07-15',
  },
  {
    id: '4',
    name: 'Heritage Check Lungi',
    collectionTag: 'Heritage',
    description: '100% fine cotton yarn with traditional Bengali check pattern.',
    category: 'cotton',
    collection: 'heritage',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
    price: '৳1,250',
    rawPrice: 1250,
    badge: null,
    subTag: null,
    dateAdded: '2026-07-18',
  },
  {
    id: '5',
    name: 'Royal Silk Blend',
    collectionTag: 'Luxury',
    description: 'Rich lustrous fabric with hand-embroidered border motifs.',
    category: 'silk-blend',
    collection: 'luxury',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    price: '৳5,200',
    originalPrice: '৳6,000',
    rawPrice: 5200,
    badge: 'Premium',
    subTag: null,
    dateAdded: '2026-07-28',
  },
  {
    id: '6',
    name: 'Executive Dark Stripe',
    collectionTag: 'Executive',
    description: 'Sophisticated deep charcoal lungi with modern minimalist weave.',
    category: 'executive',
    collection: 'daily-elegance',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    price: '৳2,950',
    rawPrice: 2950,
    badge: 'New Arrival',
    subTag: null,
    dateAdded: '2026-07-22',
  },
];

const ITEMS_PER_PAGE = 6;

export function ShopView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 10000]);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      // Live Search
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      ) {
        return false;
      }
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      // Collection filter
      if (
        selectedCollections.length > 0 &&
        !selectedCollections.includes(product.collection)
      ) {
        return false;
      }
      // Price filter
      if (
        product.rawPrice < priceRange[0] ||
        product.rawPrice > priceRange[1]
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-low') return a.rawPrice - b.rawPrice;
      if (selectedSort === 'price-high') return b.rawPrice - a.rawPrice;
      if (selectedSort === 'newest')
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      return 0; // default featured
    });
  }, [searchQuery, selectedCategories, selectedCollections, priceRange, selectedSort]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div>
      {/* Upper Heading Section & Search Bar */}
      <ShopHeader
        searchQuery={searchQuery}
        selectedSort={selectedSort}
        onSearchChange={handleSearchChange}
        onSortChange={setSelectedSort}
      />

      {/* Main Split Layout: Left Sidebar + Right Product Grid */}
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        {/* Left Sidebar Filters */}
        <ShopSidebar
          categories={CATEGORIES_DATA}
          collections={COLLECTIONS_DATA}
          selectedCategories={selectedCategories}
          selectedCollections={selectedCollections}
          priceRange={priceRange}
          minPriceLimit={1000}
          maxPriceLimit={10000}
          onCategoryToggle={handleCategoryToggle}
          onCollectionToggle={handleCollectionToggle}
          onPriceChange={setPriceRange}
        />

        {/* Right Product Grid Area */}
        <div className="flex-1 space-y-8">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
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
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
