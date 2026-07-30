'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { Search, Eye, ShoppingCart, Download } from 'lucide-react';

interface MockOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: 'Inside Dhaka' | 'Outside Dhaka';
  paymentMethod: 'COD' | 'bKash' | 'Nagad';
  paymentStatus: 'Unpaid' | 'Paid' | 'Pending Verification';
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'NL-849201',
    customerName: 'Rafiqul Islam',
    customerPhone: '01712345678',
    deliveryArea: 'Inside Dhaka',
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 2510,
    status: 'Delivered',
    date: '2026-07-28',
  },
  {
    id: 'NL-710492',
    customerName: 'Tanvir Hossain',
    customerPhone: '01898765432',
    deliveryArea: 'Outside Dhaka',
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    total: 6110,
    status: 'Processing',
    date: '2026-07-28',
  },
  {
    id: 'NL-602914',
    customerName: 'Kamrul Hasan',
    customerPhone: '01911223344',
    deliveryArea: 'Inside Dhaka',
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    total: 1960,
    status: 'Pending',
    date: '2026-07-27',
  },
  {
    id: 'NL-548102',
    customerName: 'Nusrat Jahan',
    customerPhone: '01755443322',
    deliveryArea: 'Outside Dhaka',
    paymentMethod: 'Nagad',
    paymentStatus: 'Paid',
    total: 4200,
    status: 'Shipped',
    date: '2026-07-26',
  },
];

const STATUS_TABS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);

    const matchesStatus = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}.`);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Order Fulfillment
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Review customer orders, update delivery status, and verify bKash / COD payments.
          </p>
        </div>

        <Button type="button" variant="secondary" size="md" className="gap-2 self-start sm:self-auto text-xs">
          <Download className="h-4 w-4" />
          Export Orders CSV
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e3e2e2] overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#1b1c1c] text-white'
                : 'text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#f5f3f3]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer Name, or Phone..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        <div className="text-xs text-[#5e5e5b] hidden sm:block">
          Showing <span className="font-semibold text-[#1b1c1c]">{filteredOrders.length}</span> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Delivery Area</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">{order.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#1b1c1c]">{order.customerName}</div>
                      <div className="text-[10px] text-[#5e5e5b]">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 text-[#5e5e5b]">{order.deliveryArea}</td>
                    <td className="p-4">
                      <span className="font-semibold text-[#1b1c1c]">{order.paymentMethod}</span>
                      <span className="block text-[10px] text-[#5e5e5b]">{order.paymentStatus}</span>
                    </td>
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                      ৳{order.total.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[11px] font-semibold py-1 px-2 border rounded-none cursor-pointer focus:outline-none ${
                          order.status === 'Delivered'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : order.status === 'Shipped'
                            ? 'text-blue-700 bg-blue-50 border-blue-200'
                            : order.status === 'Processing'
                            ? 'text-cyan-700 bg-cyan-50 border-cyan-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 stroke-[1.5]" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
              No customer orders match the selected filter status or search term.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
