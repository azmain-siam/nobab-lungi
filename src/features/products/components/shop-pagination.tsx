'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ShopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-16">
      {/* Previous Arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="p-1 text-[#5e5e5b] transition hover:text-black disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
      >
        <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={
              isActive
                ? 'flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white'
                : 'flex h-8 w-8 items-center justify-center text-xs font-medium text-[#5e5e5b] transition hover:text-black'
            }
          >
            {page}
          </button>
        );
      })}

      {/* Next Arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="p-1 text-[#5e5e5b] transition hover:text-black disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
      >
        <ChevronRight className="h-4 w-4 stroke-[1.5]" />
      </button>
    </div>
  );
}
