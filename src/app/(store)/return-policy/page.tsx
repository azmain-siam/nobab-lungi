import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { RefreshCw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | Nabab Lungi',
  description:
    'Read our 7-day hassle-free return and exchange policy for Nabab Lungi products, including step-by-step return instructions and refund details.',
};

export default function ReturnPolicyPage() {
  const steps = [
    {
      step: '01',
      title: 'Submit Return Request',
      desc: 'Contact our customer support team within 7 days of receiving your order with your Order ID and photos of the item.',
    },
    {
      step: '02',
      title: 'Quality Verification',
      desc: 'Our team will review your request within 24 hours and approve the return instructions.',
    },
    {
      step: '03',
      title: 'Courier Pickup or Drop-off',
      desc: 'Hand over the package with original tags intact to our assigned courier or drop it at a local parcel desk.',
    },
    {
      step: '04',
      title: 'Refund or Exchange',
      desc: 'Once inspected, your replacement will be dispatched or refund issued to your original payment method (bKash/Bank).',
    },
  ];

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            7-Day Guarantee
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Return & Exchange Policy
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Your satisfaction is our absolute priority. If your handloom lungi or saree does not meet your expectations, we offer a straightforward return process.
          </p>
        </RevealOnScroll>

        {/* Return Process Steps */}
        <RevealOnScroll className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold text-[#1b1c1c]">How Returns Work</h2>
            <p className="font-sans text-xs text-[#5e5e5b] uppercase tracking-widest mt-1">4 Easy Steps to Return or Exchange</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="font-display text-4xl font-bold text-[#1b1c1c]/20 block">
                    {item.step}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[#1b1c1c]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-[#5e5e5b] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Policy Terms & Conditions */}
        <RevealOnScroll className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Eligibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h3 className="font-display text-xl font-semibold text-[#1b1c1c]">Eligible For Return</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-[#5e5e5b] font-light list-disc list-inside leading-relaxed">
                <li>Defective weaving, stitching, or fabric damage upon delivery.</li>
                <li>Incorrect product, color, or size delivered.</li>
                <li>Item must be unworn, unwashed, and in original condition.</li>
                <li>Original price tags and brand packaging must be attached.</li>
              </ul>
            </div>

            {/* Ineligible */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-display text-xl font-semibold text-[#1b1c1c]">Non-Returnable Items</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-[#5e5e5b] font-light list-disc list-inside leading-relaxed">
                <li>Products returned after the 7-day post-delivery window.</li>
                <li>Items altered, washed, stained, or showing signs of wear.</li>
                <li>Clearance sale items or custom tailored handloom pieces.</li>
                <li>Damage caused by improper washing or handling.</li>
              </ul>
            </div>
          </div>

          {/* Refund Breakdown */}
          <div className="pt-8 border-t border-[#e3e2e2]/60 space-y-4">
            <h3 className="font-display text-2xl font-semibold text-[#1b1c1c]">Refund Processing</h3>
            <p className="font-sans text-sm text-[#5e5e5b] font-light leading-relaxed">
              Upon receiving and verifying your returned product at our warehouse, refunds will be initiated within <strong>3 to 5 business days</strong>. Refunds for bKash or Nagad payments will be transferred directly to your mobile wallet. For Cash-on-Delivery, we will issue a bKash transfer or store credit based on your preference.
            </p>
          </div>

          {/* Help CTA */}
          <div className="pt-8 border-t border-[#e3e2e2]/60 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#fbf9f8] -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 sm:p-10 rounded-b-2xl">
            <div>
              <h4 className="font-display text-lg font-semibold text-[#1b1c1c]">Ready to start an exchange or return?</h4>
              <p className="font-sans text-xs text-[#5e5e5b] font-light">Get in touch with our team with your Order ID.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-[#1b1c1c] bg-[#1b1c1c] text-white px-6 py-3 text-xs font-sans uppercase font-semibold tracking-widest hover:bg-black transition-colors shrink-0"
            >
              <span>Initiate Return</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}
