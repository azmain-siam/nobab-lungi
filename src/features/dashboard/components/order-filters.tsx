'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (val: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  paymentMethodFilter,
  onPaymentMethodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortBy,
  onSortChange,
}: OrderFiltersProps) {
  return (
    <div className="bg-white border border-[#e3e2e2] p-4 space-y-3.5">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search by order # (NL-XXXXXX), customer name, or phone..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={<Search className="h-4 w-4 stroke-[1.5]" />}
      />

      {/* Filter Row 1 */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-[#5e5e5b] font-medium pr-1">
          <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
          <span>Filters:</span>
        </div>

        {/* Order Status */}
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[130px]"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>

        {/* Payment Status */}
        <Select
          value={paymentStatusFilter}
          onChange={(e) => onPaymentStatusChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[130px]"
        >
          <option value="all">All Payment Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </Select>

        {/* Payment Method */}
        <Select
          value={paymentMethodFilter}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[130px]"
        >
          <option value="all">All Payment Methods</option>
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="bkash">bKash</option>
          <option value="nagad">Nagad</option>
          <option value="card">Credit / Debit Card</option>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          containerClassName="w-full sm:w-auto flex-1 min-w-[130px]"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="amount_high">Total: High to Low</option>
          <option value="amount_low">Total: Low to High</option>
        </Select>
      </div>

      {/* Filter Row 2: Date Range */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#e3e2e2]">
        <span className="text-xs font-semibold text-[#1b1c1c] uppercase tracking-wider">
          Date Range:
        </span>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            containerClassName="w-36"
          />
          <span className="text-xs text-[#5e5e5b]">To</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            containerClassName="w-36"
          />
        </div>
      </div>
    </div>
  );
}
