'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import {
  fetchAdminCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from '@/features/dashboard/actions/coupon-actions';
import type { Coupon } from '@/types';
import {
  Ticket,
  Plus,
  Trash2,
  Edit,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Tag,
  Percent,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filter & Search Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Form Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form Fields State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number | ''>(10);
  const [minimumAmount, setMinimumAmount] = useState<number | ''>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [onePerCustomer, setOnePerCustomer] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchCoupons = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch Coupons Effect
  useEffect(() => {
    let isMounted = true;

    fetchAdminCouponsAction({
      search: searchQuery,
      filter: filterBy,
      sort: sortBy,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setCoupons(res.coupons);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching admin coupons:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, filterBy, sortBy, currentPage, refreshKey]);

  // Open Create Drawer
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setType('percentage');
    setValue(10);
    setMinimumAmount(0);
    setMaxDiscountAmount('');
    setUsageLimit('');
    setOnePerCustomer(false);
    setStartDate('');
    setEndDate('');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setType(coupon.type);
    setValue(coupon.value);
    setMinimumAmount(coupon.minimum_amount);
    setMaxDiscountAmount(coupon.max_discount_amount || '');
    setUsageLimit(coupon.usage_limit || '');
    setOnePerCustomer(coupon.one_per_customer || false);
    setStartDate(coupon.start_date ? coupon.start_date.split('T')[0] : '');
    setEndDate(coupon.end_date ? coupon.end_date.split('T')[0] : '');
    setIsActive(coupon.is_active);
    setIsDrawerOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Coupon code is required.');
      return;
    }

    if (!value || Number(value) <= 0) {
      toast.error('Discount value must be greater than 0.');
      return;
    }

    if (type === 'percentage' && Number(value) > 100) {
      toast.error('Percentage discount cannot exceed 100%.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      code: code.trim().toUpperCase(),
      description: description.trim() || null,
      type,
      value: Number(value),
      minimum_amount: minimumAmount ? Number(minimumAmount) : 0,
      max_discount_amount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usage_limit: usageLimit ? Number(usageLimit) : null,
      one_per_customer: onePerCustomer,
      start_date: startDate || null,
      end_date: endDate || null,
      is_active: isActive,
    };

    try {
      if (editingCoupon) {
        const res = await updateCouponAction(editingCoupon.id, payload);
        if (res.success) {
          toast.success(`Coupon "${payload.code}" updated successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => refetchCoupons());
        } else {
          toast.error(res.error || 'Failed to update coupon.');
        }
      } else {
        const res = await createCouponAction(payload);
        if (res.success) {
          toast.success(`Coupon "${payload.code}" created successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => refetchCoupons());
        } else {
          toast.error(res.error || 'Failed to create coupon.');
        }
      }
    } catch {
      toast.error('An error occurred while saving coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteCouponAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Coupon "${deleteTarget.code}" deleted.`);
        setDeleteTarget(null);
        startTransition(() => refetchCoupons());
      } else {
        toast.error(res.error || 'Failed to delete coupon.');
      }
    } catch {
      toast.error('An error occurred during coupon deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
            <Ticket className="h-6 w-6 stroke-[1.5] text-amber-800" />
            Coupon & Promotion Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Create promotional codes, configure percentage/fixed discounts, set usage limits, and manage expiry schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchCoupons()}
            disabled={isLoading || isPending}
            className="p-2.5"
            title="Refresh Coupon List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Filters & Search Controls Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by coupon code (e.g. HERITAGE15) or description..."
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#5e5e5b]">
              <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">Filter:</span>
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active Coupons</option>
              <option value="inactive">Inactive Coupons</option>
              <option value="expired">Expired Coupons</option>
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount Discount (৳)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="expiry_date">Expiry Date</option>
              <option value="usage_count">Usage Count</option>
              <option value="code">Coupon Code (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Coupon Code</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Discount Rule</th>
                  <th className="p-4 font-semibold">Usage Count</th>
                  <th className="p-4 font-semibold">Validity Period</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {coupons.map((c) => {
                  const isExpired = c.end_date ? new Date(c.end_date) < new Date() : false;

                  return (
                    <tr key={c.id} className="hover:bg-[#fbf9f8] transition">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#1b1c1c] bg-[#f5f3f3] border border-[#e3e2e2] px-2.5 py-1 tracking-wider">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-[#1b1c1c] font-medium">{c.description || 'No description'}</div>
                        {c.minimum_amount > 0 && (
                          <div className="text-[10px] text-[#5e5e5b]">
                            Min Order: ৳{c.minimum_amount.toLocaleString('en-BD')}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-display font-semibold text-[#1b1c1c]">
                          {c.type === 'percentage' ? `${c.value}% OFF` : `৳${c.value.toLocaleString('en-BD')} OFF`}
                        </div>
                        {c.type === 'percentage' && c.max_discount_amount && (
                          <div className="text-[10px] text-emerald-700">
                            Max Cap: ৳{c.max_discount_amount.toLocaleString('en-BD')}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[#1b1c1c]">
                        {c.used_count} / {c.usage_limit ? c.usage_limit : '∞'}
                        {c.one_per_customer && (
                          <span className="block text-[9px] text-[#5e5e5b]">1 per customer</span>
                        )}
                      </td>
                      <td className="p-4 text-[11px] text-[#5e5e5b]">
                        {c.start_date || c.end_date ? (
                          <div>
                            <div>From: {c.start_date ? new Date(c.start_date).toLocaleDateString('en-GB') : 'Immediate'}</div>
                            <div>Until: {c.end_date ? new Date(c.end_date).toLocaleDateString('en-GB') : 'No Expiry'}</div>
                          </div>
                        ) : (
                          <span className="text-[#5e5e5b]">Always Valid</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isExpired ? (
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 uppercase">
                            Expired
                          </span>
                        ) : c.is_active ? (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-red-800 bg-red-50 border border-red-300 px-2 py-0.5 uppercase">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                            title="Edit Coupon"
                          >
                            <Edit className="h-4 w-4 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c)}
                            className="p-1.5 text-red-600 hover:text-red-800 transition"
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-4 w-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Ticket className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Coupons Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              Click &quot;Create Coupon&quot; to configure promotional discount codes for your customers.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {coupons.length} of {total} coupons
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-semibold text-[#1b1c1c]">
                Page {currentPage} of {pages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                disabled={currentPage === pages || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Form Slide-Over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingCoupon ? 'Edit Promotional Coupon' : 'Create Promotional Coupon'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">
                  {editingCoupon ? `Updating Coupon Code #${editingCoupon.code}` : 'Configure a new promotional discount for storefront checkout.'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <Tag className="h-4 w-4 text-[#5e5e5b]" /> 1. Basic Information
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HERITAGE2026"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs font-mono font-bold text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none uppercase"
                  />
                  <span className="text-[10px] text-[#5e5e5b]">Auto-converts to UPPERCASE.</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Eid Special 15% discount for premium handloom lungis"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 2: Discount Configuration */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <Percent className="h-4 w-4 text-[#5e5e5b]" /> 2. Discount Configuration
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Discount Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">
                      {type === 'percentage' ? 'Percentage Rate (%) *' : 'Discount Amount (৳) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={type === 'percentage' ? 100 : 50000}
                      value={value}
                      onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Minimum Order Amount (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={minimumAmount}
                      onChange={(e) => setMinimumAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 1500"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  {type === 'percentage' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Max Discount Cap (৳)</label>
                      <input
                        type="number"
                        min={0}
                        value={maxDiscountAmount}
                        onChange={(e) => setMaxDiscountAmount(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 500"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Usage Rules */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <DollarSign className="h-4 w-4 text-[#5e5e5b]" /> 3. Usage Rules
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Maximum Total Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Leave empty for unlimited usage"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#e3e2e2] pt-3">
                  <div>
                    <div className="text-xs font-semibold text-[#1b1c1c]">One Use Per Customer</div>
                    <div className="text-[10px] text-[#5e5e5b]">Limit coupon redemption to once per account.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOnePerCustomer(!onePerCustomer)}
                    className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                      onePerCustomer
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                    }`}
                  >
                    {onePerCustomer ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>

              {/* Section 4: Schedule Validity */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <Clock className="h-4 w-4 text-[#5e5e5b]" /> 4. Validity Schedule
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Expiry Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Status */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <AlertCircle className="h-4 w-4 text-[#5e5e5b]" /> 5. Status
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1b1c1c]">Coupon Activation Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e3e2e2]">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Saving Coupon...'
                    : editingCoupon
                    ? 'Update Coupon'
                    : 'Create Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon?"
        description={
          deleteTarget
            ? `Are you sure you want to delete coupon code "${deleteTarget.code}"? Customers will no longer be able to redeem this coupon.`
            : ''
        }
        confirmText="Delete Coupon"
        isLoading={isDeleting}
      />
    </>
  );
}
