import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getOrderById } from '@/services/order-service';
import { getStoreSettings } from '@/services/settings-service';
import { CancelOrderButton } from '@/components/shared/cancel-order-button';
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  Headphones,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Details — Nabab Lungi',
  description: 'View complete details, tracking timeline, and invoices for your order.',
};

const ORDER_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function getStageIndex(status: string): number {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return 0;
    case 'processing':
    case 'packed':
      return 1;
    case 'shipped':
      return 2;
    case 'out_for_delivery':
      return 3;
    case 'delivered':
      return 4;
    default:
      return -1;
  }
}

export default async function CustomerOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const userId = (session.user as { id?: string }).id;
  const userRole = (session.user as { role?: string }).role;

  const [order, storeSettings] = await Promise.all([
    getOrderById(id),
    getStoreSettings(),
  ]);

  // Authorization Security Check
  if (!order || (order.user_id && order.user_id !== userId && userRole !== 'admin')) {
    return (
      <div className="bg-white border border-[#e3e2e2] p-8 sm:p-12 text-center space-y-4">
        <div className="p-3 bg-[#fbf9f8] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
          <AlertCircle className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h1 className="font-display text-xl font-bold text-[#1b1c1c]">
          Order Not Found
        </h1>
        <p className="text-xs text-[#5e5e5b] max-w-md mx-auto">
          We couldn&apos;t find an order matching this reference, or you do not have permission to view it.
        </p>
        <div className="pt-2">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'returned';
  const isCancellable = (order.status === 'pending' || order.status === 'confirmed') && !isCancelled;

  const orderDateFormatted = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const orderTimeFormatted = new Date(order.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const supportPhone = storeSettings.general.store_phone || '+880 1712-345678';
  const supportEmail = storeSettings.general.store_email || 'support@nobablungi.com';
  const whatsappNumber = storeSettings.general.whatsapp_number?.replace(/[^0-9]/g, '') || '';

  const isDhakaArea =
    order.shipping_address.district.toLowerCase().includes('dhaka') &&
    !order.shipping_address.district.toLowerCase().includes('outside');

  const estimatedDeliveryText = isDhakaArea
    ? '2–3 Business Days (Inside Dhaka)'
    : '3–5 Business Days (Outside Dhaka)';

  return (
    <div className="space-y-6">
      {/* 1. Page Navigation & Top Header */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5e5e5b] hover:text-[#1b1c1c] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Orders
          </Link>

          <span
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 border ${
              order.status === 'delivered'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isCancelled
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-t border-[#e3e2e2] pt-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1b1c1c]">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-[#5e5e5b] font-light mt-0.5">
              Placed on {orderDateFormatted} at {orderTimeFormatted}
            </p>
          </div>

          <div className="text-xs text-[#5e5e5b] sm:text-right">
            Total Charged:{' '}
            <strong className="font-display text-base font-bold text-[#1b1c1c] ml-1">
              ৳{order.total.toLocaleString('en-BD')}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Order Status Progression Timeline */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
          Order Status Progress
        </h2>

        {isCancelled ? (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
            <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 stroke-[2]" />
              Order {order.status === 'cancelled' ? 'Cancelled' : 'Returned'}
            </div>
            <p className="text-red-700 font-light">
              This order has been {order.status}. No further fulfillment actions will take place.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Horizontal Step Pipeline */}
            <div className="hidden md:flex items-center justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e3e2e2] -z-0" />
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="relative z-10 flex flex-col items-center text-center space-y-2 bg-white px-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition ${
                        isCompleted
                          ? 'bg-[#1b1c1c] text-white border-[#1b1c1c]'
                          : isCurrent
                          ? 'bg-amber-400 text-[#1b1c1c] border-[#1b1c1c] ring-4 ring-amber-100'
                          : 'bg-white text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold tracking-wider ${
                        isCurrent ? 'text-[#1b1c1c] font-bold' : isCompleted ? 'text-[#1b1c1c]' : 'text-[#5e5e5b]'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Step Timeline */}
            <div className="md:hidden space-y-4 relative border-l-2 border-[#e3e2e2] ml-4 pl-6">
              {ORDER_STAGES.map((stage, idx) => {
                const isCompleted = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="relative flex items-center gap-3">
                    <div
                      className={`absolute -left-[31px] h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-[#1b1c1c] text-white border-[#1b1c1c]'
                          : isCurrent
                          ? 'bg-amber-400 text-[#1b1c1c] border-[#1b1c1c]'
                          : 'bg-white text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${
                        isCurrent ? 'text-[#1b1c1c] font-bold' : isCompleted ? 'text-[#1b1c1c]' : 'text-[#5e5e5b]'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Details Grid (2-Column Desktop, 1-Column Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) — Items & Timeline Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items in this Order */}
          <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Items in this Order ({order.order_items.length})
            </h2>

            <div className="divide-y divide-[#e3e2e2]">
              {order.order_items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative h-16 w-16 bg-[#fbf9f8] border border-[#e3e2e2] shrink-0 overflow-hidden">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[#5e5e5b]">
                        <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    {item.product_id ? (
                      <Link
                        href={`/products/${item.product_id}`}
                        className="font-display text-sm font-semibold text-[#1b1c1c] hover:underline flex items-center gap-1 group"
                      >
                        <span className="truncate">{item.product_name}</span>
                        <ExternalLink className="h-3 w-3 text-[#5e5e5b] group-hover:text-[#1b1c1c] shrink-0" />
                      </Link>
                    ) : (
                      <h3 className="font-display text-sm font-semibold text-[#1b1c1c] truncate">
                        {item.product_name}
                      </h3>
                    )}
                    <div className="text-xs text-[#5e5e5b]">
                      Quantity: <strong className="text-[#1b1c1c]">{item.quantity}</strong> × ৳{item.price.toLocaleString('en-BD')}
                    </div>
                  </div>

                  <div className="font-display text-sm font-bold text-[#1b1c1c] text-right shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Update History Log */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
                Updates & History
              </h2>

              <div className="space-y-3 divide-y divide-[#e3e2e2]">
                {order.timeline.map((evt, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 text-xs flex justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold uppercase tracking-wider text-[#1b1c1c] block">
                        {evt.status}
                      </span>
                      <p className="text-[#5e5e5b] font-light">{evt.message}</p>
                    </div>
                    <span className="text-[11px] text-[#5e5e5b] shrink-0 font-mono">
                      {new Date(evt.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col) — Financial Summary, Payment & Delivery */}
        <div className="space-y-6">
          {/* Order Financial Summary */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3">
              Order Financial Summary
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#5e5e5b]">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString('en-BD')}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>
                    Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ''}
                  </span>
                  <span>-৳{order.discount.toLocaleString('en-BD')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5e5e5b]">
                <span>Delivery Charge</span>
                <span>৳{order.delivery_charge.toLocaleString('en-BD')}</span>
              </div>

              <div className="border-t border-[#e3e2e2] pt-3 flex justify-between items-baseline">
                <span className="font-display text-sm font-bold text-[#1b1c1c] uppercase">Grand Total</span>
                <span className="font-display text-lg font-bold text-[#1b1c1c]">
                  ৳{order.total.toLocaleString('en-BD')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Payment Information
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5e5e5b]">Method</span>
                <span className="font-semibold uppercase text-[#1b1c1c] px-2 py-0.5 bg-[#fbf9f8] border border-[#e3e2e2]">
                  {order.payment_method === 'cod'
                    ? 'COD'
                    : order.payment_method === 'bkash'
                    ? 'bKash'
                    : 'Nagad'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5e5e5b]">Status</span>
                <span className="font-medium text-[#1b1c1c] capitalize px-2 py-0.5 bg-[#fbf9f8] border border-[#e3e2e2]">
                  {order.payment_status.replace('_', ' ')}
                </span>
              </div>

              {order.transaction_id && (
                <div className="pt-2 border-t border-[#e3e2e2] flex items-center justify-between">
                  <span className="text-[#5e5e5b]">Transaction ID</span>
                  <span className="font-mono text-xs font-semibold text-[#1b1c1c]">
                    {order.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address (Refactored for High Legibility) */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Delivery Address
            </h2>

            <div className="space-y-3 text-xs">
              {/* Receiver Name & Area Tag */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#1b1c1c]">
                    {order.shipping_address.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[#5e5e5b] font-mono text-[11px] mt-0.5">
                    <Phone className="h-3 w-3 stroke-[1.5]" />
                    {order.shipping_address.phone}
                  </div>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-[#fbf9f8] border border-[#e3e2e2] text-[#1b1c1c] shrink-0">
                  {order.shipping_address.district}
                </span>
              </div>

              {/* Full Address */}
              <div className="pt-3 border-t border-[#e3e2e2] space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5e5e5b] block">
                  Full Shipping Address
                </span>
                <p className="text-xs text-[#1b1c1c] leading-relaxed font-normal">
                  {order.shipping_address.address}
                </p>
              </div>

              {/* Estimated Delivery Callout Box */}
              <div className="pt-2">
                <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-3 flex items-center gap-3">
                  <div className="p-2 bg-white border border-[#e3e2e2] text-[#1b1c1c] shrink-0">
                    <Truck className="h-4 w-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5e5e5b] block">
                      Estimated Delivery
                    </span>
                    <span className="text-xs font-bold text-[#1b1c1c]">
                      {estimatedDeliveryText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Actions & Support */}
          <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
              <Headphones className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Customer Support
            </div>

            <p className="text-xs text-[#5e5e5b] leading-relaxed">
              Questions regarding your order delivery or payment? Our support team is ready to assist.
            </p>

            <div className="space-y-2 pt-1">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              )}

              <a
                href={`tel:${supportPhone}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e3e2e2] text-[#1b1c1c] hover:bg-[#f5f3f3] text-xs font-semibold uppercase tracking-wider transition"
              >
                Call {supportPhone}
              </a>

              {supportEmail && (
                <a
                  href={`mailto:${supportEmail}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e3e2e2] text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] text-xs font-semibold uppercase tracking-wider transition"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </a>
              )}
            </div>

            {isCancellable && (
              <div className="pt-4 border-t border-[#e3e2e2]">
                <CancelOrderButton orderId={order.id} orderNumber={order.order_number} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
