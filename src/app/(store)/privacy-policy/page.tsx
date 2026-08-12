import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nabab Lungi',
  description:
    'Read the Nabab Lungi Privacy Policy. Understand how we collect, protect, and use your personal information and transaction details.',
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content:
        'When you place an order or create an account with Nabab Lungi, we collect personal information necessary to fulfill your order. This includes your full name, phone number, shipping address, email address, and transaction references for bKash or Nagad payments. We do not store sensitive payment pin codes or passwords.',
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content:
        'Your privacy and data security are paramount. All communication across our storefront is encrypted using SSL (Secure Sockets Layer) technology. Customer data is stored securely in encrypted databases and is accessible only to authorized logistics and support personnel.',
    },
    {
      icon: Eye,
      title: 'Sharing of Information',
      content:
        'Nabab Lungi will never sell, rent, or trade your personal information to third-party marketers. We only share necessary delivery details (name, phone number, and address) with verified courier partners in Bangladesh (such as Steadfast or Pathao) solely for order delivery.',
    },
    {
      icon: ShieldCheck,
      title: 'Your Rights & Control',
      content:
        'You have full control over your profile and stored shipping addresses in your account dashboard. You may request account deletion or data removal at any time by contacting our support team at info@nabablungi.com.',
    },
  ];

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            Legal & Compliance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Privacy Policy
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Last updated: August 2026. This Privacy Policy governs the manner in which Nabab Lungi collects, uses, and discloses user information.
          </p>
        </RevealOnScroll>

        {/* Policy Content Card */}
        <RevealOnScroll className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-12">
          <div className="space-y-4 pb-6 border-b border-[#e3e2e2]/60">
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c]">
              Commitment to Customer Privacy
            </h2>
            <p className="font-sans text-sm text-[#5e5e5b] leading-relaxed font-light">
              At Nabab Lungi, we respect your privacy and are committed to protecting the personal information you share with us. This policy outlines how your data is handled when visiting our website or purchasing our handloom products.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-3 text-[#1b1c1c]">
                    <div className="w-8 h-8 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#1b1c1c]">{sec.title}</h3>
                  </div>
                  <p className="font-sans text-sm text-[#5e5e5b] font-light leading-relaxed pl-11">
                    {sec.content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-8 border-t border-[#e3e2e2]/60 text-xs text-[#5e5e5b] font-light leading-relaxed space-y-2">
            <p>
              If you have any questions regarding this Privacy Policy or our privacy practices, please contact us at <strong className="text-[#1b1c1c]">info@nabablungi.com</strong> or call us at <strong className="text-[#1b1c1c]">+880 1700-000000</strong>.
            </p>
          </div>
        </RevealOnScroll>
      </Container>
    </div>
  );
}
