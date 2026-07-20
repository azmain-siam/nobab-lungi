import Image from 'next/image';
import Link from 'next/link';
import type { Banner } from '@/types';

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const banner = banners[0];

  if (banner) {
    return (
      <section aria-label="Hero banner" className="relative h-[500px] overflow-hidden sm:h-[600px]">
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="mt-4 text-lg text-white/85">{banner.subtitle}</p>
              )}
              {banner.link && (
                <Link
                  href={banner.link}
                  className="mt-8 inline-block rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-400"
                >
                  Shop Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Static fallback hero ─────────────────────────────────────
  return (
    <section aria-label="Hero banner" className="relative overflow-hidden bg-stone-900">
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-amber-500 opacity-10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            বাংলাদেশের সেরা তাঁতবস্ত্র
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight text-white sm:text-6xl">
            Premium{' '}
            <span className="text-amber-400">Lungi</span>
            {' '}&amp;{' '}
            <span className="text-amber-400">Saree</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-300">
            Authentic handcrafted lungis and sarees from Bangladesh&apos;s finest weavers.
            Delivered to your doorstep across Bangladesh.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-md bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
              Shop Now
            </Link>
            <Link
              href="/collections"
              className="rounded-md border border-stone-500 px-6 py-3 text-sm font-semibold text-stone-200 transition hover:border-stone-300 hover:text-white"
            >
              View Collections
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6">
            {[
              { icon: '🚚', label: 'Free delivery above ৳1,000' },
              { icon: '✅', label: '100% authentic products' },
              { icon: '🔄', label: 'Easy returns' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-stone-400">
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
