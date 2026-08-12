'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
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
import { RefreshCw } from 'lucide-react';
import { OrderFilters } from '@/features/dashboard/components/order-filters';
import { OrdersTable } from '@/features/dashboard/components/orders-table';
import { OrderDetailsDrawer } from '@/features/dashboard/components/order-details-drawer';

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

          if (selectedOrder) {
            const updated = res.orders.find(
              (o) => o.id === selectedOrder.id || o.order_number === selectedOrder.order_number
            );
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
      const res = await updateOrderStatusAction(
        selectedOrder.order_number,
        'cancelled',
        statusNote || 'Cancelled by admin.'
      );
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
      const res = await updatePaymentStatusAction(
        selectedOrder.order_number,
        newPaymentStatus,
        paymentNote
      );
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
      const res = await updateDeliveryInfoAction(
        selectedOrder.order_number,
        courierName,
        trackingNo,
        delivStatus
      );
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
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
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

      {/* Order Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={setPaymentStatusFilter}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodChange={setPaymentMethodFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Orders Table & Mobile View */}
      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        onOpenDetails={handleOpenDetails}
        currentPage={currentPage}
        totalPages={pages}
        totalOrders={total}
        onPageChange={setCurrentPage}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusNote={statusNote}
        setStatusNote={setStatusNote}
        isUpdatingStatus={isUpdatingStatus}
        onUpdateStatus={handleUpdateStatus}
        newPaymentStatus={newPaymentStatus}
        setNewPaymentStatus={setNewPaymentStatus}
        paymentNote={paymentNote}
        setPaymentNote={setPaymentNote}
        isUpdatingPayment={isUpdatingPayment}
        onUpdatePayment={handleUpdatePaymentStatus}
        courierName={courierName}
        setCourierName={setCourierName}
        trackingNo={trackingNo}
        setTrackingNo={setTrackingNo}
        delivStatus={delivStatus}
        setDelivStatus={setDelivStatus}
        isUpdatingDelivery={isUpdatingDelivery}
        onUpdateDelivery={handleUpdateDeliveryInfo}
        adminNoteInput={adminNoteInput}
        setAdminNoteInput={setAdminNoteInput}
        isAddingNote={isAddingNote}
        onAddAdminNote={handleAddAdminNote}
      />

      {/* Order Cancellation Confirmation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel Order Confirmation"
        description={`Are you sure you want to cancel order #${selectedOrder?.order_number}? This will update the order status to CANCELLED.`}
        confirmText="Cancel Order"
        cancelText="Keep Order Active"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancelOrder}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </>
  );
}
