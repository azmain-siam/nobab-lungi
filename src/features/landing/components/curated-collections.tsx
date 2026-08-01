import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import type { Collection, Category } from '@/types';

const FALLBACK_COLLECTIONS = [
  {
    id: 1,
    name: 'Eid Special',
    slug: 'eid-special',
    tag: 'THE CLASSICS',
    description: 'Exclusive Eid special handloom lungi collection.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop',
    span: 'lg:col-span-7',
  },
  {
    id: 2,
    name: 'Summer Collection',
    slug: 'summer-collection',
    tag: 'MODERN SOPHISTICATION',
    description: 'Lightweight summer fabrics for royal comfort.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    span: 'lg:col-span-5',
  },
  {
    id: 3,
    name: 'New Arrivals',
    slug: 'new-arrivals',
    tag: 'EVERYDAY LUXURY',
    description: 'Experience ultimate breathability and softness with signature fine cotton weave.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1600&auto=format&fit=crop',
    span: 'col-span-12',
  },
];

interface CuratedCollectionsProps {
  collections?: Collection[];
  categories?: Category[];
}

export function CuratedCollections({ collections = [] }: CuratedCollectionsProps) {
  const activeCollections = collections.filter((c) => c.is_active);

  return (
    <Section id="collections" variant="default" className="py-16 lg:py-24">
      <Container>
        {/* Section Header */}
        <SectionHeading title="Curated Collections" actionHref="/collections" actionLabel="VIEW ALL" />

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {activeCollections.length > 0 ? (
            activeCollections.map((col, idx) => {
              const isLarge = idx % 3 === 0;
              const isMedium = idx % 3 === 1;
              const spanClass = isLarge ? 'lg:col-span-7' : isMedium ? 'lg:col-span-5' : 'col-span-12';
              const coverImg =
                col.cover_image ||
                col.banner_url ||
                (idx % 2 === 0
                  ? 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop');

              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className={`group relative col-span-12 h-[360px] overflow-hidden rounded-2xl sm:h-[400px] cursor-pointer ${spanClass}`}
                >
                  <Image
                    src={coverImg}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                      {col.is_featured ? 'FEATURED COLLECTION' : 'HANDLOOM SERIES'}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                      {col.name}
                    </h3>
                    {col.description && (
                      <p className="mt-2 text-xs font-light text-white/85 line-clamp-2 max-w-lg">
                        {col.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            /* Approved Fallback Bento Grid */
            FALLBACK_COLLECTIONS.map((item) => (
              <Link
                key={item.id}
                href={`/collections/${item.slug}`}
                className={`group relative col-span-12 h-[360px] overflow-hidden rounded-2xl sm:h-[400px] cursor-pointer ${item.span}`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                    {item.tag}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-xs font-light text-white/85 sm:text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
