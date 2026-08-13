'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  User,
  MapPin,
  CreditCard,
  Truck,
  FileText,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { OrderWithItems, OrderStatus, PaymentStatus } from '@/types';

interface OrderDetailsDrawerProps {
  order: OrderWithItems | null;
  isOpen: boolean;
  onClose: () => void;
  // Status Control
  newStatus: OrderStatus;
  setNewStatus: (val: OrderStatus) => void;
  statusNote: string;
  setStatusNote: (val: string) => void;
  isUpdatingStatus: boolean;
  onUpdateStatus: (e: React.FormEvent) => void;
  // Payment Control
  newPaymentStatus: PaymentStatus;
  setNewPaymentStatus: (val: PaymentStatus) => void;
  paymentNote: string;
  setPaymentNote: (val: string) => void;
  isUpdatingPayment: boolean;
  onUpdatePayment: (e: React.FormEvent) => void;
  // Courier Control
  courierName: string;
  setCourierName: (val: string) => void;
  trackingNo: string;
  setTrackingNo: (val: string) => void;
  delivStatus: string;
  setDelivStatus: (val: string) => void;
  isUpdatingDelivery: boolean;
  onUpdateDelivery: (e: React.FormEvent) => void;
  // Admin Notes Control
  adminNoteInput: string;
  setAdminNoteInput: (val: string) => void;
  isAddingNote: boolean;
  onAddAdminNote: (e: React.FormEvent) => void;
}

export function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  isUpdatingStatus,
  onUpdateStatus,
  newPaymentStatus,
  setNewPaymentStatus,
  paymentNote,
  setPaymentNote,
  isUpdatingPayment,
  onUpdatePayment,
  courierName,
  setCourierName,
  trackingNo,
  setTrackingNo,
  delivStatus,
  setDelivStatus,
  isUpdatingDelivery,
  onUpdateDelivery,
  adminNoteInput,
  setAdminNoteInput,
  isAddingNote,
  onAddAdminNote,
}: OrderDetailsDrawerProps) {
  if (!isOpen || !order) return null;

  const customerName = order.shipping_address?.name || 'Customer';
  const customerPhone = order.shipping_address?.phone || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Content Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e3e2e2] flex items-center justify-between bg-[#fbf9f8]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-[#1b1c1c] font-mono">
                Order #{order.order_number}
              </h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                  order.status === 'delivered'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : order.status === 'cancelled'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-[#5e5e5b] mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString('en-GB')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#e3e2e2]/50 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: CUSTOMER & SHIPPING ADDRESS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-[#e3e2e2] bg-[#fbf9f8]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#1b1c1c]">
                <User className="h-3.5 w-3.5 stroke-[1.5]" /> Customer Details
              </div>
              <div className="text-xs text-[#1b1c1c] font-semibold">{customerName}</div>
              <div className="text-xs text-[#5e5e5b] font-mono">{customerPhone}</div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#1b1c1c]">
                <MapPin className="h-3.5 w-3.5 stroke-[1.5]" /> Shipping Address
              </div>
              <div className="text-xs text-[#1b1c1c] leading-relaxed">
                {order.shipping_address?.address || 'No address provided'}
                <br />
                {order.shipping_address?.upazila ? `${order.shipping_address.upazila}, ` : ''}
                {order.shipping_address?.district || 'Bangladesh'}
              </div>
            </div>
          </div>

          {/* SECTION 2: ORDER ITEMS & BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              Order Purchased Items ({order.order_items?.length || 0})
            </h3>

            <div className="border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          width={40}
                          height={40}
                          className="object-cover h-10 w-10 border border-[#e3e2e2] shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-[#5e5e5b]" />
                        </div>
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-xs text-[#1b1c1c] truncate">
                          {item.product_name}
                        </div>
                        <div className="text-[10px] text-[#5e5e5b]">
                          Qty: {item.quantity} x ৳{item.price.toLocaleString('en-BD')}
                        </div>
                      </div>
                    </div>

                    <div className="font-display font-semibold text-xs text-[#1b1c1c] shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#5e5e5b]">No item details found.</div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-[#fbf9f8] border border-[#e3e2e2] space-y-2 text-xs">
              <div className="flex justify-between text-[#5e5e5b]">
                <span>Subtotal</span>
                <span>৳{(order.subtotal || order.total - (order.delivery_charge || 0)).toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-[#5e5e5b]">
                <span>Delivery Charge</span>
                <span>৳{(order.delivery_charge || 0).toLocaleString('en-BD')}</span>
              </div>
              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-৳{order.discount.toLocaleString('en-BD')}</span>
                </div>
              ) : null}
              <div className="flex justify-between pt-2 border-t border-[#e3e2e2] font-display font-semibold text-sm text-[#1b1c1c]">
                <span>Grand Total</span>
                <span>৳{order.total.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: FULFILLMENT & ORDER STATUS CONTROL */}
          <form onSubmit={onUpdateStatus} className="p-4 border border-[#e3e2e2] bg-white space-y-3">
            <div className="text-xs font-bold uppercase text-[#1b1c1c] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 stroke-[1.5]" />
              Fulfillment Status Control
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Update Order Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>

              <Input
                label="Audit / Status Remark"
                placeholder="Reason for change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" disabled={isUpdatingStatus}>
                {isUpdatingStatus ? 'Updating...' : 'Update Order Status'}
              </Button>
            </div>
          </form>

          {/* SECTION 4: PAYMENT STATUS CONTROL */}
          <form onSubmit={onUpdatePayment} className="p-4 border border-[#e3e2e2] bg-white space-y-3">
            <div className="text-xs font-bold uppercase text-[#1b1c1c] flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-blue-700 stroke-[1.5]" />
              Payment Management ({order.payment_method.toUpperCase()})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Payment Status"
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </Select>

              <Input
                label="Transaction ID / Payment Note"
                placeholder="Trx ID or remark..."
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="sm" disabled={isUpdatingPayment}>
                {isUpdatingPayment ? 'Saving...' : 'Update Payment Record'}
              </Button>
            </div>
          </form>

          {/* SECTION 5: COURIER DISPATCH CONTROL */}
          <form onSubmit={onUpdateDelivery} className="p-4 border border-[#e3e2e2] bg-white space-y-3">
            <div className="text-xs font-bold uppercase text-[#1b1c1c] flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-indigo-700 stroke-[1.5]" />
              Courier Dispatch & Tracking
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Courier Partner"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
              />
              <Input
                label="Tracking #"
                placeholder="e.g. ST-882910"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
              />
              <Input
                label="Delivery Status"
                value={delivStatus}
                onChange={(e) => setDelivStatus(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="sm" disabled={isUpdatingDelivery}>
                {isUpdatingDelivery ? 'Saving...' : 'Save Tracking Info'}
              </Button>
            </div>
          </form>

          {/* SECTION 6: INTERNAL ADMIN NOTES */}
          <form onSubmit={onAddAdminNote} className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] space-y-3">
            <div className="text-xs font-bold uppercase text-[#1b1c1c] flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-700 stroke-[1.5]" />
              Internal Admin Notes
            </div>

            <Textarea
              placeholder="Add private staff note regarding this order..."
              value={adminNoteInput}
              onChange={(e) => setAdminNoteInput(e.target.value)}
              rows={2}
            />

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="sm" disabled={isAddingNote}>
                {isAddingNote ? 'Saving...' : 'Save Admin Note'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
