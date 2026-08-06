import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getStoreSettings } from '@/services/settings-service';
import type { StoreSettings } from '@/types';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  settings?: StoreSettings;
}

export async function Footer({ settings }: FooterProps) {
  const storeSettings = settings || (await getStoreSettings());
  const gen = storeSettings.general;
  const addr = storeSettings.address;
  const soc = storeSettings.social;

  return (
    <footer id="about" className="border-t border-[#e3e2e2] bg-[#fbf9f8] pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Info (Left) */}
          <div className="md:col-span-5 space-y-4">
            {gen.store_logo ? (
              <Image src={gen.store_logo} alt={gen.store_name} width={140} height={40} className="h-9 w-auto object-contain" />
            ) : (
              <h3 className="font-display text-lg font-bold text-[#1b1c1c]">
                {gen.store_name || 'Nabab Lungi'}
              </h3>
            )}
            <p className="max-w-sm text-xs font-light leading-relaxed text-[#5e5e5b]">
              {gen.store_description || 'Wear Tradition with Pride. Handcrafted excellence in Bangladesh.'}
            </p>
            <div className="space-y-2 text-xs text-[#5e5e5b]">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#1b1c1c] shrink-0" />
                <span>{gen.store_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#1b1c1c] shrink-0" />
                <span>{gen.store_email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#1b1c1c] shrink-0 mt-0.5" />
                <span>{addr.store_address}, {addr.city}, {addr.district}</span>
              </div>
            </div>
          </div>

          {/* Shop Links (Middle) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#1b1c1c]">
              Shop Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5e5e5b]">
              <li>
                <Link href="/products" className="transition hover:text-[#1b1c1c]">
                  All Handloom Lungis
                </Link>
              </li>
              <li>
                <Link href="/collections" className="transition hover:text-[#1b1c1c]">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="transition hover:text-[#1b1c1c]">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?sort=best_sellers" className="transition hover:text-[#1b1c1c]">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Support (Right) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#1b1c1c]">
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-3 text-xs text-[#5e5e5b]">
              {soc.facebook_url && (
                <a href={soc.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1b1c1c] transition underline">
                  Facebook
                </a>
              )}
              {soc.instagram_url && (
                <a href={soc.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1b1c1c] transition underline">
                  Instagram
                </a>
              )}
              {soc.youtube_url && (
                <a href={soc.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1b1c1c] transition underline">
                  YouTube
                </a>
              )}
              {soc.tiktok_url && (
                <a href={soc.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#1b1c1c] transition underline">
                  TikTok
                </a>
              )}
            </div>
            <p className="text-[11px] text-[#5e5e5b] pt-2">
              Free delivery on eligible orders across Bangladesh. Safe cash-on-delivery and bKash payment supported.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 border-t border-[#e3e2e2]/60 pt-8 text-center">
          <p className="text-[11px] text-[#5e5e5b]">
            © {new Date().getFullYear()} {gen.store_name || 'Nabab Lungi'}. Handcrafted in Bangladesh. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
