import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';

export function CuratedCollections() {
  return (
    <Section id="collections" variant="default" className="py-16 lg:py-24">
      <Container>
        {/* Section Header */}
        <SectionHeading title="Curated Collections" actionHref="#shop" actionLabel="VIEW ALL" />

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Top Left - Heritage Collection */}
          <div className="group relative col-span-12 h-[360px] overflow-hidden rounded-2xl lg:col-span-7 sm:h-[400px] cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop"
              alt="Folded handcrafted lungis stacked on a wooden table"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-300 group-hover:-translate-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                THE CLASSICS
              </span>
              <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Heritage Collection
              </h3>
            </div>
          </div>

          {/* Top Right - Executive Series */}
          <div className="group relative col-span-12 h-[360px] overflow-hidden rounded-2xl lg:col-span-5 sm:h-[400px] cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
              alt="Man wearing modern executive grey lungi"
              fill
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-300 group-hover:-translate-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                MODERN SOPHISTICATION
              </span>
              <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Executive Series
              </h3>
            </div>
          </div>

          {/* Bottom Full-Width - Luxury Cotton */}
          <div className="group relative col-span-12 h-[260px] overflow-hidden rounded-2xl sm:h-[300px] cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1600&auto=format&fit=crop"
              alt="Fine white cotton weave texture"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-0 left-0 p-8 text-white max-w-xl transition-transform duration-300 group-hover:-translate-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                EVERYDAY LUXURY
              </span>
              <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Luxury Cotton
              </h3>
              <p className="mt-2 text-xs font-light text-white/85 sm:text-sm">
                Experience the ultimate breathability and softness with our signature fine cotton weave.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
