import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserOrders, getUserOrderStats } from '@/services/order-service';
import {
  Package,
  Clock,
  CheckCircle2,
  Heart,
  ChevronRight,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Overview — Nabab Lungi',
  description: 'Manage your orders, saved addresses, wishlist, and profile details.',
};

function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const firstName = name ? name.split(' ')[0] : 'Valued Customer';

  if (hour >= 4 && hour < 12) {
    return `Good morning, ${firstName}!`;
  }
  if (hour >= 12 && hour < 17) {
    return `Good afternoon, ${firstName}!`;
  }
  return `Good evening, ${firstName}!`;
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as { id?: string }).id : null;
  const userName = session?.user?.name || null;

  const [stats, recentOrders] = userId
    ? await Promise.all([getUserOrderStats(userId), getUserOrders(userId, 3)])
    : [{ totalOrders: 0, processingOrders: 0, deliveredOrders: 0 }, []];

  const greetingMessage = getGreeting(userName);

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-2">
        <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#1b1c1c]">
          {greetingMessage}
        </h1>
        <p className="text-xs font-light text-[#5e5e5b]">
          Manage your orders, saved addresses, wishlist, and account details.
        </p>
      </div>

      {/* Compact Real Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3e2e2] p-5 space-y-1">
          <div className="flex items-center justify-between text-[#5e5e5b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Orders</span>
            <Package className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#1b1c1c]">
            {stats.totalOrders}
          </div>
        </div>

        <div className="bg-white border border-[#e3e2e2] p-5 space-y-1">
          <div className="flex items-center justify-between text-[#5e5e5b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Processing</span>
            <Clock className="h-4 w-4 stroke-[1.5] text-amber-700" />
          </div>
          <div className="font-display text-2xl font-bold text-[#1b1c1c]">
            {stats.processingOrders}
          </div>
        </div>

        <div className="bg-white border border-[#e3e2e2] p-5 space-y-1">
          <div className="flex items-center justify-between text-[#5e5e5b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="h-4 w-4 stroke-[1.5] text-emerald-700" />
          </div>
          <div className="font-display text-2xl font-bold text-[#1b1c1c]">
            {stats.deliveredOrders}
          </div>
        </div>

        <div className="bg-white border border-[#e3e2e2] p-5 space-y-1">
          <div className="flex items-center justify-between text-[#5e5e5b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Wishlist</span>
            <Heart className="h-4 w-4 stroke-[1.5] text-rose-700" />
          </div>
          <div className="font-display text-2xl font-bold text-[#1b1c1c]">
            3
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg font-semibold text-[#1b1c1c]">
              Recent Orders
            </h2>
            <p className="text-xs font-light text-[#5e5e5b] mt-0.5">
              Your latest purchases and current fulfillment status.
            </p>
          </div>
          {recentOrders.length > 0 && (
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
            >
              View All Orders
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
              const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="border border-[#e3e2e2] p-5 bg-[#fbf9f8]/60 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-[#1b1c1c]">
                        Order #{order.order_number}
                      </span>
                      <span className="text-xs text-[#5e5e5b]">• {orderDate}</span>
                    </div>

                    <div className="text-xs text-[#5e5e5b]">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} ·{' '}
                      <span className="font-semibold text-[#1b1c1c]">
                        ৳{order.total.toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
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

                    <Link
                      href={`/account/orders/${order.order_number}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
                    >
                      View Order
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 bg-[#fbf9f8]/40 border border-dashed border-[#e3e2e2]">
            <Package className="h-6 w-6 stroke-[1.5] text-[#5e5e5b] mx-auto" />
            <h3 className="font-display text-sm font-semibold text-[#1b1c1c]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Explore our handcrafted Lungi collection to find something you love.
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

      {/* Quick Actions Section */}
      <div className="bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            href="/account/orders"
            className="p-4 border border-[#e3e2e2] bg-[#fbf9f8]/60 hover:bg-white transition flex items-center justify-between font-medium text-[#1b1c1c] group"
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              My Orders
            </span>
            <ChevronRight className="h-4 w-4 text-[#5e5e5b] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/account/addresses"
            className="p-4 border border-[#e3e2e2] bg-[#fbf9f8]/60 hover:bg-white transition flex items-center justify-between font-medium text-[#1b1c1c] group"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Saved Addresses
            </span>
            <ChevronRight className="h-4 w-4 text-[#5e5e5b] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/account/wishlist"
            className="p-4 border border-[#e3e2e2] bg-[#fbf9f8]/60 hover:bg-white transition flex items-center justify-between font-medium text-[#1b1c1c] group"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-[#5e5e5b] stroke-[1.5]" />
              Wishlist
            </span>
            <ChevronRight className="h-4 w-4 text-[#5e5e5b] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Continue Shopping Banner */}
      <div className="bg-[#1b1c1c] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e3e2e2] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Artisanal Handloom Craftsmanship
          </span>
          <h3 className="font-display text-lg font-semibold text-white">
            Continue Shopping
          </h3>
          <p className="text-xs text-[#c5c4c2]">
            Discover our latest handcrafted Lungi collection woven from fine natural cotton.
          </p>
        </div>

        <Link
          href="/products"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider hover:bg-[#f5f3f3] transition"
        >
          <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
          Explore Collection →
        </Link>
      </div>
    </div>
  );
}
