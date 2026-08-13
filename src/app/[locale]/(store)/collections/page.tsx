import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { getPublicCollections } from '@/services/collection-service';
import { ArrowRight, PackageX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Collections — Nabab Lungi',
  description:
    'Discover our signature series of handcrafted lungis. Heritage Collection, Executive Series, Luxury Cotton, and Royal Handloom woven with fine organic cotton.',
};

// Fallback Lungi-focused collections if DB returns empty
const FALLBACK_LUNGI_COLLECTIONS = [
  {
    id: 101,
    slug: 'heritage',
    name: 'Heritage Collection',
    description:
      'Timeless traditional check patterns woven with 100% fine cotton yarn by master Bengali artisans.',
    cover_image:
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop',
    product_count: 8,
  },
  {
    id: 102,
    slug: 'executive',
    name: 'Executive Series',
    description:
      'Sophisticated dark tone lungis designed for modern professionals, evening lounge, and formal gatherings.',
    cover_image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    product_count: 5,
  },
  {
    id: 103,
    slug: 'luxury-cotton',
    name: 'Luxury Cotton',
    description:
      'Ultra-soft fine weave cotton engineered for maximum breathability and day-long lounge comfort.',
    cover_image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200&auto=format&fit=crop',
    product_count: 6,
  },
  {
    id: 104,
    slug: 'royal-handloom',
    name: 'Royal Handloom',
    description:
      'Authentic Pabna & Tangail handloom lungis crafted with intricate border motifs and rich dyes.',
    cover_image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    product_count: 4,
  },
];

const DEFAULT_LUNGI_IMAGE =
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop';

async function DynamicCollectionsGrid() {
  let collections = await getPublicCollections();

  // If no DB collections found, use curated lungi fallbacks (ensuring NO saree content)
  if (!collections || collections.length === 0) {
    collections = FALLBACK_LUNGI_COLLECTIONS as unknown as typeof collections;
  }

  if (collections.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-[#fbf9f8]/60 border border-dashed border-[#e3e2e2] rounded-2xl max-w-md mx-auto my-12">
        <PackageX className="h-10 w-10 text-[#5e5e5b] mx-auto stroke-[1.5]" />
        <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
          No Collections Available
        </h2>
        <p className="text-xs text-[#5e5e5b] leading-relaxed">
          We&apos;re preparing something special for you. Please check back soon.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
          >
            Explore All Lungis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StaggerContainer className="grid grid-cols-12 gap-6 mt-8">
      {collections.map((collection, idx) => {
        // Bento grid column span logic
        let colSpan = 'lg:col-span-6';
        let height = 'h-[340px] sm:h-[380px]';

        if (idx === 0) {
          colSpan = 'lg:col-span-7';
          height = 'h-[380px] sm:h-[420px]';
        } else if (idx === 1) {
          colSpan = 'lg:col-span-5';
          height = 'h-[380px] sm:h-[420px]';
        } else if (idx === 2 || idx === 3) {
          colSpan = 'lg:col-span-6';
          height = 'h-[340px] sm:h-[380px]';
        } else {
          colSpan = 'lg:col-span-4';
          height = 'h-[320px] sm:h-[360px]';
        }

        const imageUrl = collection.cover_image || collection.banner_url || DEFAULT_LUNGI_IMAGE;
        const countText =
          collection.product_count && collection.product_count > 0
            ? `${collection.product_count} Lungi Styles`
            : 'Handcrafted Series';

        return (
          <StaggerItem key={collection.slug} className={`col-span-12 ${colSpan}`}>
            <Link
              href={`/collections/${collection.slug}`}
              className={`group relative block w-full ${height} overflow-hidden rounded-2xl cursor-pointer bg-stone-900 shadow-xs border border-[#e3e2e2]/40 transition-transform duration-500 hover:-translate-y-0.5 motion-reduce:transform-none`}
            >
              {/* Optimized Background Image */}
              <Image
                src={imageUrl}
                alt={`${collection.name} premium handloom lungi`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={idx < 2}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Content Card Overlay */}
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white max-w-xl transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transform-none">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90 mb-1.5">
                  {countText}
                </span>
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl tracking-tight">
                  {collection.name}
                </h2>
                {collection.description && (
                  <p className="mt-2 text-xs font-light text-white/85 sm:text-sm line-clamp-2 leading-relaxed">
                    {collection.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white group-hover:underline">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none" />
                </div>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 mt-8">
      <div className="col-span-12 lg:col-span-7 h-[380px] sm:h-[420px] bg-[#f5f3f3] animate-pulse rounded-2xl border border-[#e3e2e2]" />
      <div className="col-span-12 lg:col-span-5 h-[380px] sm:h-[420px] bg-[#f5f3f3] animate-pulse rounded-2xl border border-[#e3e2e2]" />
      <div className="col-span-12 lg:col-span-6 h-[340px] sm:h-[380px] bg-[#f5f3f3] animate-pulse rounded-2xl border border-[#e3e2e2]" />
      <div className="col-span-12 lg:col-span-6 h-[340px] sm:h-[380px] bg-[#f5f3f3] animate-pulse rounded-2xl border border-[#e3e2e2]" />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Section variant="default" className="py-12 lg:py-20">
      <Container>
        {/* Section Header */}
        <RevealOnScroll>
          <SectionHeading
            title="Curated Collections"
            subtitle="Discover our signature handloom series, handcrafted for every occasion."
            align="left"
          />
        </RevealOnScroll>

        {/* Dynamic Collections Grid */}
        <Suspense fallback={<CollectionsSkeleton />}>
          <DynamicCollectionsGrid />
        </Suspense>
      </Container>
    </Section>
  );
}
