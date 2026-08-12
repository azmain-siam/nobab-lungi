import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { Truck, MapPin, Clock, ShieldCheck, HelpCircle, Gift } from 'lucide-react';
import { getStoreSettings } from '@/services/settings-service';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Information | Nabab Lungi',
  description:
    'Learn about Nabab Lungi shipping rates, delivery timelines across Dhaka and Bangladesh, tracking orders, and cash-on-delivery options.',
};

export default async function ShippingInfoPage() {
  const settings = await getStoreSettings();
  const delivery = settings.delivery;

  const dhakaPrice = delivery.inside_dhaka_charge;
  const outsideDhakaPrice = delivery.outside_dhaka_charge;
  const freeDeliveryMin = delivery.free_delivery_min_amount;
  const estimatedTime = delivery.estimated_delivery_time;

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header Section */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            Customer Support & Policies
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Shipping & Delivery
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Fast, reliable, and secure nationwide delivery across Bangladesh. We carefully hand-package every handloom item to arrive in perfect condition.
          </p>

          {freeDeliveryMin && freeDeliveryMin > 0 && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 bg-[#1b1c1c] text-white px-4 py-1.5 rounded-full text-xs font-sans font-medium">
                <Gift className="w-3.5 h-3.5" />
                <span>Free delivery on orders over ৳{freeDeliveryMin}</span>
              </span>
            </div>
          )}
        </RevealOnScroll>

        {/* Delivery Rates Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Inside Dhaka */}
          <RevealOnScroll className="bg-white rounded-2xl p-8 sm:p-10 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
                Metropolitan Area
              </span>
              <h2 className="font-display text-3xl font-semibold text-[#1b1c1c]">
                Inside Dhaka City
              </h2>
              <p className="font-sans text-sm text-[#5e5e5b] leading-relaxed font-light">
                Direct doorstep delivery with express courier support across all major neighborhoods in Dhaka.
              </p>
            </div>
            <div className="pt-6 border-t border-[#e3e2e2]/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5e5e5b] block font-light">Delivery Fee</span>
                <span className="font-display text-3xl font-bold text-[#1b1c1c]">৳{dhakaPrice}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5e5e5b] block font-light">Estimated Time</span>
                <span className="font-sans text-sm font-semibold text-[#1b1c1c]">1 – 3 Business Days</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Outside Dhaka */}
          <RevealOnScroll delay={0.1} className="bg-white rounded-2xl p-8 sm:p-10 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                <Truck className="w-6 h-6" />
              </div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
                Nationwide Delivery
              </span>
              <h2 className="font-display text-3xl font-semibold text-[#1b1c1c]">
                Outside Dhaka
              </h2>
              <p className="font-sans text-sm text-[#5e5e5b] leading-relaxed font-light">
                Reliable shipping to all divisions, districts, and upazilas across Bangladesh via logistics partners.
              </p>
            </div>
            <div className="pt-6 border-t border-[#e3e2e2]/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#5e5e5b] block font-light">Delivery Fee</span>
                <span className="font-display text-3xl font-bold text-[#1b1c1c]">৳{outsideDhakaPrice}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5e5e5b] block font-light">Estimated Time</span>
                <span className="font-sans text-sm font-semibold text-[#1b1c1c]">3 – 5 Business Days</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Detailed Shipping Info */}
        <RevealOnScroll className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-10">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold text-[#1b1c1c]">
              Delivery Guidelines & Order Processing
            </h3>
            <p className="font-sans text-sm text-[#5e5e5b] leading-relaxed font-light">
              Orders placed before 2:00 PM (GMT+6) are dispatched on the same business day. {estimatedTime ? `Standard delivery timeframe: ${estimatedTime}.` : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#1b1c1c]">
                <Clock className="w-5 h-5" />
                <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">Order Dispatch</h4>
              </div>
              <p className="font-sans text-xs text-[#5e5e5b] leading-relaxed font-light">
                You will receive an SMS and email notification with your tracking details as soon as your order leaves our warehouse.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#1b1c1c]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-sans text-sm font-semibold uppercase tracking-wider">Inspection Upon Delivery</h4>
              </div>
              <p className="font-sans text-xs text-[#5e5e5b] leading-relaxed font-light">
                For Cash-on-Delivery orders, you may inspect the package in the presence of the courier rider before accepting.
              </p>
            </div>
          </div>

          {/* Need help CTA */}
          <div className="pt-8 border-t border-[#e3e2e2]/60 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#fbf9f8] -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 sm:p-10 rounded-b-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#e3e2e2] shrink-0">
                <HelpCircle className="w-5 h-5 text-[#1b1c1c]" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-[#1b1c1c]">Have questions about your order?</h4>
                <p className="font-sans text-xs text-[#5e5e5b] font-light">Our support team is available Saturday to Thursday (10 AM – 8 PM).</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#1b1c1c] bg-[#1b1c1c] text-white px-6 py-3 text-xs font-sans uppercase font-semibold tracking-widest hover:bg-black transition-colors shrink-0"
            >
              Contact Support
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}

