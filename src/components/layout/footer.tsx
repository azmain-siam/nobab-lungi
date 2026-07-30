import Link from 'next/link';
import { Container } from '@/components/ui/container';

export function Footer() {
  return (
    <footer id="about" className="border-t border-[#e3e2e2] bg-[#fbf9f8] pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Info (Left) */}
          <div className="md:col-span-6 space-y-3">
            <h3 className="font-display text-base font-bold text-[#1b1c1c]">
              Nabab Lungi
            </h3>
            <p className="max-w-xs text-xs font-light leading-relaxed text-[#5e5e5b]">
              Wear Tradition with Pride. Handcrafted excellence since 1998.
            </p>
          </div>

          {/* Shop Links (Middle) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#1b1c1c]">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5e5e5b]">
              <li>
                <Link href="/products" className="transition hover:text-[#1b1c1c]">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-[#1b1c1c]">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-[#1b1c1c]">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links (Right) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.1em] text-[#1b1c1c]">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#5e5e5b]">
              <li>
                <Link href="/#about" className="transition hover:text-[#1b1c1c]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#about" className="transition hover:text-[#1b1c1c]">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/#about" className="transition hover:text-[#1b1c1c]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#about" className="transition hover:text-[#1b1c1c]">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 border-t border-[#e3e2e2]/60 pt-8 text-center">
          <p className="text-[11px] text-[#5e5e5b]">
            © 2026 Nabab Lungi. Handcrafted in Bangladesh.
          </p>
        </div>
      </Container>
    </footer>
  );
}
