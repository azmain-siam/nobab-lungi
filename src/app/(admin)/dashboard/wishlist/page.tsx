import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAdminWishlistInsightsAction } from '@/actions/wishlist';
import {
  Heart,
  Users,
  Package,
  AlertTriangle,
  ExternalLink,
  Eye,
  ShoppingBag,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Wishlist Insights — Nabab Admin',
  description: 'Understand customer demand, saved favorites, and restocking priorities.',
};

export default async function AdminWishlistInsightsPage() {
  const res = await getAdminWishlistInsightsAction();
  const insights = res.insights || {
    total_saves: 0,
    unique_customers: 0,
    wishlisted_products_count: 0,
    high_demand_low_stock_count: 0,
    most_wishlisted_products: [],
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Header */}
      <div>
        {/* <AdminBreadcrumbs /> */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1b1c1c] tracking-tight">
              Wishlist Insights
            </h1>
            <p className="text-xs text-[#5e5e5b] mt-1">
              Customer demand analytics and restocking signals for Nabab Lungi.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Total Saves */}
        <div className="bg-white border border-[#e3e2e2] p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
              Total Saves
            </span>
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-600">
              <Heart className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#1b1c1c]">
            {insights.total_saves.toLocaleString('en-BD')}
          </p>
          <p className="text-[11px] text-[#5e5e5b]">Saved items across all customer accounts</p>
        </div>

        {/* Stat 2: Unique Customers */}
        <div className="bg-white border border-[#e3e2e2] p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
              Interested Customers
            </span>
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700">
              <Users className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#1b1c1c]">
            {insights.unique_customers.toLocaleString('en-BD')}
          </p>
          <p className="text-[11px] text-[#5e5e5b]">Active customers with items in wishlist</p>
        </div>

        {/* Stat 3: Wishlisted Products */}
        <div className="bg-white border border-[#e3e2e2] p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
              Wishlisted Styles
            </span>
            <div className="p-2 bg-amber-50 border border-amber-200 text-amber-700">
              <Package className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-[#1b1c1c]">
            {insights.wishlisted_products_count.toLocaleString('en-BD')}
          </p>
          <p className="text-[11px] text-[#5e5e5b]">Distinct product styles saved</p>
        </div>

        {/* Stat 4: High Demand Low Stock */}
        <div className="bg-white border border-[#e3e2e2] p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
              Needs Restock
            </span>
            <div className="p-2 bg-amber-100 border border-amber-300 text-amber-900">
              <AlertTriangle className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-amber-800">
            {insights.high_demand_low_stock_count.toLocaleString('en-BD')}
          </p>
          <p className="text-[11px] text-[#5e5e5b]">High wishlist interest + low stock items</p>
        </div>
      </div>

      {/* Restocking Demand Callout */}
      {insights.high_demand_low_stock_count > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Restock Alert: {insights.high_demand_low_stock_count} Products Require Attention
              </h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                These items have high customer wishlist saves but low inventory count (≤ 5 items remaining).
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-amber-950 transition whitespace-nowrap"
          >
            <span>Update Inventory</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Most Wishlisted Products Table */}
      <div className="bg-white border border-[#e3e2e2] space-y-4">
        <div className="p-6 border-b border-[#e3e2e2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
              Most Wishlisted Products
            </h2>
            <p className="text-xs text-[#5e5e5b] mt-0.5">
              Ranked by total customer wishlist saves
            </p>
          </div>
        </div>

        {insights.most_wishlisted_products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4 text-center">Wishlist Saves</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-center">Current Stock</th>
                  <th className="py-3.5 px-4 text-center">Demand Signal</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {insights.most_wishlisted_products.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbf9f8]/60 transition">
                    {/* Product Name & Image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-[#efeded] border border-[#e3e2e2]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.id}`}
                            target="_blank"
                            className="font-semibold text-[#1b1c1c] hover:underline block text-xs"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[10px] text-[#5e5e5b] uppercase font-mono">
                            ID: {item.id.substring(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Wishlist Saves */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 border border-rose-200">
                        <Heart className="h-3 w-3 fill-current" />
                        {item.wishlist_count} saves
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-semibold text-[#1b1c1c]">
                      ৳{item.price.toLocaleString('en-BD')}
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4 text-center">
                      {item.stock > 5 ? (
                        <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 border border-emerald-200 text-[10px]">
                          {item.stock} in stock
                        </span>
                      ) : item.stock > 0 ? (
                        <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 border border-amber-200 text-[10px]">
                          Low stock: {item.stock} left
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 border border-rose-200 text-[10px]">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Demand Signal */}
                    <td className="py-4 px-4 text-center">
                      {item.is_high_demand_low_stock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 border border-amber-300">
                          <AlertTriangle className="h-3 w-3 text-amber-800" />
                          High Demand + Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#5e5e5b]">Normal Demand</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${item.id}`}
                          target="_blank"
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3] border border-[#e3e2e2] transition"
                          title="View Product Page"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2 text-[#5e5e5b]">
            <ShoppingBag className="h-8 w-8 mx-auto stroke-[1.2]" />
            <p className="text-xs">No wishlist activity recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
