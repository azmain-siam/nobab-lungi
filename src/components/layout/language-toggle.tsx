"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

interface LanguageToggleProps {
  isTransparent?: boolean;
}

export function LanguageToggle({ isTransparent = false }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      disabled={isPending}
      className={`inline-flex items-center ${locale === "en" && "font-hind-siliguri"} gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
        isTransparent
          ? "text-white border-white/30 bg-black/20 hover:bg-white/20"
          : "text-[#1b1c1c] border-[#e3e2e2] bg-white hover:bg-gray-50"
      } ${isPending ? "opacity-50 cursor-wait" : ""}`}
      title={locale === "en" ? "বাংলায় দেখুন" : "Switch to English"}
    >
      <Globe className="h-3.5 w-3.5 stroke-[2]" />
      <span>{locale === "en" ? "বাংলা" : "EN"}</span>
    </button>
  );
}
