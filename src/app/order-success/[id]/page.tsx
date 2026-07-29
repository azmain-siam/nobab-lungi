import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed — Nabab Lungi',
  description: 'Thank you for your purchase! Your order has been placed successfully.',
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />

        <main className="py-16 lg:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center space-y-6 bg-white border border-[#e3e2e2] p-8 sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-8 w-8 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#5e5e5b]">
                  Order Confirmed
                </span>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-[#1b1c1c] sm:text-4xl">
                  Thank You for Your Order!
                </h1>
                <p className="font-display text-sm font-semibold text-[#1b1c1c]">
                  Order Reference: <span className="text-black underline">{id}</span>
                </p>
              </div>

              <p className="text-xs font-light leading-relaxed text-[#5e5e5b] sm:text-sm max-w-md mx-auto">
                We have received your order details. Our master weavers are preparing your handcrafted lungi for packaging and dispatch.
              </p>

              {/* Delivery Timeline Card */}
              <div className="border-t border-b border-[#e3e2e2] py-6 my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left text-xs">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1b1c1c]">Estimated Delivery</h4>
                    <p className="text-[#5e5e5b] mt-0.5">2 - 4 Business Days</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-[#1b1c1c] stroke-[1.5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1b1c1c]">Order Tracking</h4>
                    <p className="text-[#5e5e5b] mt-0.5">SMS updates will be sent to your phone</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button href="/products" variant="primary" size="lg" className="gap-2">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/" variant="secondary" size="lg">
                  Return to Home
                </Button>
              </div>
            </div>
          </Container>
        </main>
      </div>

      <Footer />
    </div>
  );
}
