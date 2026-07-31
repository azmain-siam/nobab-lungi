'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  fetchAdminCustomersAction,
  fetchCustomerDetailsAction,
} from '@/features/dashboard/actions/customer-actions';
import type { CustomerListItem, CustomerDetails } from '@/types';
import {
  Users,
  Search,
  Filter,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  MapPin,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function AdminCustomersPage() {
  // Customers List State
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer / Detail View State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchCustomers = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch Customers Effect
  useEffect(() => {
    let isMounted = true;

    fetchAdminCustomersAction({
      search: searchQuery,
      filter: filterBy,
      sort: sortBy,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setCustomers(res.customers);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching admin customers:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, filterBy, sortBy, currentPage, refreshKey]);

  // Fetch Customer Details Effect
  useEffect(() => {
    if (!selectedCustomerId) return;

    let isMounted = true;
    fetchCustomerDetailsAction(selectedCustomerId)
      .then((res) => {
        if (isMounted) {
          setCustomerDetails(res);
          setIsDetailLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching customer details:', error);
        if (isMounted) setIsDetailLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCustomerId]);

  return (
    <>
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
            <Users className="h-6 w-6 stroke-[1.5] text-amber-800" />
            Customer Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            View registered customer profiles, purchasing metrics, saved addresses, and order history snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchCustomers()}
            disabled={isLoading}
            className="p-2.5"
            title="Refresh Customer List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters & Search Controls Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer name, email, or phone number..."
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#5e5e5b]">
              <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">Segment Filter:</span>
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Customers</option>
              <option value="with_orders">Customers With Orders</option>
              <option value="without_orders">Customers Without Orders</option>
              <option value="new_customers">New Customers (30 Days)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer font-medium"
            >
              <option value="newest">Sort: Newest Registered</option>
              <option value="oldest">Sort: Oldest Registered</option>
              <option value="most_orders">Most Orders Placed</option>
              <option value="highest_spent">Highest Total Spending (৳)</option>
              <option value="alphabetical">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Contact Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Total Orders</th>
                  <th className="p-4 font-semibold">Total Spent</th>
                  <th className="p-4 font-semibold">Last Order Date</th>
                  <th className="p-4 font-semibold">Registration Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {c.avatar_url ? (
                            <Image
                              src={c.avatar_url}
                              alt={c.name}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            c.name.slice(0, 2)
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1b1c1c]">{c.name}</div>
                          <div className="text-[10px] text-[#5e5e5b]">ID: {c.id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#1b1c1c]">{c.email}</td>
                    <td className="p-4 font-mono text-[#1b1c1c]">{c.phone || 'N/A'}</td>
                    <td className="p-4 font-semibold text-[#1b1c1c]">{c.total_orders} orders</td>
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                      ৳{c.total_spent.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4 text-[11px] text-[#5e5e5b]">
                      {c.last_order_date
                        ? new Date(c.last_order_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'No orders yet'}
                    </td>
                    <td className="p-4 text-[11px] text-[#5e5e5b]">
                      {new Date(c.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 uppercase">
                        {c.account_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedCustomerId(c.id)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Button>
                    </td>
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
              No registered customer profiles match your search criteria or segment filter.
            </p>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {customers.length} of {total} registered customers
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-semibold text-[#1b1c1c]">
                Page {currentPage} of {pages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                disabled={currentPage === pages || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Slide-Over Drawer */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSelectedCustomerId(null)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-bold text-[#1b1c1c]">Customer Details Overview</h2>
                <p className="text-xs text-[#5e5e5b]">Secure administrator profile & purchasing history snapshot.</p>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isDetailLoading ? (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#5e5e5b]" />
                  <p className="text-xs text-[#5e5e5b]">Loading customer statistics & address records...</p>
                </div>
              ) : customerDetails ? (
                <>
                  {/* Profile Overview Card */}
                  <div className="bg-[#fbf9f8] border border-[#e3e2e2] p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                        {customerDetails.name.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-[#1b1c1c] flex items-center gap-2">
                          {customerDetails.name}
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 uppercase">
                            Active
                          </span>
                        </h3>
                        <div className="text-xs text-[#5e5e5b] space-y-0.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" /> {customerDetails.email}
                          </div>
                          {customerDetails.phone && (
                            <div className="flex items-center gap-1.5 font-mono">
                              <Phone className="h-3.5 w-3.5" /> {customerDetails.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="h-3.5 w-3.5" /> Registered: {new Date(customerDetails.created_at).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right border-l border-[#e3e2e2] pl-4 hidden sm:block">
                      <ShieldCheck className="h-6 w-6 text-emerald-600 ml-auto stroke-[1.5]" />
                      <span className="text-[10px] text-[#5e5e5b] uppercase block font-semibold mt-1">Secured Profile</span>
                    </div>
                  </div>

                  {/* Order Statistics KPI Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#e3e2e2] p-3 text-center">
                      <ShoppingBag className="h-4 w-4 text-amber-800 mx-auto mb-1 stroke-[1.5]" />
                      <div className="font-display text-base font-bold text-[#1b1c1c]">
                        {customerDetails.stats.total_orders}
                      </div>
                      <div className="text-[10px] text-[#5e5e5b] uppercase font-semibold">Total Orders</div>
                    </div>

                    <div className="bg-white border border-[#e3e2e2] p-3 text-center">
                      <CreditCard className="h-4 w-4 text-emerald-700 mx-auto mb-1 stroke-[1.5]" />
                      <div className="font-display text-base font-bold text-[#1b1c1c]">
                        ৳{customerDetails.stats.total_spent.toLocaleString('en-BD')}
                      </div>
                      <div className="text-[10px] text-[#5e5e5b] uppercase font-semibold">Total Spent</div>
                    </div>

                    <div className="bg-white border border-[#e3e2e2] p-3 text-center">
                      <TrendingUp className="h-4 w-4 text-indigo-700 mx-auto mb-1 stroke-[1.5]" />
                      <div className="font-display text-base font-bold text-[#1b1c1c]">
                        ৳{customerDetails.stats.avg_order_value.toLocaleString('en-BD')}
                      </div>
                      <div className="text-[10px] text-[#5e5e5b] uppercase font-semibold">Avg Order Value</div>
                    </div>

                    <div className="bg-white border border-[#e3e2e2] p-3 text-center">
                      <Calendar className="h-4 w-4 text-purple-700 mx-auto mb-1 stroke-[1.5]" />
                      <div className="font-mono text-xs font-bold text-[#1b1c1c] mt-1">
                        {customerDetails.stats.last_order_date
                          ? new Date(customerDetails.stats.last_order_date).toLocaleDateString('en-GB')
                          : 'None'}
                      </div>
                      <div className="text-[10px] text-[#5e5e5b] uppercase font-semibold mt-1">Last Order Date</div>
                    </div>
                  </div>

                  {/* Shipping Addresses Section */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5 border-b border-[#e3e2e2] pb-2">
                      <MapPin className="h-4 w-4 text-[#5e5e5b]" />
                      Customer Saved Delivery Addresses ({customerDetails.addresses.length})
                    </h3>

                    {customerDetails.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {customerDetails.addresses.map((addr) => (
                          <div key={addr.id} className="p-3 border border-[#e3e2e2] bg-[#fbf9f8] space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#1b1c1c]">{addr.name}</span>
                              {addr.is_default && (
                                <span className="text-[9px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-1.5 py-0.5 uppercase">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-[#5e5e5b]">{addr.phone}</div>
                            <div className="text-[11px] text-[#1b1c1c]">
                              {addr.address} ({addr.district})
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] text-center text-xs text-[#5e5e5b]">
                        No saved delivery address on record yet.
                      </div>
                    )}
                  </div>

                  {/* Recent Orders History Snapshot */}
                  <div className="space-y-3 pt-2 border-t border-[#e3e2e2]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-[#5e5e5b]" />
                      Recent Order History ({customerDetails.recent_orders.length})
                    </h3>

                    {customerDetails.recent_orders.length > 0 ? (
                      <div className="border border-[#e3e2e2] divide-y divide-[#e3e2e2]">
                        {customerDetails.recent_orders.map((o) => (
                          <div key={o.id} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                            <div>
                              <div className="font-mono font-bold text-[#1b1c1c]">{o.order_number}</div>
                              <div className="text-[10px] text-[#5e5e5b]">
                                {new Date(o.created_at).toLocaleString('en-BD')} • {o.order_items.length} items
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 border uppercase bg-amber-50 text-amber-800 border-amber-300">
                                {o.status}
                              </span>
                              <span className="font-display font-bold text-[#1b1c1c]">
                                ৳{o.total.toLocaleString('en-BD')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 border border-[#e3e2e2] bg-[#fbf9f8] text-center text-xs text-[#5e5e5b]">
                        Customer has not placed any orders yet.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-red-600">
                  Failed to load customer profile details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
