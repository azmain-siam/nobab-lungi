'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import {
  fetchAdminOrdersAction,
  updateOrderStatusAction,
  updatePaymentStatusAction,
  updateDeliveryInfoAction,
  addAdminNoteAction,
} from '@/features/dashboard/actions/order-actions';
import type { OrderWithItems, OrderStatus, PaymentStatus } from '@/types';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
  FileText,
  Send,
  Package,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Orders State
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer / Details State
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  // Detail Form Controls
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [paymentNote, setPaymentNote] = useState('');
  const [courierName, setCourierName] = useState('Steadfast Courier');
  const [trackingNo, setTrackingNo] = useState('');
  const [delivStatus, setDelivStatus] = useState('In Transit');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Cancel Confirmation Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchOrders = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch Orders Effect
  useEffect(() => {
    let isMounted = true;

    fetchAdminOrdersAction({
      search: searchQuery,
      status: statusFilter,
      paymentStatus: paymentStatusFilter,
      paymentMethod: paymentMethodFilter,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sort: sortBy,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setOrders(res.orders);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);

          // Refresh selected order snapshot if open
          if (selectedOrder) {
            const updated = res.orders.find((o) => o.id === selectedOrder.id || o.order_number === selectedOrder.order_number);
            if (updated) setSelectedOrder(updated);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching admin orders:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    searchQuery,
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
    sortBy,
    currentPage,
    refreshKey,
    selectedOrder,
  ]);

  // Open Details Drawer
  const handleOpenDetails = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setNewPaymentStatus(order.payment_status);
    setPaymentNote('');
    setCourierName(order.courier || 'Steadfast Courier');
    setTrackingNo(order.tracking_number || '');
    setDelivStatus(order.delivery_status || 'In Transit');
    setAdminNoteInput(order.admin_notes || '');
  };

  // Update Status Submit
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (newStatus === 'cancelled') {
      setIsCancelModalOpen(true);
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatusAction(selectedOrder.order_number, newStatus, statusNote);
      if (res.success) {
        toast.success(`Order #${selectedOrder.order_number} status updated to ${newStatus.toUpperCase()}.`);
        setStatusNote('');
        startTransition(() => refetchOrders());
      } else {
        toast.error(res.error || 'Failed to update order status.');
      }
    } catch {
      toast.error('An error occurred while updating order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Confirm Order Cancellation
  const handleConfirmCancelOrder = async () => {
    if (!selectedOrder) return;

    setIsCancelling(true);
    try {
      const res = await updateOrderStatusAction(selectedOrder.order_number, 'cancelled', statusNote || 'Cancelled by admin.');
      if (res.success) {
        toast.success(`Order #${selectedOrder.order_number} has been cancelled.`);
        setIsCancelModalOpen(false);
        setStatusNote('');
        startTransition(() => refetchOrders());
      } else {
        toast.error(res.error || 'Failed to cancel order.');
      }
    } catch {
      toast.error('An error occurred during order cancellation.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Update Payment Status Submit
  const handleUpdatePaymentStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdatingPayment(true);
    try {
      const res = await updatePaymentStatusAction(selectedOrder.order_number, newPaymentStatus, paymentNote);
      if (res.success) {
        toast.success(`Payment status updated to ${newPaymentStatus.toUpperCase()}.`);
        setPaymentNote('');
        startTransition(() => refetchOrders());
      } else {
        toast.error(res.error || 'Failed to update payment status.');
      }
    } catch {
      toast.error('An error occurred while updating payment status.');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Update Delivery & Tracking Info
  const handleUpdateDeliveryInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (!courierName || !trackingNo) {
      toast.error('Courier name and tracking number are required.');
      return;
    }

    setIsUpdatingDelivery(true);
    try {
      const res = await updateDeliveryInfoAction(selectedOrder.order_number, courierName, trackingNo, delivStatus);
      if (res.success) {
        toast.success(`Delivery dispatch info updated (${courierName} #${trackingNo}).`);
        startTransition(() => refetchOrders());
      } else {
        toast.error(res.error || 'Failed to update delivery info.');
      }
    } catch {
      toast.error('An error occurred while saving delivery info.');
    } finally {
      setIsUpdatingDelivery(false);
    }
  };

  // Add Internal Admin Note
  const handleAddAdminNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !adminNoteInput.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await addAdminNoteAction(selectedOrder.order_number, adminNoteInput);
      if (res.success) {
        toast.success('Admin note appended to order.');
        setAdminNoteInput('');
        startTransition(() => refetchOrders());
      } else {
        toast.error(res.error || 'Failed to add admin note.');
      }
    } catch {
      toast.error('An error occurred while adding admin note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <>
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
            Order Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Fulfill orders, track courier dispatches, update payment statuses, and manage customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchOrders()}
            disabled={isLoading || isPending}
            className="p-2.5"
            title="Refresh Order List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters & Search Controls Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order # (NL-XXXXXX), customer name, or phone..."
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>

          {/* Filter Select Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#5e5e5b]">
              <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            {/* Order Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="bkash">bKash Mobile</option>
              <option value="nagad">Nagad Mobile</option>
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
              <option value="highest_total">Highest Total Amount</option>
              <option value="lowest_total">Lowest Total Amount</option>
            </select>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
          <span className="font-semibold text-[#1b1c1c]">Date Range:</span>
          <div className="flex items-center gap-1.5">
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1 px-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1 px-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c]"
            />
          </div>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
              className="text-[10px] text-red-600 hover:underline font-semibold uppercase ml-2"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Orders List Table */}
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
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Delivery Tracking</th>
                  <th className="p-4 font-semibold">Order Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {orders.map((o) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-50 text-amber-800 border-amber-300',
                    confirmed: 'bg-blue-50 text-blue-800 border-blue-300',
                    processing: 'bg-indigo-50 text-indigo-800 border-indigo-300',
                    packed: 'bg-purple-50 text-purple-800 border-purple-300',
                    shipped: 'bg-cyan-50 text-cyan-800 border-cyan-300',
                    delivered: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                    cancelled: 'bg-red-50 text-red-800 border-red-300',
                    returned: 'bg-orange-50 text-orange-800 border-orange-300',
                  };

                  const paymentColors: Record<string, string> = {
                    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    unpaid: 'bg-red-50 text-red-700 border-red-200',
                    pending_verification: 'bg-amber-50 text-amber-800 border-amber-300',
                    refunded: 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]',
                  };

                  return (
                    <tr key={o.id} className="hover:bg-[#fbf9f8] transition">
                      <td className="p-4 font-mono font-bold text-[#1b1c1c]">{o.order_number}</td>
                      <td className="p-4">
                        <div className="font-semibold text-[#1b1c1c]">{o.shipping_address.name}</div>
                        <div className="text-[10px] text-[#5e5e5b]">{o.shipping_address.phone}</div>
                      </td>
                      <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                        ৳{o.total.toLocaleString('en-BD')}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 border uppercase ${paymentColors[o.payment_status] || 'bg-[#f5f3f3]'}`}>
                          {o.payment_status.replace('_', ' ')}
                        </span>
                        <div className="text-[9px] text-[#5e5e5b] uppercase mt-0.5">{o.payment_method}</div>
                      </td>
                      <td className="p-4">
                        {o.tracking_number ? (
                          <div>
                            <span className="font-mono text-[11px] font-semibold text-[#1b1c1c]">
                              {o.courier || 'Courier'}: #{o.tracking_number}
                            </span>
                            <div className="text-[10px] text-emerald-700 font-medium">
                              {o.delivery_status || 'In Transit'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#5e5e5b]">Not Dispatched</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 border uppercase ${statusColors[o.status] || 'bg-[#f5f3f3]'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-[#5e5e5b]">
                        {new Date(o.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDetails(o)}
                          className="gap-1 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </Button>
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
              <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Orders Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No customer orders match your search query or filter settings.
            </p>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {orders.length} of {total} orders
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

      {/* Order Details Slide-Over Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-[#1b1c1c]">
                    Order #{selectedOrder.order_number}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 border uppercase bg-amber-50 text-amber-800 border-amber-300">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-[#5e5e5b] mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-BD')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Customer & Shipping Address */}
              <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <User className="h-4 w-4 text-[#5e5e5b]" />
                  Customer & Shipping Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1b1c1c]">
                  <div>
                    <span className="text-[#5e5e5b] block text-[11px]">Customer Name:</span>
                    <span className="font-semibold">{selectedOrder.shipping_address.name}</span>
                  </div>
                  <div>
                    <span className="text-[#5e5e5b] block text-[11px]">Phone Number:</span>
                    <span className="font-mono font-semibold">{selectedOrder.shipping_address.phone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#5e5e5b] block text-[11px] flex items-center gap-1">
                      <MapPin className="h-3 w-3 inline" /> Full Address:
                    </span>
                    <span className="font-medium">
                      {selectedOrder.shipping_address.address} ({selectedOrder.shipping_address.district})
                    </span>
                  </div>
                  {selectedOrder.user_id && (
                    <div>
                      <span className="text-[#5e5e5b] block text-[11px]">User Account ID:</span>
                      <span className="font-mono text-[10px] text-[#5e5e5b]">{selectedOrder.user_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Product Snapshots */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                  <Package className="h-4 w-4 text-[#5e5e5b]" />
                  Purchased Product Items
                </h3>

                <div className="border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
                  {selectedOrder.order_items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                      <div className="flex items-center gap-3">
                        {item.product_image ? (
                          <div className="relative h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                            <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-[#1b1c1c]">{item.product_name}</div>
                          <div className="text-[11px] text-[#5e5e5b]">
                            ৳{item.price.toLocaleString('en-BD')} × {item.quantity} units
                          </div>
                        </div>
                      </div>

                      <div className="font-display font-semibold text-[#1b1c1c]">
                        ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Financial Summary */}
              <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#5e5e5b]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1b1c1c]">৳{selectedOrder.subtotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-[#5e5e5b]">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-[#1b1c1c]">৳{selectedOrder.delivery_charge.toLocaleString('en-BD')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-৳{selectedOrder.discount.toLocaleString('en-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-sm font-bold text-[#1b1c1c] border-t border-[#e3e2e2] pt-2">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">৳{selectedOrder.total.toLocaleString('en-BD')}</span>
                </div>
                <div className="pt-2 text-[11px] text-[#5e5e5b] border-t border-[#e3e2e2] flex justify-between">
                  <span>Payment Method: <strong className="uppercase text-[#1b1c1c]">{selectedOrder.payment_method}</strong></span>
                  {selectedOrder.transaction_id && <span>TrxID: <strong className="font-mono text-[#1b1c1c]">{selectedOrder.transaction_id}</strong></span>}
                </div>
              </div>

              {/* Section 4: Admin Update Actions */}
              <div className="space-y-4 pt-2 border-t border-[#e3e2e2]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-[#5e5e5b]" />
                  Admin Order Controls
                </h3>

                {/* Status Update Form */}
                <form onSubmit={handleUpdateStatus} className="bg-white border border-[#e3e2e2] p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Update Order Status</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                        className="flex-1 bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled (Cancel Order)</option>
                        <option value="returned">Returned</option>
                      </select>
                      <Button type="submit" variant="primary" size="sm" disabled={isUpdatingStatus}>
                        {isUpdatingStatus ? 'Saving...' : 'Update Status'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#5e5e5b]">Status Change Note (Optional)</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Customer confirmed via phone call..."
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </form>

                {/* Payment Status Form */}
                <form onSubmit={handleUpdatePaymentStatus} className="bg-white border border-[#e3e2e2] p-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Update Payment Status</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                        className="flex-1 bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <Button type="submit" variant="primary" size="sm" disabled={isUpdatingPayment}>
                        {isUpdatingPayment ? 'Saving...' : 'Update Payment'}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Courier & Tracking Form */}
                <form onSubmit={handleUpdateDeliveryInfo} className="bg-white border border-[#e3e2e2] p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-[#1b1c1c] flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Dispatch Courier & Tracking Number
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#1b1c1c]">Courier Name *</label>
                      <input
                        type="text"
                        required
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. Steadfast Courier"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#1b1c1c]">Tracking Number *</label>
                      <input
                        type="text"
                        required
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        placeholder="e.g. ST-849102"
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs font-mono text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={delivStatus}
                      onChange={(e) => setDelivStatus(e.target.value)}
                      placeholder="e.g. Out for Delivery"
                      className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                    <Button type="submit" variant="primary" size="sm" disabled={isUpdatingDelivery}>
                      {isUpdatingDelivery ? 'Saving Info...' : 'Save Courier Tracking'}
                    </Button>
                  </div>
                </form>

                {/* Internal Admin Note Form */}
                <form onSubmit={handleAddAdminNote} className="bg-white border border-[#e3e2e2] p-4 space-y-2">
                  <label className="text-xs font-semibold text-[#1b1c1c] flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Internal Admin Notes
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="Add internal staff notes or customer instructions..."
                      className="flex-1 bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                    <Button type="submit" variant="secondary" size="sm" disabled={isAddingNote || !adminNoteInput.trim()} className="self-end gap-1">
                      <Send className="h-3 w-3" /> Save Note
                    </Button>
                  </div>
                </form>
              </div>

              {/* Section 5: Chronological Order Timeline */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#e3e2e2]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#5e5e5b]" />
                    Order Activity Timeline
                  </h3>

                  <div className="border border-[#e3e2e2] bg-[#fbf9f8] p-4 space-y-3">
                    {selectedOrder.timeline.map((evt, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 text-xs">
                        <div className="h-2 w-2 rounded-full bg-[#1b1c1c] mt-1.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-[#1b1c1c]">{evt.message}</div>
                          <div className="text-[10px] text-[#5e5e5b] font-mono">
                            {new Date(evt.timestamp).toLocaleString('en-BD')} • By {evt.updated_by || 'Admin'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancelOrder}
        title="Cancel Order?"
        description={
          selectedOrder
            ? `Are you sure you want to cancel Order #${selectedOrder.order_number}? This will record a cancellation event in the timeline.`
            : ''
        }
        confirmText="Cancel Order"
        isLoading={isCancelling}
      />
    </>
  );
}
