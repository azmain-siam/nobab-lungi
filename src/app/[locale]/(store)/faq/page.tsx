import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { HelpCircle } from 'lucide-react';
import { FaqList } from './faq-list';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Nabab Lungi',
  description:
    'Find answers to common questions about Nabab Lungi handloom quality, sizing, bKash & COD payments, shipping timelines, and 7-day returns.',
};

export default function FaqPage() {
  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            Help & Assistance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our products, delivery timelines, payment options, and return process.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="max-w-3xl mx-auto">
          <FaqList />

          {/* Bottom Help Box */}
          <div className="mt-16 bg-white rounded-2xl p-8 sm:p-10 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#1b1c1c]">Still have a question?</h3>
                <p className="font-sans text-xs text-[#5e5e5b] font-light">Can’t find the answer you’re looking for? Reach out directly.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#1b1c1c] bg-[#1b1c1c] text-white px-6 py-3 text-xs font-sans uppercase font-semibold tracking-widest hover:bg-black transition-colors shrink-0"
            >
              Ask a Question
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}
