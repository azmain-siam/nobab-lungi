"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppCTAProps {
  whatsappNumber?: string | null;
}

export function WhatsAppCTA({ whatsappNumber }: WhatsAppCTAProps) {
  const phone = whatsappNumber || "+8801712345678";
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hello Nobab Lungi! I would like to inquire about your premium handloom lungi collection."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className="
        group fixed bottom-6 right-6 z-50
        flex h-12 w-12 items-center
        overflow-hidden rounded-full
        bg-[#00a884] text-white
        shadow-lg
        transition-[width,background-color,box-shadow,transform]
        duration-200 ease-out
        hover:w-[178px]
        hover:bg-[#008f70]
        hover:shadow-xl
        active:scale-95
      "
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <MessageCircle size={22} />
      </span>

      <span
        className="
          whitespace-nowrap
          pr-9
          text-xs font-semibold tracking-wide
          opacity-0
          -translate-x-1
          transition-[opacity,transform]
          duration-150
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      >
        Order via WhatsApp
      </span>
    </a>
  );
}