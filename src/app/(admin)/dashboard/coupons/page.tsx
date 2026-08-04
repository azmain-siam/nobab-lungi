'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import {
  getAdminCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
  toggleCouponStatusAction,
} from '@/actions/coupon';
import type { Coupon } from '@/types';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Ticket,
  X,
  Check,
  Percent,
  Banknote,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form States
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formValue, setFormValue] = useState<number | ''>(10);
  const [formMinAmount, setFormMinAmount] = useState<number | ''>(500);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number | ''>('');
  const [formUsageLimit, setFormUsageLimit] = useState<number | ''>('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Fetch Coupons from MongoDB
  const loadCoupons = useCallback(async () => {
    try {
      const data = await getAdminCouponsAction({
        search: searchQuery,
        status: statusFilter,
      });
      setCoupons(data);
    } catch (err) {
      console.error('Error fetching admin coupons:', err);
      toast.error('Failed to load coupons.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, toast]);

  useEffect(() => {
    let isMounted = true;
    getAdminCouponsAction({ search: searchQuery, status: statusFilter })
      .then((data) => {
        if (isMounted) {
          setCoupons(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching admin coupons:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormCode('');
    setFormType('percentage');
    setFormValue(10);
    setFormMinAmount(500);
    setFormMaxDiscount('');
    setFormUsageLimit('');
    setFormStartDate('');
    setFormEndDate('');
    setFormIsActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormType(coupon.type);
    setFormValue(coupon.value);
    setFormMinAmount(coupon.minimum_amount);
    setFormMaxDiscount(coupon.max_discount_amount ?? '');
    setFormUsageLimit(coupon.usage_limit ?? '');
    setFormStartDate(coupon.start_date ? coupon.start_date.split('T')[0] : '');
    setFormEndDate(coupon.end_date ? coupon.end_date.split('T')[0] : '');
    setFormIsActive(coupon.is_active);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Save Coupon (Create or Update)
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formCode.trim()) {
      setModalError('Coupon code is required.');
      return;
    }

    if (formValue === '' || Number(formValue) <= 0) {
      setModalError('Please enter a valid discount value greater than 0.');
      return;
    }

    if (formType === 'percentage' && Number(formValue) > 100) {
      setModalError('Percentage discount cannot exceed 100%.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        code: formCode.trim().toUpperCase(),
        type: formType,
        value: Number(formValue),
        minimum_amount: formMinAmount !== '' ? Number(formMinAmount) : 0,
        max_discount_amount: formMaxDiscount !== '' ? Number(formMaxDiscount) : null,
        usage_limit: formUsageLimit !== '' ? Number(formUsageLimit) : null,
        start_date: formStartDate ? new Date(formStartDate).toISOString() : null,
        end_date: formEndDate ? new Date(formEndDate).toISOString() : null,
        is_active: formIsActive,
      };

      if (editingCoupon) {
        const res = await updateCouponAction(editingCoupon.id, payload);
        if (!res.success) {
          setModalError(res.error || 'Failed to update coupon.');
          setIsSubmitting(false);
          return;
        }
        toast.success(`Coupon "${payload.code}" updated successfully.`);
      } else {
        const res = await createCouponAction(payload);
        if (!res.success) {
          setModalError(res.error || 'Failed to create coupon.');
          setIsSubmitting(false);
          return;
        }
        toast.success(`Coupon "${payload.code}" created successfully.`);
      }

      setIsModalOpen(false);
      loadCoupons();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setModalError('An unexpected error occurred while saving coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      const res = await toggleCouponStatusAction(coupon.id);
      if (res.success) {
        toast.success(`Coupon "${coupon.code}" is now ${res.is_active ? 'Active' : 'Inactive'}.`);
        loadCoupons();
      } else {
        toast.error(res.error || 'Failed to toggle status.');
      }
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      toast.error('Failed to update status.');
    }
  };

  // Delete Coupon
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await deleteCouponAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Coupon "${deleteTarget.code}" deleted successfully.`);
        loadCoupons();
      } else {
        toast.error(res.error || 'Failed to delete coupon.');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      toast.error('Failed to delete coupon.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Discount Coupons
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Manage promotional campaign vouchers, minimum purchase rules, and discount limits.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          className="gap-2 self-start sm:self-auto cursor-pointer"
          onClick={handleOpenCreateModal}
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by code..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#f5f3f3] p-1 border border-[#e3e2e2] w-full sm:w-auto">
          {(['all', 'active', 'expired', 'inactive'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === st
                  ? 'bg-[#1b1c1c] text-white'
                  : 'text-[#5e5e5b] hover:text-[#1b1c1c]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#5e5e5b] animate-pulse">
            Loading coupons from database...
          </div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Code</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Discount</th>
                  <th className="p-4 font-semibold">Min Order</th>
                  <th className="p-4 font-semibold">Usage</th>
                  <th className="p-4 font-semibold">Validity</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {coupons.map((coupon) => {
                  const now = new Date().toISOString();
                  const isExpired = Boolean(coupon.end_date && coupon.end_date < now);
                  const isLimitReached = Boolean(coupon.usage_limit && coupon.used_count >= coupon.usage_limit);

                  return (
                    <tr key={coupon.id} className="hover:bg-[#fbf9f8] transition">
                      {/* Code */}
                      <td className="p-4 font-mono font-bold text-sm text-[#1b1c1c] tracking-wider">
                        <span className="bg-[#f5f3f3] px-2.5 py-1 border border-[#e3e2e2] inline-block">
                          {coupon.code}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="p-4 uppercase font-semibold text-[#5e5e5b]">
                        <div className="flex items-center gap-1.5">
                          {coupon.type === 'percentage' ? (
                            <Percent className="h-3.5 w-3.5 text-amber-800" />
                          ) : (
                            <Banknote className="h-3.5 w-3.5 text-emerald-700" />
                          )}
                          <span>{coupon.type}</span>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `৳${coupon.value.toLocaleString('en-BD')} OFF`}
                        {coupon.max_discount_amount && (
                          <span className="block text-[10px] text-[#5e5e5b] font-normal">
                            Max: ৳{coupon.max_discount_amount.toLocaleString('en-BD')}
                          </span>
                        )}
                      </td>

                      {/* Min Order */}
                      <td className="p-4 text-[#5e5e5b]">
                        {coupon.minimum_amount > 0 ? (
                          <span>৳{coupon.minimum_amount.toLocaleString('en-BD')}</span>
                        ) : (
                          <span className="text-[#5e5e5b]/60">No Min</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="p-4 text-[#5e5e5b]">
                        <div className="space-y-1">
                          <span>
                            {coupon.used_count} / {coupon.usage_limit ?? '∞'}
                          </span>
                          {coupon.usage_limit && (
                            <div className="w-16 h-1.5 bg-[#e3e2e2] overflow-hidden">
                              <div
                                className="h-full bg-[#1b1c1c]"
                                style={{
                                  width: `${Math.min(100, Math.round((coupon.used_count / coupon.usage_limit) * 100))}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="p-4 text-[#5e5e5b] text-[11px]">
                        {coupon.start_date || coupon.end_date ? (
                          <div>
                            {coupon.start_date && (
                              <span>From: {coupon.start_date.split('T')[0]}</span>
                            )}
                            {coupon.end_date && (
                              <span className="block">Until: {coupon.end_date.split('T')[0]}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#5e5e5b]/60">Always Valid</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(coupon)}
                          title="Click to toggle status"
                          className="cursor-pointer"
                        >
                          {isExpired ? (
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 border border-rose-200">
                              Expired
                            </span>
                          ) : isLimitReached ? (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 border border-amber-200">
                              Limit Reached
                            </span>
                          ) : coupon.is_active ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 hover:bg-emerald-100 transition">
                              ✓ Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 border border-gray-300 hover:bg-gray-200 transition">
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Edit className="h-4 w-4 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(coupon)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 transition cursor-pointer"
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
              No promotional voucher codes match your search term or active filter.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleOpenCreateModal}
              className="mt-2"
            >
              Create New Coupon
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-[#e3e2e2] p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
              <h3 className="font-display text-lg font-semibold text-[#1b1c1c]">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Coupon'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {modalError && (
              <div className="bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                {modalError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              {/* Code */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1b1c1c]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EID2026 or NOBAB100"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] font-mono uppercase rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Discount Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">
                    Discount Value ({formType === 'percentage' ? '%' : '৳'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formType === 'percentage' ? 100 : 50000}
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={formType === 'percentage' ? '15' : '100'}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Min Order Amount (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={formMinAmount}
                    onChange={(e) => setFormMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
                  />
                </div>

                {formType === 'percentage' && (
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1b1c1c]">Max Discount Limit (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Optional cap e.g. 500"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Usage Limit */}
              <div className="space-y-1">
                <label className="font-semibold text-[#1b1c1c]">Usage Limit (Total Uses)</label>
                <input
                  type="number"
                  min={1}
                  value={formUsageLimit}
                  onChange={(e) => setFormUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Leave empty for unlimited"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none font-mono"
                />
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1b1c1c]">Expiry Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] px-3.5 py-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1b1c1c]">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 accent-black"
                  />
                  <span>Active (Available for checkout redemptions)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e2e2]">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
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
        title={`Delete Coupon "${deleteTarget?.code}"?`}
        description="Are you sure you want to permanently delete this coupon voucher from MongoDB?"
        confirmText="Delete Coupon"
      />
    </>
  );
}
