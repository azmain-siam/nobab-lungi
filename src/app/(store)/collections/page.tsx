import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curated Collections — Nabab Lungi',
  description:
    'Discover our signature series of handcrafted lungis and sarees. Heritage Collection, Executive Series, Luxury Cotton, and Artisanal Sarees.',
};

const COLLECTIONS = [
  {
    slug: 'heritage',
    tag: 'THE CLASSICS',
    title: 'Heritage Collection',
    description:
      'Timeless traditional check patterns woven with 100% fine cotton yarn by master Bengali artisans.',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop',
    colSpan: 'lg:col-span-7',
    height: 'h-[380px] sm:h-[420px]',
  },
  {
    slug: 'executive',
    tag: 'MODERN SOPHISTICATION',
    title: 'Executive Series',
    description:
      'Sophisticated dark tone lungis designed for modern professionals, evening lounge, and formal gatherings.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    colSpan: 'lg:col-span-5',
    height: 'h-[380px] sm:h-[420px]',
  },
  {
    slug: 'luxury-cotton',
    tag: 'EVERYDAY LUXURY',
    title: 'Luxury Cotton',
    description:
      'Ultra-soft fine weave cotton engineered for maximum breathability and day-long lounge comfort.',
    image:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1200&auto=format&fit=crop',
    colSpan: 'lg:col-span-6',
    height: 'h-[340px] sm:h-[380px]',
  },
  {
    slug: 'artisanal-saree',
    tag: 'ROYAL HERITAGE',
    title: 'Artisanal Saree Series',
    description:
      'Exquisite Jamdani and silk saree weaves handcrafted with intricate metallic border motifs.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    colSpan: 'lg:col-span-6',
    height: 'h-[340px] sm:h-[380px]',
  },
];

export default function CollectionsPage() {
  return (
    <Section variant="default" className="py-12 lg:py-20">
      <Container>
              {/* Section Header */}
              <SectionHeading
                title="Curated Collections"
                subtitle="Discover our signature series, handcrafted for every occasion."
                align="left"
              />

              {/* Bento Grid */}
              <div className="grid grid-cols-12 gap-6 mt-8">
                {COLLECTIONS.map((collection) => (
                  <Link
                    key={collection.slug}
                    href={`/collections/${collection.slug}`}
                    className={`group relative col-span-12 ${collection.colSpan} ${collection.height} overflow-hidden rounded-2xl cursor-pointer`}
                  >
                    {/* Image */}
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 p-8 text-white max-w-xl transition-transform duration-300 group-hover:-translate-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                        {collection.tag}
                      </span>
                      <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                        {collection.title}
                      </h2>
                      <p className="mt-2 text-xs font-light text-white/85 sm:text-sm line-clamp-2">
                        {collection.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white group-hover:underline">
                        <span>Explore Collection</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
  );
}
