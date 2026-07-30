'use client';

import { useState } from 'react';
import { Search, Users, ShieldCheck, Mail, Phone } from 'lucide-react';

interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: 'user-1',
    name: 'Rafiqul Islam',
    email: 'rafiqul@example.com',
    phone: '01712345678',
    role: 'customer',
    totalOrders: 4,
    totalSpent: 9800,
    createdAt: '2026-06-15',
  },
  {
    id: 'user-2',
    name: 'Tanvir Hossain',
    email: 'tanvir@example.com',
    phone: '01898765432',
    role: 'customer',
    totalOrders: 2,
    totalSpent: 7500,
    createdAt: '2026-06-20',
  },
  {
    id: 'user-3',
    name: 'Nobab Admin',
    email: 'admin@nobablungi.com',
    phone: '01700000000',
    role: 'admin',
    totalOrders: 0,
    totalSpent: 0,
    createdAt: '2026-05-01',
  },
  {
    id: 'user-4',
    name: 'Nusrat Jahan',
    email: 'nusrat@example.com',
    phone: '01755443322',
    role: 'customer',
    totalOrders: 1,
    totalSpent: 4200,
    createdAt: '2026-07-10',
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Customer Directory
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Registered customer profiles, role assignments, and order activity stats.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#e3e2e2] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Orders</th>
                  <th className="p-4 font-semibold">Total Spent</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4">
                      <div className="font-semibold text-[#1b1c1c]">{cust.name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[#1b1c1c]">
                        <Mail className="h-3.5 w-3.5 text-[#5e5e5b]" />
                        {cust.email}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#5e5e5b] mt-0.5">
                        <Phone className="h-3 w-3 text-[#5e5e5b]" />
                        {cust.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      {cust.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 uppercase tracking-wider">
                          <ShieldCheck className="h-3 w-3 stroke-[2]" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#5e5e5b] bg-[#f5f3f3] px-2 py-0.5 border border-[#e3e2e2] uppercase">
                          CUSTOMER
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-[#1b1c1c]">{cust.totalOrders} Orders</td>
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                      ৳{cust.totalSpent.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4 text-[#5e5e5b]">{cust.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Users className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Customers Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No registered user matches your search query.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
