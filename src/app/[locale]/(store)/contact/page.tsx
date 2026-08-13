import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { getStoreSettings } from '@/services/settings-service';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact Us | Nabab Lungi',
  description:
    'Get in touch with Nabab Lungi customer support. Contact us for order assistance, bulk orders, handloom inquiries, or visit our store in Bangladesh.',
};

export default async function ContactPage() {
  const storeSettings = await getStoreSettings();
  const gen = storeSettings.general;
  const addr = storeSettings.address;

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pt-28 pb-24">
      <Container>
        {/* Header */}
        <RevealOnScroll className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#5e5e5b]">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1b1c1c]">
            Contact Us
          </h1>
          <p className="font-sans text-base text-[#5e5e5b] max-w-xl mx-auto font-light leading-relaxed">
            Have questions about our handloom lungis, order status, or wholesale inquiries? We would love to hear from you.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Info (Left 5 Cols) */}
          <RevealOnScroll className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-8">
              <h2 className="font-display text-2xl font-semibold text-[#1b1c1c]">
                Reach Out Directly
              </h2>

              <div className="space-y-6 text-sm text-[#5e5e5b] font-light">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] block">Phone & WhatsApp</span>
                    <a href={`tel:${gen.store_phone}`} className="hover:text-[#1b1c1c] transition">
                      {gen.store_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] block">Email Inquiries</span>
                    <a href={`mailto:${gen.store_email}`} className="hover:text-[#1b1c1c] transition">
                      {gen.store_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] block">Headquarters & Showroom</span>
                    <span>{addr.store_address}, {addr.city}, {addr.district}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-2">
                  <div className="w-10 h-10 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#1b1c1c] shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] block">Operating Hours</span>
                    <span>Saturday – Thursday: 10:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wholesale note */}
            <div className="bg-[#1b1c1c] text-white rounded-2xl p-8 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 block">Bulk & Corporate Orders</span>
              <h3 className="font-display text-xl font-semibold">Wholesale & Export Enquiries</h3>
              <p className="text-xs text-white/80 font-light leading-relaxed">
                Looking to order custom handloom lungis for events or corporate gifts? Contact our sales team directly at <strong>{gen.store_email}</strong>.
              </p>
            </div>
          </RevealOnScroll>

          {/* Contact Form (Right 7 Cols) */}
          <RevealOnScroll delay={0.15} className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#e3e2e2] shadow-[0_10px_30px_4px_rgba(0,0,0,0.03)] space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-semibold text-[#1b1c1c]">Send Us a Message</h2>
                <p className="font-sans text-xs text-[#5e5e5b] font-light">Fill out the form below and we will respond within 24 business hours.</p>
              </div>

              <ContactForm />
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </div>
  );
}
