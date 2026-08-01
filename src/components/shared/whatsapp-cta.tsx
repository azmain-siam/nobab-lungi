'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppCTAProps {
  whatsappNumber?: string | null;
}

export function WhatsAppCTA({ whatsappNumber }: WhatsAppCTAProps) {
  const phone = whatsappNumber || '+8801712345678';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Nobab Lungi! I would like to inquire about your premium handloom lungi collection.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
    >
      <MessageCircle className="h-5 w-5 fill-white stroke-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
      <span className="text-xs font-semibold tracking-wide hidden sm:inline">Order via WhatsApp</span>
    </a>
  );
}
