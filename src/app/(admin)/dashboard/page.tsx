import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingBag, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Nabab Lungi',
  description: 'Merchant dashboard metrics, recent orders, and store analytics.',
};

const METRICS = [
  {
    title: 'Total Revenue',
    value: '৳1,48,500',
    change: '+14% vs last month',
    icon: DollarSign,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Total Orders',
    value: '42',
    change: '+8 new today',
    icon: ShoppingBag,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    title: 'Active Products',
    value: '18',
    change: '4 Collections',
    icon: Package,
    color: 'text-[#1b1c1c] bg-[#efeded] border-[#e3e2e2]',
  },
  {
    title: 'Low Stock Alerts',
    value: '2 Items',
    change: 'Action required',
    icon: AlertTriangle,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];

const RECENT_ORDERS = [
  {
    id: 'NL-849201',
    customer: 'Rafiqul Islam',
    phone: '01712345678',
    area: 'Inside Dhaka',
    total: '৳2,510',
    method: 'COD',
    status: 'Delivered',
    date: '2026-07-28',
  },
  {
    id: 'NL-710492',
    customer: 'Tanvir Hossain',
    phone: '01898765432',
    area: 'Outside Dhaka',
    total: '৳6,110',
    method: 'bKash',
    status: 'Processing',
    date: '2026-07-28',
  },
  {
    id: 'NL-602914',
    customer: 'Kamrul Hasan',
    phone: '01911223344',
    area: 'Inside Dhaka',
    total: '৳1,960',
    method: 'COD',
    status: 'Pending',
    date: '2026-07-27',
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Merchant Overview
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Welcome back, Admin. Here is your daily store performance summary.
          </p>
        </div>
        <Badge variant="pill">Live Data Sync</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white border border-[#e3e2e2] p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5e5e5b] uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className={`p-2 border ${metric.color}`}>
                  <Icon className="h-4 w-4 stroke-[1.5]" />
                </div>
              </div>

              <div>
                <div className="font-display text-2xl font-semibold text-[#1b1c1c]">
                  {metric.value}
                </div>
                <div className="text-[11px] font-medium text-[#5e5e5b] mt-1">
                  {metric.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#e3e2e2] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-4">
          <div>
            <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#5e5e5b]">
              Latest customer purchases requiring processing.
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
          >
            View All Orders
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                <th className="p-3 font-semibold">Order ID</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Payment</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2]">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-[#fbf9f8]">
                  <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                    {order.id}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#1b1c1c]">
                      {order.customer}
                    </div>
                    <div className="text-[10px] text-[#5e5e5b]">{order.phone}</div>
                  </td>
                  <td className="p-3 text-[#5e5e5b]">{order.area}</td>
                  <td className="p-3 text-[#1b1c1c] font-medium">{order.method}</td>
                  <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                    {order.total}
                  </td>
                  <td className="p-3">
                    {order.status === 'Delivered' ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Delivered
                      </span>
                    ) : order.status === 'Processing' ? (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
                        Processing
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
