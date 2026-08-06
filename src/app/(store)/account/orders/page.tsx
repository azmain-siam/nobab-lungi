import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserOrders } from '@/services/order-service';
import { Badge } from '@/components/ui/badge';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { Package, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Orders — Nabab Lungi',
  description: 'View your order history, track deliveries, and view invoices.',
};

export default async function OrderHistoryPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as { id?: string }).id : null;

  const orders = userId ? await getUserOrders(userId) : [];

  return (
    <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
      <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-semibold text-[#1b1c1c]">
            My Orders
          </h1>
          <p className="text-xs font-light text-[#5e5e5b] mt-1">
            Track past and current orders placed with Nabab Lungi.
          </p>
        </div>
        <Badge variant="pill">{orders.length} Orders</Badge>
      </div>

      {orders.length > 0 ? (
        <StaggerContainer className="space-y-4">
          {orders.map((order) => {
            const itemsSummary = order.order_items
              .map((item) => `${item.product_name} x ${item.quantity}`)
              .join(', ');

            const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <StaggerItem
                key={order.id}
                className="border border-[#e3e2e2] p-5 space-y-3 bg-[#fbf9f8]/60 hover:bg-white transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e2e2] pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#1b1c1c] stroke-[1.5]" />
                    <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                      Order #{order.order_number}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#5e5e5b]">
                      Placed on {orderDate}
                    </span>
                    {order.status === 'delivered' ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
                        <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                        Delivered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200 uppercase">
                        <Clock className="h-3 w-3 stroke-[2]" />
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
                  <div className="flex-1 pr-4 space-y-0.5">
                    <div>
                      <span className="text-[#5e5e5b]">Items: </span>
                      <span className="font-medium text-[#1b1c1c] line-clamp-1">
                        {itemsSummary}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5e5e5b]">
                      Payment: <strong className="uppercase text-[#1b1c1c]">{order.payment_method}</strong> ({order.payment_status.replace('_', ' ')})
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                      ৳{order.total.toLocaleString('en-BD')}
                    </span>
                    <Link
                      href={`/account/orders/${order.order_number}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
                    >
                      View Details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      ) : (
        <div className="p-12 text-center space-y-3 bg-[#fbf9f8]/40 border border-dashed border-[#e3e2e2]">
          <div className="p-3 bg-white border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
            <AlertCircle className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="font-display text-base font-semibold text-[#1b1c1c]">No Orders Yet</h2>
          <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
            You haven&apos;t placed any orders with this account yet. Explore our handcrafted Lungi collection and find something you&apos;ll love.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
