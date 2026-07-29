'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Search, CreditCard } from 'lucide-react';

interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  deliveryArea: string;
  address: string;
  items: string;
  paymentMethod: 'COD' | 'bKash';
  transactionId?: string;
  total: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
}

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'NL-849201',
    customerName: 'Rafiqul Islam',
    phone: '01712345678',
    deliveryArea: 'Inside Dhaka',
    address: 'House 42, Road 11, Banani, Dhaka-1213',
    items: 'Midnight Indigo Lungi x 1',
    paymentMethod: 'COD',
    total: '৳2,510',
    status: 'Delivered',
    date: '2026-07-28',
  },
  {
    id: 'NL-710492',
    customerName: 'Tanvir Hossain',
    phone: '01898765432',
    deliveryArea: 'Outside Dhaka',
    address: 'Holding 88, Station Road, Pabna Sadar',
    items: 'Charcoal Silk Weave x 1, Heritage Check x 1',
    paymentMethod: 'bKash',
    transactionId: '9B7X12K90',
    total: '৳6,110',
    status: 'Processing',
    date: '2026-07-28',
  },
  {
    id: 'NL-602914',
    customerName: 'Kamrul Hasan',
    phone: '01911223344',
    deliveryArea: 'Inside Dhaka',
    address: 'Flat 4B, Green Road, Dhanmondi, Dhaka',
    items: 'Classic White Cotton x 2',
    paymentMethod: 'COD',
    total: '৳1,960',
    status: 'Pending',
    date: '2026-07-27',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  const handleStatusChange = (orderId: string, newStatus: OrderRecord['status']) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Order Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Verify customer payments, update delivery fulfillment statuses, and manage dispatches.
          </p>
        </div>
        <Badge variant="pill">{orders.length} Total Orders</Badge>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name, or phone..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-3 text-xs text-[#1b1c1c] focus:border-[#1b1c1c] focus:outline-none"
          />
        </div>
        <span className="text-xs text-[#5e5e5b]">
          Showing <strong>{filteredOrders.length}</strong> Orders
        </span>
      </div>

      {/* Orders List Table */}
      <div className="bg-white border border-[#e3e2e2] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
              <th className="p-3 font-semibold">Order Details</th>
              <th className="p-3 font-semibold">Customer &amp; Shipping</th>
              <th className="p-3 font-semibold">Line Items</th>
              <th className="p-3 font-semibold">Payment Info</th>
              <th className="p-3 font-semibold">Grand Total</th>
              <th className="p-3 font-semibold">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e2]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#fbf9f8]">
                <td className="p-3">
                  <div className="font-display font-semibold text-[#1b1c1c]">
                    {order.id}
                  </div>
                  <div className="text-[10px] text-[#5e5e5b]">{order.date}</div>
                </td>
                <td className="p-3">
                  <div className="font-semibold text-[#1b1c1c]">
                    {order.customerName}
                  </div>
                  <div className="text-[10px] text-[#5e5e5b]">
                    {order.phone} • {order.deliveryArea}
                  </div>
                  <div className="text-[10px] text-[#5e5e5b] max-w-xs line-clamp-1">
                    {order.address}
                  </div>
                </td>
                <td className="p-3 text-[#1b1c1c] font-medium max-w-xs">
                  {order.items}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1b1c1c]">
                    <CreditCard className="h-3.5 w-3.5 text-[#5e5e5b]" />
                    {order.paymentMethod}
                  </div>
                  {order.transactionId && (
                    <div className="text-[10px] text-[#5e5e5b] font-mono mt-0.5">
                      TrxID: {order.transactionId}
                    </div>
                  )}
                </td>
                <td className="p-3 font-display font-semibold text-[#1b1c1c]">
                  {order.total}
                </td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as OrderRecord['status']
                      )
                    }
                    className={`text-xs font-semibold px-2 py-1 border rounded-none focus:outline-none cursor-pointer ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : order.status === 'Shipped'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : order.status === 'Processing'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="Pending">⌛ Pending</option>
                    <option value="Processing">⚙️ Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✓ Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
