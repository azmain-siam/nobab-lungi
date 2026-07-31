'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { fetchDashboardOverviewAction } from '@/features/dashboard/actions/analytics-actions';
import type { DashboardMetrics } from '@/services/analytics-service';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Users,
  Ticket,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Grid,
  Layers,
  Settings,
  Database,
  ShieldCheck,
  Globe,
  ImageIcon,
  RefreshCw,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardOverviewPage() {
  const { data: session } = useSession();
  const adminName = session?.user?.name || 'Admin';

  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetchData = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchDashboardOverviewAction()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading dashboard overview:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Determine time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Formatted date string
  const currentDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate max amount for 7-day revenue bar chart scaling
  const maxRevenueInChart = data
    ? Math.max(...data.revenueOverview.chartData.map((d) => d.amount), 100)
    : 100;

  return (
    <>
      {/* SECTION 1: WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
            {getGreeting()}, {adminName}!
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            {currentDateString} - Here is your daily store performance and real-time business summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => startTransition(() => refetchData())}
            disabled={isLoading || isPending}
            className="p-2 bg-white border border-[#e3e2e2] hover:bg-[#fbf9f8] text-[#1b1c1c] transition"
            title="Refresh Store Overview"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-300 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live Sync Active
          </span>
        </div>
      </div>

      {isLoading || !data ? (
        // Skeleton Loader State
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-28 bg-white border border-[#e3e2e2] p-4 space-y-3 animate-pulse">
                <div className="h-4 bg-[#f5f3f3] w-1/2" />
                <div className="h-6 bg-[#f5f3f3] w-3/4" />
              </div>
            ))}
          </div>
          <div className="h-64 bg-white border border-[#e3e2e2] p-6 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* SECTION 2: BUSINESS SUMMARY CARDS (8 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                title: 'Total Revenue',
                value: `৳${data.summary.totalRevenue.toLocaleString('en-BD')}`,
                desc: 'Net confirmed sales',
                icon: DollarSign,
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
              },
              {
                title: 'Total Orders',
                value: data.summary.totalOrders.toLocaleString('en-BD'),
                desc: 'Customer checkout orders',
                icon: ShoppingBag,
                color: 'text-blue-700 bg-blue-50 border-blue-200',
              },
              {
                title: 'Pending Orders',
                value: data.summary.pendingOrders.toLocaleString('en-BD'),
                desc: 'Awaiting fulfillment',
                icon: Clock,
                color: 'text-amber-700 bg-amber-50 border-amber-200',
              },
              {
                title: 'Delivered Orders',
                value: data.summary.deliveredOrders.toLocaleString('en-BD'),
                desc: 'Completed deliveries',
                icon: CheckCircle2,
                color: 'text-purple-700 bg-purple-50 border-purple-200',
              },
              {
                title: 'Total Products',
                value: data.summary.totalProducts.toLocaleString('en-BD'),
                desc: 'Active store catalog',
                icon: Package,
                color: 'text-slate-700 bg-slate-100 border-slate-200',
              },
              {
                title: 'Total Customers',
                value: data.summary.totalCustomers.toLocaleString('en-BD'),
                desc: 'Registered accounts',
                icon: Users,
                color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
              },
              {
                title: 'Active Coupons',
                value: data.summary.activeCoupons.toLocaleString('en-BD'),
                desc: 'Live promotional vouchers',
                icon: Ticket,
                color: 'text-teal-700 bg-teal-50 border-teal-200',
              },
              {
                title: 'Low Stock Items',
                value: data.summary.lowStockCount.toLocaleString('en-BD'),
                desc: 'Stock <= 5 units',
                icon: AlertTriangle,
                color: data.summary.lowStockCount > 0 ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-slate-700 bg-slate-100 border-slate-200',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white border border-[#e3e2e2] p-4 space-y-2.5 hover:border-[#1b1c1c] transition shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5e5e5b]">
                      {card.title}
                    </span>
                    <div className={`p-1.5 border ${card.color}`}>
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-xl font-semibold text-[#1b1c1c]">
                      {card.value}
                    </div>
                    <div className="text-[10px] text-[#5e5e5b]">{card.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 3: REVENUE OVERVIEW & CHART */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#1b1c1c] flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-700 stroke-[1.5]" />
                  Revenue Analytics
                </h2>
                <p className="text-xs text-[#5e5e5b]">Track sales metrics over time.</p>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-2.5 text-center">
                  <span className="text-[10px] text-[#5e5e5b] uppercase font-bold block">Today</span>
                  <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                    ৳{data.revenueOverview.today.toLocaleString('en-BD')}
                  </span>
                </div>
                <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-2.5 text-center">
                  <span className="text-[10px] text-[#5e5e5b] uppercase font-bold block">7 Days</span>
                  <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                    ৳{data.revenueOverview.last7Days.toLocaleString('en-BD')}
                  </span>
                </div>
                <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-2.5 text-center">
                  <span className="text-[10px] text-[#5e5e5b] uppercase font-bold block">30 Days</span>
                  <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                    ৳{data.revenueOverview.last30Days.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Revenue Bar Chart */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#1b1c1c]">Daily Revenue Trend (Last 7 Days)</div>
              <div className="h-40 flex items-end gap-3 border-b border-[#e3e2e2] pb-2 pt-4">
                {data.revenueOverview.chartData.map((bar) => {
                  const heightPercent = Math.max(Math.round((bar.amount / maxRevenueInChart) * 100), 4);
                  return (
                    <div key={bar.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono text-[#5e5e5b] opacity-0 group-hover:opacity-100 transition">
                        ৳{bar.amount.toLocaleString('en-BD')}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-[#1b1c1c] hover:bg-amber-800 transition rounded-none"
                        title={`${bar.label}: ৳${bar.amount}`}
                      />
                      <span className="text-[10px] text-[#5e5e5b] font-medium truncate w-full text-center">
                        {bar.label.split(',')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 4 & SECTION 5: RECENT ORDERS & LOW STOCK PRODUCTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders (2 Cols) */}
            <div className="lg:col-span-2 bg-white border border-[#e3e2e2] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Recent Customer Orders</h2>
                  <p className="text-xs text-[#5e5e5b]">Latest placed orders requiring fulfillment.</p>
                </div>
                <Link
                  href="/dashboard/orders"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
                >
                  View All Orders
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                        <th className="p-3 font-semibold">Order No</th>
                        <th className="p-3 font-semibold">Customer</th>
                        <th className="p-3 font-semibold">Total</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Payment</th>
                        <th className="p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e2e2]">
                      {data.recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#fbf9f8] transition">
                          <td className="p-3 font-mono font-bold text-[#1b1c1c]">{ord.orderNumber}</td>
                          <td className="p-3">
                            <div className="font-semibold text-[#1b1c1c]">{ord.customerName}</div>
                            <div className="text-[10px] text-[#5e5e5b]">{ord.customerPhone}</div>
                          </td>
                          <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                            ৳{ord.totalAmount.toLocaleString('en-BD')}
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 border border-current bg-amber-50 text-amber-800">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 uppercase text-[#5e5e5b] font-medium">{ord.paymentMethod}</td>
                          <td className="p-3 text-[11px] text-[#5e5e5b]">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#fbf9f8] border border-dashed border-[#e3e2e2] space-y-2">
                  <ShoppingBag className="h-6 w-6 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                  <div className="font-semibold text-xs text-[#1b1c1c]">No Orders Placed Yet</div>
                  <p className="text-xs text-[#5e5e5b] max-w-xs mx-auto">
                    Customer orders will automatically populate here after checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Low Stock Alerts (1 Col) */}
            <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-[#1b1c1c] flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 stroke-[1.5]" />
                    Low Stock Alerts
                  </h2>
                  <p className="text-xs text-[#5e5e5b]">Inventory running low.</p>
                </div>
                <Link
                  href="/dashboard/products"
                  className="text-xs font-semibold uppercase text-[#1b1c1c] hover:underline"
                >
                  Products
                </Link>
              </div>

              {data.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {data.lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 border border-[#e3e2e2] bg-[#fbf9f8] hover:border-[#1b1c1c] transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {p.coverImage ? (
                          <Image src={p.coverImage} alt={p.name} width={36} height={36} className="object-cover h-9 w-9 border border-[#e3e2e2] shrink-0" />
                        ) : (
                          <div className="h-9 w-9 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-[#5e5e5b]" />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-xs text-[#1b1c1c] truncate">{p.name}</div>
                          <div className="text-[10px] font-mono text-[#5e5e5b]">SKU: {p.sku}</div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold border uppercase shrink-0 ${p.stock <= 3
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                      >
                        {p.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#fbf9f8] border border-dashed border-[#e3e2e2] space-y-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto stroke-[1.5]" />
                  <div className="font-semibold text-xs text-[#1b1c1c]">Stock Levels Healthy</div>
                  <p className="text-xs text-[#5e5e5b]">No products are currently critically low on inventory.</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 6 & SECTION 7: TOP SELLING PRODUCTS & RECENT CUSTOMERS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
              <div className="border-b border-[#e3e2e2] pb-4">
                <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Top Selling Handloom Lungis</h2>
                <p className="text-xs text-[#5e5e5b]">Products generating highest volume and revenue.</p>
              </div>

              {data.topSellingProducts.length > 0 ? (
                <div className="space-y-3">
                  {data.topSellingProducts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-[#e3e2e2] bg-[#fbf9f8]">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover h-10 w-10 border border-[#e3e2e2] shrink-0" />
                        ) : (
                          <div className="h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-[#5e5e5b]" />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-xs text-[#1b1c1c] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#5e5e5b]">{item.unitsSold} units sold</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-display text-sm font-semibold text-[#1b1c1c]">
                          ৳{item.revenue.toLocaleString('en-BD')}
                        </div>
                        <div className="text-[10px] text-[#5e5e5b]">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#fbf9f8] border border-dashed border-[#e3e2e2] space-y-2">
                  <Package className="h-6 w-6 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                  <div className="font-semibold text-xs text-[#1b1c1c]">No Sales Data Recorded</div>
                  <p className="text-xs text-[#5e5e5b]">Top selling products will appear here as orders are placed.</p>
                </div>
              )}
            </div>

            {/* Recent Customers */}
            <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
                <div>
                  <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Recently Registered Customers</h2>
                  <p className="text-xs text-[#5e5e5b]">Newest buyers joined the platform.</p>
                </div>
                <Link
                  href="/dashboard/customers"
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
                >
                  View All Customers
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.recentCustomers.length > 0 ? (
                <div className="space-y-3">
                  {data.recentCustomers.map((cust) => (
                    <div key={cust.id} className="flex items-center justify-between p-3 border border-[#e3e2e2] bg-[#fbf9f8]">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {cust.avatarUrl ? (
                          <Image src={cust.avatarUrl} alt={cust.name} width={36} height={36} className="rounded-full object-cover h-9 w-9 border border-[#e3e2e2] shrink-0" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-[#1b1c1c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="font-semibold text-xs text-[#1b1c1c] truncate">{cust.name}</div>
                          <div className="text-[10px] text-[#5e5e5b] truncate">{cust.email}</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#5e5e5b] shrink-0">
                        Joined {new Date(cust.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#fbf9f8] border border-dashed border-[#e3e2e2] space-y-2">
                  <UserCheck className="h-6 w-6 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                  <div className="font-semibold text-xs text-[#1b1c1c]">No Registered Customers</div>
                  <p className="text-xs text-[#5e5e5b]">Newly registered customer accounts will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 8: QUICK ACTIONS */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Quick Administrative Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Add Product', href: '/dashboard/products', icon: Plus },
                { label: 'Add Category', href: '/dashboard/categories', icon: Grid },
                { label: 'Add Collection', href: '/dashboard/collections', icon: Layers },
                { label: 'View Orders', href: '/dashboard/orders', icon: ShoppingBag },
                // { label: 'Create Coupon', href: '/dashboard/coupons', icon: Ticket },
                { label: 'Store Settings', href: '/dashboard/settings', icon: Settings },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <Link
                    key={act.label}
                    href={act.href}
                    className="p-3 border border-[#e3e2e2] bg-[#fbf9f8] hover:bg-[#1b1c1c] hover:text-white text-[#1b1c1c] flex flex-col items-center justify-center gap-2 text-center transition group"
                  >
                    <Icon className="h-5 w-5 stroke-[1.5] group-hover:text-white" />
                    <span className="text-xs font-semibold">{act.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* SECTION 9: STORE SYSTEM STATUS */}
          <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-[#1b1c1c]">Platform Infrastructure Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'MongoDB Database',
                  status: data.systemStatus.dbConnected ? 'Connected' : 'Disconnected',
                  ok: data.systemStatus.dbConnected,
                  icon: Database,
                },
                {
                  label: 'Authentication Engine',
                  status: data.systemStatus.authWorking ? 'NextAuth Active' : 'Issue',
                  ok: data.systemStatus.authWorking,
                  icon: ShieldCheck,
                },
                {
                  label: 'Google OAuth SSO',
                  status: data.systemStatus.googleLoginEnabled ? 'Enabled' : 'Not Configured',
                  ok: data.systemStatus.googleLoginEnabled,
                  icon: Globe,
                },
                {
                  label: 'Cloudinary CDN',
                  status: data.systemStatus.mediaConnected ? 'Connected' : 'Not Configured',
                  ok: data.systemStatus.mediaConnected,
                  icon: ImageIcon,
                },
              ].map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.label} className="p-3 border border-[#e3e2e2] bg-[#fbf9f8] flex items-center gap-3">
                    <div className={`p-2 border ${st.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      <Icon className="h-4 w-4 stroke-[1.5]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#1b1c1c]">{st.label}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${st.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {st.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 10: EMPTY STATE PROMPT FOR NEW STORES */}
          {data.summary.totalProducts === 0 && (
            <div className="p-8 bg-amber-50 border border-amber-200 space-y-3">
              <h3 className="font-display text-base font-semibold text-amber-900">Welcome to Nobab Lungi Admin!</h3>
              <p className="text-xs text-amber-800 max-w-xl">
                Your store inventory is currently empty. Start by creating categories and adding your first handloom lungi product to publish items to the storefront catalog.
              </p>
              <div className="flex gap-3 pt-1">
                <Link href="/dashboard/products" className="bg-amber-900 text-white text-xs font-semibold py-2 px-4 hover:bg-amber-800 transition">
                  Create First Product
                </Link>
                <Link href="/dashboard/categories" className="bg-white text-amber-900 border border-amber-300 text-xs font-semibold py-2 px-4 hover:bg-amber-100 transition">
                  Create Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
