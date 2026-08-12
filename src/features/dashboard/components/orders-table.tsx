'use client';

import React from 'react';
import type { OrderWithItems } from '@/types';
import { ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface OrdersTableProps {
  orders: OrderWithItems[];
  isLoading: boolean;
  onOpenDetails: (order: OrderWithItems) => void;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
}

export function OrdersTable({
  orders,
  isLoading,
  onOpenDetails,
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#e3e2e2] p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-[#f5f3f3] w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#e3e2e2] p-12 text-center space-y-3">
        <ShoppingCart className="h-10 w-10 text-[#5e5e5b] mx-auto stroke-[1.5]" />
        <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Orders Found</h3>
        <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
          No customer checkout orders match your selected status filters or date range.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'processing':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'unpaid':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'refunded':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-white border border-[#e3e2e2] space-y-4 p-4 sm:p-6">
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider font-semibold">
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Delivery Tracking</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e2]">
            {orders.map((ord) => {
              const customerName = ord.shipping_address?.name || 'Customer';
              const customerPhone = ord.shipping_address?.phone || 'N/A';
              return (
                <tr key={ord.id} className="hover:bg-[#fbf9f8] transition">
                  <td className="p-3 font-mono font-bold text-[#1b1c1c] text-sm">
                    {ord.order_number}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#1b1c1c]">{customerName}</div>
                    <div className="text-[10px] text-[#5e5e5b]">{customerPhone}</div>
                  </td>
                  <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                    ৳{ord.total.toLocaleString('en-BD')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase border ${getPaymentStatusBadge(
                        ord.payment_status
                      )}`}
                    >
                      {ord.payment_status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold uppercase text-[#5e5e5b] bg-[#f5f3f3] px-2 py-0.5 border border-[#e3e2e2]">
                      {ord.payment_method}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#5e5e5b]">
                    {ord.tracking_number ? (
                      <div>
                        <div className="font-semibold text-[#1b1c1c]">{ord.courier || 'Courier'}</div>
                        <div className="font-mono text-[10px]">{ord.tracking_number}</div>
                      </div>
                    ) : (
                      <span className="text-[#5e5e5b]/70 italic">Not Dispatched</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#5e5e5b]">
                    {new Date(ord.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenDetails(ord)}
                      className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-[#1b1c1c] text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-white transition inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View (< 768px) */}
      <div className="md:hidden space-y-3">
        {orders.map((ord) => {
          const customerName = ord.shipping_address?.name || 'Customer';
          const customerPhone = ord.shipping_address?.phone || 'N/A';
          return (
            <div
              key={ord.id}
              className="border border-[#e3e2e2] bg-[#fbf9f8] p-4 space-y-3 hover:border-[#1b1c1c] transition"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#e3e2e2] pb-2.5">
                <div>
                  <span className="font-mono font-bold text-sm text-[#1b1c1c]">
                    {ord.order_number}
                  </span>
                  <div className="text-[10px] text-[#5e5e5b] pt-0.5">
                    Placed {new Date(ord.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    {ord.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-semibold uppercase border ${getPaymentStatusBadge(
                      ord.payment_status
                    )}`}
                  >
                    {ord.payment_status}
                  </span>
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#5e5e5b] block">Customer</span>
                  <div className="font-semibold text-[#1b1c1c] truncate">{customerName}</div>
                  <div className="text-[10px] text-[#5e5e5b]">{customerPhone}</div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase text-[#5e5e5b] block">Order Total</span>
                  <div className="font-display font-semibold text-sm text-[#1b1c1c]">
                    ৳{ord.total.toLocaleString('en-BD')}
                  </div>
                  <div className="text-[10px] text-[#5e5e5b] uppercase font-medium">
                    {ord.payment_method}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-[#e3e2e2]">
                <button
                  onClick={() => onOpenDetails(ord)}
                  className="w-full py-2 text-xs font-semibold uppercase tracking-wider border border-[#1b1c1c] text-[#1b1c1c] hover:bg-[#1b1c1c] hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Eye className="h-3.5 w-3.5" /> View Order & Fulfill
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
        <div>
          Showing {orders.length} of {totalOrders} orders
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
