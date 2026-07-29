import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-[90vh] w-full overflow-hidden bg-stone-900 flex items-end pb-20 pt-32 lg:min-h-[95vh] lg:pb-28">
      {/* Background Image with subtle zoom on load */}
      <Image
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2000&auto=format&fit=crop"
        alt="Man wearing traditional handcrafted Bangladeshi lungi in a sunny courtyard"
        fill
        className="object-cover object-top opacity-85 transition-transform duration-1000 scale-105 animate-pulse-slow"
        priority
        sizes="100vw"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />

      {/* Content Container with Entrance Animations */}
      <div className="relative z-10 w-full">
        <Container>
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="font-display text-5xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl animate-fade-in-up">
              Wear Tradition <br />
              with Pride.
            </h1>

            <p className="max-w-md text-sm font-light leading-relaxed text-white/90 sm:text-base animate-fade-in-up animation-delay-100">
              Premium handcrafted lungis made with exceptional fabrics, timeless craftsmanship, and modern comfort.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 animate-fade-in-up animation-delay-200">
              <Button href="#shop" variant="white" size="lg" className="hover:scale-105 transition-transform">
                SHOP COLLECTION
              </Button>
              <Button href="#collections" variant="ghost-white" size="lg" className="hover:scale-105 transition-transform">
                EXPLORE PREMIUM SERIES
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
