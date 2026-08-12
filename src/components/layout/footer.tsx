import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getStoreSettings } from '@/services/settings-service';
import type { StoreSettings } from '@/types';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FooterProps {
  settings?: StoreSettings;
}

export async function Footer({ settings }: FooterProps) {
  const storeSettings = settings || (await getStoreSettings());
  const gen = storeSettings.general;
  const addr = storeSettings.address;
  const soc = storeSettings.social;

  return (
    <footer id="about" className="bg-[#1b1c1c] text-[#fbf9f8] pt-20 pb-12">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 md:gap-8 md:grid-cols-12">
          {/* Brand Info (Left) */}
          <div className="md:col-span-4 space-y-5">
            {gen.store_logo ? (
              <Image
                src={gen.store_logo}
                alt={gen.store_name}
                width={140}
                height={40}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <h3 className="font-display text-xl font-bold text-white tracking-wide">
                {gen.store_name || 'Nabab Lungi'}
              </h3>
            )}
            <p className="max-w-[280px] text-[13px] font-light leading-relaxed text-[#fbf9f8]/70">
              {gen.store_description || 'Wear Tradition with Pride. Handcrafted excellence in Bangladesh.'}
            </p>
            <div className="space-y-3 text-[13px] text-[#fbf9f8]/80 pt-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#fbf9f8]/60 shrink-0" />
                <span>{gen.store_phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#fbf9f8]/60 shrink-0" />
                <span>{gen.store_email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#fbf9f8]/60 shrink-0 mt-0.5" />
                <span>{addr.store_address}, {addr.city}, {addr.district}</span>
              </div>
            </div>
          </div>

          {/* Shop Links (Middle Left) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Shop
            </h4>
            <ul className="space-y-3 text-[13px] text-[#fbf9f8]/80">
              <li>
                <Link href="/products" className="transition hover:text-white hover:underline underline-offset-4">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="transition hover:text-white hover:underline underline-offset-4">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="transition hover:text-white hover:underline underline-offset-4">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?sort=best_sellers" className="transition hover:text-white hover:underline underline-offset-4">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Customer Support
            </h4>
            <ul className="space-y-3 text-[13px] text-[#fbf9f8]/80">
              <li>
                <Link href="/account/orders" className="transition hover:text-white hover:underline underline-offset-4">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="transition hover:text-white hover:underline underline-offset-4">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="transition hover:text-white hover:underline underline-offset-4">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-white hover:underline underline-offset-4">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white hover:underline underline-offset-4">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Account */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Company
            </h4>
            <ul className="space-y-3 text-[13px] text-[#fbf9f8]/80">
              <li>
                <Link href="/about" className="transition hover:text-white hover:underline underline-offset-4">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition hover:text-white hover:underline underline-offset-4">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="transition hover:text-white hover:underline underline-offset-4">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Newsletter (Right) */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Join the Family
            </h4>
            <p className="text-[12px] text-[#fbf9f8]/80">
              Subscribe for updates & special offers.
            </p>
            <form className="flex flex-col gap-2" action="#">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 text-xs"
              />
              <Button type="button" variant="white" className="w-full text-[#1b1c1c] hover:bg-[#e3e2e2] text-xs">
                Subscribe
              </Button>
            </form>

            <div className="pt-2 flex items-center gap-4">
              {soc.facebook_url && (
                <a href={soc.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
              )}
              {soc.instagram_url && (
                <a href={soc.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
              )}
              {soc.youtube_url && (
                <a href={soc.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[12px] text-[#fbf9f8]/50 text-center md:text-left">
            © {new Date().getFullYear()} {gen.store_name || 'Nabab Lungi'}. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-1">
            <Image src="/images/footer/BKash-Icon-Logo.wine.svg" alt="bKash" width={60} height={24} className="h-[38px] w-auto brightness-0 invert opacity-70 transition-all duration-300 hover:brightness-100 hover:invert-0 hover:opacity-100" />
            <Image src="/images/footer/Nagad-Vertical-Logo.wine.svg" alt="Nagad" width={60} height={24} className="h-[38px] w-auto brightness-0 invert opacity-70 transition-all duration-300 hover:brightness-100 hover:invert-0 hover:opacity-100" />
          </div>

          <div className="flex items-center gap-4 text-[12px] text-[#fbf9f8]/50">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
