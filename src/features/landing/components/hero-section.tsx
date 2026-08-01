'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import type { Banner } from '@/types';
import bannerImg from '../../../../public/images/banner/banner.jpeg';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  banners?: Banner[];
}

export function HeroSection({ banners = [] }: HeroSectionProps) {
  const activeBanners = banners.filter((b) => b.is_active && b.desktop_image);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance hero slides if multiple banners exist
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const currentBanner = activeBanners.length > 0 ? activeBanners[currentIndex] : null;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[90vh] w-full overflow-hidden bg-stone-900 flex items-end pb-20 pt-32 lg:min-h-[95vh] lg:pb-28"
    >
      {/* Background Image / Carousel */}
      {currentBanner ? (
        <div key={currentBanner.id} className="absolute inset-0 transition-opacity duration-700">
          <Image
            src={currentBanner.desktop_image}
            alt={currentBanner.title || 'Nabab Lungi Hero Banner'}
            fill
            className="object-cover object-top opacity-85 transition-transform duration-1000 scale-105"
            priority
            sizes="100vw"
          />
        </div>
      ) : (
        /* Approved Fallback Hero Image */
        <Image
          src={bannerImg}
          alt="Man wearing traditional handcrafted Bangladeshi lungi in a sunny courtyard"
          fill
          className="object-cover object-top opacity-85 transition-transform duration-1000 scale-105"
          priority
          sizes="100vw"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

      {/* Content Container */}
      <div className="relative z-10 w-full">
        <Container>
          <div className="max-w-2xl text-white space-y-6">
            {currentBanner ? (
              <>
                {currentBanner.subtitle && (
                  <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-white/80 bg-white/10 px-3 py-1 backdrop-blur-xs">
                    {currentBanner.subtitle}
                  </span>
                )}
                <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up">
                  {currentBanner.title}
                </h1>
                {currentBanner.description && (
                  <p className="max-w-md text-sm font-light leading-relaxed text-white/90 sm:text-base animate-fade-in-up">
                    {currentBanner.description}
                  </p>
                )}
                <div className="pt-2 flex flex-wrap items-center gap-4 animate-fade-in-up">
                  <Button
                    href={currentBanner.primary_btn_url || '/products'}
                    variant="white"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    {currentBanner.primary_btn_text || 'SHOP COLLECTION'}
                  </Button>
                  {currentBanner.secondary_btn_text && (
                    <Button
                      href={currentBanner.secondary_btn_url || '/collections'}
                      variant="ghost-white"
                      size="lg"
                      className="hover:scale-105 transition-transform"
                    >
                      {currentBanner.secondary_btn_text}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Approved Static Hero Content Fallback */
              <>
                <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up">
                  Wear Tradition <br />
                  with Pride.
                </h1>

                <p className="max-w-md text-sm font-light leading-relaxed text-white/90 sm:text-base animate-fade-in-up">
                  Premium handcrafted lungis made with exceptional fabrics, timeless craftsmanship, and modern comfort.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 animate-fade-in-up">
                  <Button
                    href="/products"
                    variant="white"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    SHOP COLLECTION
                  </Button>
                  <Button
                    href="/collections"
                    variant="ghost-white"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    EXPLORE PREMIUM SERIES
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>

      {/* Slide Navigation Controls if multiple banners exist */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))
            }
            className="p-2.5 bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition border border-white/20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-mono font-semibold text-white px-2">
            {currentIndex + 1} / {activeBanners.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
            className="p-2.5 bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition border border-white/20"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
