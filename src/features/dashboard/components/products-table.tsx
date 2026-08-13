'use client';

import React from 'react';
import Image from 'next/image';
import type { AdminProductListItem } from '@/services/product-service';
import { Package, Edit, Trash2, Sparkles, Star, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsTableProps {
  products: AdminProductListItem[];
  isLoading: boolean;
  onEdit: (product: AdminProductListItem) => void;
  onDeleteClick: (product: AdminProductListItem) => void;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDeleteClick,
  currentPage,
  totalPages,
  totalProducts,
  onPageChange,
}: ProductsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#e3e2e2] p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-[#f5f3f3] w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#e3e2e2] p-12 text-center space-y-3">
        <Package className="h-10 w-10 text-[#5e5e5b] mx-auto stroke-[1.5]" />
        <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Products Found</h3>
        <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
          No items match your active search terms or filters. Try resetting filters or adding a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e2e2] space-y-4 p-4 sm:p-6">
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider font-semibold">
              <th className="p-3">Cover</th>
              <th className="p-3">Product & SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price (BDT)</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Flags</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e2]">
            {products.map((p) => {
              const coverImage = (p.product_images?.find((img) => img.is_cover) || p.product_images?.[0])?.url;
              return (
                <tr key={p.id} className="hover:bg-[#fbf9f8] transition">
                  <td className="p-3">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={p.name}
                        width={44}
                        height={44}
                        className="object-cover h-11 w-11 border border-[#e3e2e2] bg-[#fbf9f8]"
                      />
                    ) : (
                      <div className="h-11 w-11 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center text-[#5e5e5b]">
                        <Package className="h-5 w-5 stroke-[1.5]" />
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#1b1c1c] text-sm">{p.name}</div>
                    <div className="text-[10px] font-mono text-[#5e5e5b]">NL - {p.sku}</div>
                  </td>
                  <td className="p-3 text-[#5e5e5b] font-medium">{p.category_name || 'Uncategorized'}</td>
                  <td className="p-3">
                    <div className="font-display font-semibold text-[#1b1c1c]">
                      ৳{p.price.toLocaleString('en-BD')}
                    </div>
                    {p.discount_price && (
                      <div className="text-[10px] text-[#5e5e5b] line-through">
                        ৳{p.discount_price.toLocaleString('en-BD')}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        p.stock <= 0
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : p.stock <= 5
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase border ${
                        p.status === 'published'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {p.is_featured && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-600" /> Featured
                        </span>
                      )}
                      {p.is_best_seller && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <Flame className="h-2.5 w-2.5 text-rose-600" /> Best Seller
                        </span>
                      )}
                      {p.is_new_arrival && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-300 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-teal-600" /> New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 border border-[#e3e2e2] text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-white transition"
                        title="Edit Product"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(p)}
                        className="p-1.5 border border-[#e3e2e2] text-rose-700 hover:bg-rose-700 hover:text-white transition"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< 768px) */}
      <div className="md:hidden space-y-3">
        {products.map((p) => {
          const coverImage = (p.product_images?.find((img) => img.is_cover) || p.product_images?.[0])?.url;
          return (
            <div
              key={p.id}
              className="border border-[#e3e2e2] bg-[#fbf9f8] p-3.5 space-y-3 hover:border-[#1b1c1c] transition"
            >
              <div className="flex items-start gap-3">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={p.name}
                    width={56}
                    height={56}
                    className="object-cover h-14 w-14 border border-[#e3e2e2] bg-white shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center text-[#5e5e5b] shrink-0">
                    <Package className="h-6 w-6 stroke-[1.5]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-[#1b1c1c] truncate">{p.name}</h4>
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase border shrink-0 ${
                        p.status === 'published'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#5e5e5b]">SKU: NL - {p.sku}</div>
                  <div className="text-xs text-[#5e5e5b] mt-0.5">
                    Category: <span className="font-medium text-[#1b1c1c]">{p.category_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e3e2e2] text-xs">
                <div>
                  <span className="font-display font-semibold text-[#1b1c1c]">
                    ৳{p.price.toLocaleString('en-BD')}
                  </span>
                  {p.discount_price && (
                    <span className="text-[10px] text-[#5e5e5b] line-through ml-1.5">
                      ৳{p.discount_price.toLocaleString('en-BD')}
                    </span>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                    p.stock <= 0
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : p.stock <= 5
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {p.stock} In Stock
                </span>
              </div>

              {/* Mobile Actions & Flags */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {p.is_featured && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300">
                      Featured
                    </span>
                  )}
                  {p.is_best_seller && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-300">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-[#1b1c1c] text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-white transition flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDeleteClick(p)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-rose-300 text-rose-700 hover:bg-rose-700 hover:text-white transition flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
        <div>
          Showing {products.length} of {totalProducts} products
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 hover:bg-[#fbf9f8] transition"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-[#1b1c1c]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 hover:bg-[#fbf9f8] transition"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
