import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { Scale, FileText, ShoppingBag, Copyright } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Nabab Lungi',
  description:
    'Read the Nabab Lungi Terms of Service. Governs product purchasing, store usage, pricing policies, and intellectual property rights.',
};

export default function TermsOfServicePage() {
  const terms = [
    {
      icon: ShoppingBag,
      title: '1. Orders & Pricing',
      content:
        'All prices listed on Nabab Lungi are in Bangladeshi Taka (BDT). While we endeavor to maintain accurate pricing and inventory, we reserve the right to correct errors or cancel orders resulting from typographical or stock system discrepancies. Orders are confirmed only after verification.',
    },
    {
      icon: FileText,
      title: '2. Payment Terms',
      content:
        'We accept Cash-on-Delivery (COD), bKash manual transfer, and Nagad manual payment. For Cash-on-Delivery, full payment must be handed to the courier agent upon parcel delivery. For bKash/Nagad payments, the transaction TrxID must be submitted accurately during checkout.',
    },
    {
      icon: Copyright,
      title: '3. Intellectual Property & Heritage Designs',
      content:
        'All content on this site, including brand logos, product photography, editorial texts, fabric patterns, and traditional craft descriptions, is the exclusive property of Nabab Lungi. Reproduction without written consent is strictly prohibited.',
    },
    {
      icon: Scale,
      title: '4. Limitation of Liability & Governing Law',
      content:
        'Nabab Lungi is governed by the commercial laws of the People’s Republic of Bangladesh. We are not liable for indirect or consequential damages arising from parcel delivery delays caused by external courier logistics or unforeseen weather disruptions.',
    },
  ];

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            Legal Agreement
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Terms of Service
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Please review these terms carefully before utilizing our storefront or making a purchase.
          </p>
        </RevealOnScroll>

        {/* Content Card */}
        <RevealOnScroll className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-12">
          <div className="space-y-4 pb-6 border-b border-[#e3e2e2]/60">
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c]">
              Store Terms & Conditions
            </h2>
            <p className="font-sans text-sm text-[#5e5e5b] leading-relaxed font-light">
              By placing an order or accessing the Nabab Lungi website, you agree to be bound by these Terms of Service.
            </p>
          </div>

          <div className="space-y-10">
            {terms.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-3 text-[#1b1c1c]">
                    <div className="w-8 h-8 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#1b1c1c]">{item.title}</h3>
                  </div>
                  <p className="font-sans text-sm text-[#5e5e5b] font-light leading-relaxed pl-11">
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-8 border-t border-[#e3e2e2]/60 text-xs text-[#5e5e5b] font-light leading-relaxed">
            <p>
              For legal inquiries regarding our terms, please contact our legal desk at <strong className="text-[#1b1c1c]">info@nabablungi.com</strong>.
            </p>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}
