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
      <section aria-label="Hero banner" className="relative h-[70vh] min-h-[550px] max-h-[750px] overflow-hidden">
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl text-white">
              <span className="label-caps mb-3 inline-block tracking-[0.2em] text-amber-200">
                Heritage Minimalist
              </span>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="mt-4 text-base font-light leading-relaxed text-stone-200 sm:text-lg">
                  {banner.subtitle}
                </p>
              )}
              {banner.link && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={banner.link}
                    className="rounded-md bg-secondary px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-secondary-hover shadow-sm"
                  >
                    Explore Collection
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Static fallback hero matching Stitch Pro v2 ─────────────────────────────────────
  return (
    <section aria-label="Hero banner" className="relative h-[75vh] min-h-[600px] max-h-[800px] w-full overflow-hidden bg-stone-950">
      {/* Background Image Overlay with Golden Hour warmth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=2000&auto=format&fit=crop"
          alt="Bangladeshi traditional handloom weaving artwork"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent z-10" />
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <p
            className="font-bangla mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90"
            lang="bn"
          >
            বাংলাদেশের ঐতিহ্যবাহী সেরা তাঁতবস্ত্র
          </p>

          <h1 className="font-serif text-4xl font-bold leading-none tracking-tight sm:text-6xl lg:text-7xl">
            Heritage <br className="hidden sm:inline" />
            <span className="italic font-normal text-amber-100">Reimagined.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-stone-300 sm:text-lg">
            Authentic handcrafted lungis and sarees woven by master artisans in Bangladesh. Uncompromising quality, tactile organic comfort.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-md bg-secondary px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-secondary-hover shadow-md"
            >
              Shop Lungis
            </Link>
            <Link
              href="/collections"
              className="rounded-md border border-stone-300/60 bg-white/5 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white"
            >
              View Collections
            </Link>
          </div>

          {/* Key Heritage Trust Badges */}
          <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-6 text-stone-300">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              100% Organic Handloom Cotton
            </div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Express Delivery Across Bangladesh
            </div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Direct From Master Weavers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
