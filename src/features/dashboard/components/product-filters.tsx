'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Category, Collection } from '@/types';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: number;
  onCategoryChange: (value: number) => void;
  selectedCollection: number;
  onCollectionChange: (value: number) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  flagFilter: string;
  onFlagChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  categories: Category[];
  collections: Collection[];
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCollection,
  onCollectionChange,
  statusFilter,
  onStatusChange,
  stockFilter,
  onStockChange,
  flagFilter,
  onFlagChange,
  sortBy,
  onSortChange,
  categories,
  collections,
}: ProductFiltersProps) {
  return (
    <div className="bg-white border border-[#e3e2e2] p-4 space-y-3.5">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search by product name, SKU, or slug..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={<Search className="h-4 w-4 stroke-[1.5]" />}
      />

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-[#5e5e5b] font-medium pr-1">
          <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>Filters:</span>
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(Number(e.target.value))}
          containerClassName="w-full sm:w-auto flex-1 min-w-[140px]"
        >
          <option value={0}>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        {/* Collection Filter */}
        <Select
          value={selectedCollection}
          onChange={(e) => onCollectionChange(Number(e.target.value))}
          containerClassName="w-full sm:w-auto flex-1 min-w-[140px]"
        >
          <option value={0}>All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </Select>

        {/* Stock Filter */}
        <Select
          value={stockFilter}
          onChange={(e) => onStockChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[120px]"
        >
          <option value="all">All Stock</option>
          <option value="in_stock">In Stock (&gt; 5)</option>
          <option value="low_stock">Low Stock (1-5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>

        {/* Flags Filter */}
        <Select
          value={flagFilter}
          onChange={(e) => onFlagChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[120px]"
        >
          <option value="all">All Flags</option>
          <option value="featured">Featured</option>
          <option value="best_seller">Best Seller</option>
          <option value="new_arrival">New Arrival</option>
        </Select>

        {/* Sort Filter */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[130px]"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock_asc">Stock: Low to High</option>
          <option value="name_asc">Name: A-Z</option>
        </Select>
      </div>
    </div>
  );
}
