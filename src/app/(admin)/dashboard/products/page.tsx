'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { Plus, Search, Filter, Trash2, Edit, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface MockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'out_of_stock';
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Royal Heritage Silk Lungi — Emerald Edition',
    sku: 'LUN-SLK-001',
    category: 'Premium Cotton Lungi',
    price: 2500,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60',
    status: 'active',
  },
  {
    id: 'prod-2',
    name: 'Classic Handloom Check Lungi — Indigo',
    sku: 'LUN-CHK-002',
    category: 'Check Lungi',
    price: 1200,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
    status: 'active',
  },
  {
    id: 'prod-3',
    name: 'Traditional Jacquard Heritage Lungi — Royal Blue',
    sku: 'LUN-JAC-003',
    category: 'Handloom Lungi',
    price: 4500,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60',
    status: 'active',
  },
  {
    id: 'prod-4',
    name: 'Traditional Cotton Daily Lungi — White & Blue',
    sku: 'LUN-COT-004',
    category: 'Export Quality Lungi',
    price: 850,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
    status: 'out_of_stock',
  },
  {
    id: 'prod-5',
    name: 'Artisan Printed Festival Saree — Crimson Red',
    sku: 'SAR-PRN-005',
    category: 'Printed Saree',
    price: 3200,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60',
    status: 'active',
  },
];

export default function AdminProductsPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter products based on search & dropdown filters
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && product.stock > 0) ||
      (stockFilter === 'out_of_stock' && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDeleteConfirm = () => {
    toast.success(`Product ${deleteTargetId} deleted.`);
    setDeleteTargetId(null);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Products Catalog
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Manage inventory, pricing, and product detail listing across all collections.
          </p>
        </div>

        <Button type="button" variant="primary" size="md" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5e5e5b]">
            <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="lungi">Lungis</option>
            <option value="saree">Sarees</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white border border-[#e3e2e2] space-y-4">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">Item</th>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4">
                      <div className="relative h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#1b1c1c] max-w-xs truncate">
                      {product.name}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#5e5e5b]">
                      {product.sku}
                    </td>
                    <td className="p-4 text-[#5e5e5b]">{product.category}</td>
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                      ৳{product.price.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          {product.stock} Units
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(product.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Package className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Products Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No products match your current search query or filter criteria. Try clearing filters.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
          <span>Showing 1 to {filteredProducts.length} of {MOCK_PRODUCTS.length} entries</span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-semibold text-[#1b1c1c]">Page 1 of 1</span>
            <button
              disabled
              className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        description="Are you sure you want to remove this product from the store catalog? This action cannot be undone."
        confirmText="Delete Product"
      />
    </>
  );
}
