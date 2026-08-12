import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getStoreSettings } from '@/services/settings-service';
import type { StoreSettings } from '@/types';
import { Phone, Mail, MapPin, CreditCard } from 'lucide-react';
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

          {/* Customer Care (Middle Right) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Support
            </h4>
            <ul className="space-y-3 text-[13px] text-[#fbf9f8]/80">
              <li>
                <Link href="#" className="transition hover:text-white hover:underline underline-offset-4">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white hover:underline underline-offset-4">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white hover:underline underline-offset-4">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="transition hover:text-white hover:underline underline-offset-4">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Newsletter (Right) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              Join the Family
            </h4>
            <p className="text-[13px] text-[#fbf9f8]/80 max-w-sm">
              Subscribe to get 10% off your first order and exclusive access to new arrivals.
            </p>
            <form className="flex gap-2 max-w-sm" action="#">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10"
              />
              <Button type="button" variant="white" className="shrink-0 text-[#1b1c1c] hover:bg-[#e3e2e2]">
                Subscribe
              </Button>
            </form>
            
            <div className="pt-2 flex items-center gap-4">
              {soc.facebook_url && (
                <a href={soc.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition">
                  FB
                </a>
              )}
              {soc.instagram_url && (
                <a href={soc.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition">
                  IG
                </a>
              )}
              {soc.youtube_url && (
                <a href={soc.youtube_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition">
                  YT
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
          
          <div className="flex items-center justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition duration-300">
             <div className="bg-white/5 px-2 py-1.5 rounded flex items-center justify-center">
               <Image src="/images/payment/bkash.svg" alt="bKash" width={45} height={20} className="h-[18px] w-auto" />
             </div>
             <div className="bg-white/5 px-2 py-1.5 rounded flex items-center justify-center">
               <Image src="/images/payment/nagad.svg" alt="Nagad" width={45} height={20} className="h-[18px] w-auto" />
             </div>
             <div className="bg-white/5 px-3 py-1.5 rounded flex items-center justify-center gap-1">
                <CreditCard className="h-4 w-4 text-white" />
                <span className="text-white text-[10px] font-semibold uppercase tracking-wider">Card</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4 text-[12px] text-[#fbf9f8]/50">
             <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
             <Link href="#" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
