'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { Plus, Search, Trash2, Edit, Ticket } from 'lucide-react';

interface MockCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumAmount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const MOCK_COUPONS: MockCoupon[] = [
  {
    id: 'coup-1',
    code: 'EID2026',
    type: 'percentage',
    value: 15,
    minimumAmount: 2000,
    usageLimit: 500,
    usedCount: 142,
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'NOBAB100',
    type: 'fixed',
    value: 100,
    minimumAmount: 1000,
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
  },
  {
    id: 'coup-3',
    code: 'WELCOME50',
    type: 'fixed',
    value: 50,
    minimumAmount: 500,
    usageLimit: 1000,
    usedCount: 1000,
    isActive: false,
  },
];

export default function AdminCouponsPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredCoupons = MOCK_COUPONS.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    toast.success(`Coupon ${deleteTargetId} deleted.`);
    setDeleteTargetId(null);
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
            Create promotional campaign vouchers and manage percentage / fixed discount rules.
          </p>
        </div>

        <Button type="button" variant="primary" size="md" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by code..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {filteredCoupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Coupon Code</th>
                  <th className="p-4 font-semibold">Discount Type</th>
                  <th className="p-4 font-semibold">Value</th>
                  <th className="p-4 font-semibold">Min Order</th>
                  <th className="p-4 font-semibold">Usage</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4 font-mono font-bold text-sm text-[#1b1c1c] tracking-wider">
                      {coupon.code}
                    </td>
                    <td className="p-4 uppercase font-semibold text-[#5e5e5b]">
                      {coupon.type}
                    </td>
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `৳${coupon.value} OFF`}
                    </td>
                    <td className="p-4 text-[#5e5e5b]">
                      ৳{coupon.minimumAmount.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4 text-[#5e5e5b]">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="p-4">
                      {coupon.isActive ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(coupon.code)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition"
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
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Ticket className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Coupons Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No promotional voucher codes match your search term.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon?"
        description="Are you sure you want to deactivate and remove this coupon code?"
        confirmText="Delete Coupon"
      />
    </>
  );
}
