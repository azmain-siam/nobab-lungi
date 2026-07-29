import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { AccountSidebar } from '@/components/shared/account-sidebar';
import { Package, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order History — Nabab Lungi',
  description: 'View your order history, track deliveries, and view invoices.',
};

const MOCK_ORDERS = [
  {
    id: 'NL-849201',
    date: '2026-07-28',
    status: 'Delivered',
    statusColor: 'emerald',
    items: 'Midnight Indigo Lungi x 1',
    total: '৳2,510',
  },
  {
    id: 'NL-710492',
    date: '2026-07-20',
    status: 'Processing',
    statusColor: 'blue',
    items: 'Charcoal Silk Weave x 1, Heritage Check x 1',
    total: '৳6,110',
  },
  {
    id: 'NL-602914',
    date: '2026-07-12',
    status: 'Delivered',
    statusColor: 'emerald',
    items: 'Classic White Cotton x 2',
    total: '৳1,960',
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />

        <main>
          <Section variant="default" className="py-12 lg:py-16">
            <Container>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl mb-8">
                My Account
              </h1>

              <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
                <AccountSidebar />

                <div className="flex-1 bg-white border border-[#e3e2e2] p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#e3e2e2] pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                        Order History
                      </h2>
                      <p className="text-xs font-light text-[#5e5e5b] mt-1">
                        Track past and current orders placed with Nabab Lungi.
                      </p>
                    </div>
                    <Badge variant="pill">{MOCK_ORDERS.length} Orders</Badge>
                  </div>

                  <div className="space-y-4">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.id}
                        className="border border-[#e3e2e2] p-5 space-y-3 bg-[#fbf9f8]/60 hover:bg-white transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e2e2] pb-3">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#1b1c1c] stroke-[1.5]" />
                            <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                              Order #{order.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#5e5e5b]">
                              Placed on {order.date}
                            </span>
                            {order.status === 'Delivered' ? (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                                Delivered
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
                                <Clock className="h-3 w-3 stroke-[2]" />
                                Processing
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
                          <div>
                            <span className="text-[#5e5e5b]">Items: </span>
                            <span className="font-medium text-[#1b1c1c]">
                              {order.items}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-display text-sm font-semibold text-[#1b1c1c]">
                              {order.total}
                            </span>
                            <Link
                              href={`/order-success/${order.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
                            >
                              View Invoice
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
