import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CollectionData {
  slug: string;
  tag: string;
  title: string;
  subtitle: string;
  narrative: string;
  bannerImage: string;
  products: ProductCardData[];
}

const COLLECTIONS_DATABASE: Record<string, CollectionData> = {
  heritage: {
    slug: 'heritage',
    tag: 'THE CLASSICS',
    title: 'Heritage Collection',
    subtitle: 'Timeless Bangladeshi Check & Stripe Handlooms',
    narrative:
      'Rooted in centuries of Bangladeshi artisanal pride, our Heritage Collection celebrates the classic check and stripe motifs woven with fine organic cotton. Every piece carries the signature softness and breathability that has made Bengali lungis world-renowned.',
    bannerImage:
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1600&auto=format&fit=crop',
    products: [
      {
        id: '1',
        name: 'Midnight Indigo',
        collectionTag: 'Heritage Collection',
        description: 'Hand-woven fine cotton with traditional pattern borders.',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
        price: '৳2,450',
        badge: 'New Arrival',
      },
      {
        id: '4',
        name: 'Heritage Check Lungi',
        collectionTag: 'Heritage Collection',
        description: '100% fine cotton yarn with traditional Bengali check pattern.',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
        price: '৳1,250',
        badge: null,
      },
      {
        id: '8',
        name: 'Pabna Fine Handloom Lungi',
        collectionTag: 'Heritage Collection',
        description: 'Authenic Pabna artisan weave with soft combed cotton.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        price: '৳1,650',
        badge: null,
      },
    ],
  },
  executive: {
    slug: 'executive',
    tag: 'MODERN SOPHISTICATION',
    title: 'Executive Series',
    subtitle: 'Refined Dark Tone Lungis for Modern Lounging',
    narrative:
      'Crafted for the modern gentleman who demands quiet elegance. The Executive Series combines muted dark tones, rich silk-cotton blends, and refined metallic borders tailored for formal occasions and premium home lounge.',
    bannerImage:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    products: [
      {
        id: '2',
        name: 'Charcoal Silk Weave',
        collectionTag: 'Executive Series',
        description: 'Premium silk blend for executive comfort and occasion wear.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
        price: '৳4,800',
        originalPrice: '৳5,500',
        badge: 'Premium',
      },
      {
        id: '6',
        name: 'Executive Dark Stripe',
        collectionTag: 'Executive Series',
        description: 'Sophisticated deep charcoal lungi with modern minimalist weave.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
        price: '৳2,950',
        badge: 'New Arrival',
      },
    ],
  },
  'luxury-cotton': {
    slug: 'luxury-cotton',
    tag: 'EVERYDAY LUXURY',
    title: 'Luxury Cotton',
    subtitle: 'Lightweight Breathable Fine Weave Cotton',
    narrative:
      'Engineered specifically for warm tropical weather, Luxury Cotton items utilize high thread-count organic cotton yarn to deliver unparalleled softness, quick-drying comfort, and long-lasting durability.',
    bannerImage:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1600&auto=format&fit=crop',
    products: [
      {
        id: '3',
        name: 'Earth Tone Essential',
        collectionTag: 'Luxury Cotton',
        description: 'Breathable everyday cotton comfort designed for easy lounge.',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
        price: '৳1,850',
        badge: null,
        subTag: 'Limited Edition',
      },
      {
        id: '4',
        name: 'Classic White Cotton',
        collectionTag: 'Luxury Cotton',
        description: 'Pure white combed cotton with subtle border embroidery.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
        price: '৳950',
        badge: null,
      },
    ],
  },
  'artisanal-saree': {
    slug: 'artisanal-saree',
    tag: 'ROYAL HERITAGE',
    title: 'Artisanal Saree Series',
    subtitle: 'Hand-woven Jamdani & Silk Heritage Sarees',
    narrative:
      'A celebration of Bengali womanhood and heritage loom mastery. Features fine transparent Jamdani motifs and lustrous silk weaves crafted by master artisan families in Sonargaon and Tangail.',
    bannerImage:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    products: [
      {
        id: '5',
        name: 'Traditional Jamdani Saree',
        collectionTag: 'Artisanal Saree Series',
        description: 'Fine translucent cotton Jamdani with woven gold motifs.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
        price: '৳4,500',
        badge: 'NEW',
      },
      {
        id: '7',
        name: 'Royal Silk Saree',
        collectionTag: 'Artisanal Saree Series',
        description: 'Pure Mulberry silk saree with hand-woven border motifs.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
        price: '৳6,200',
        badge: 'PREMIUM',
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS_DATABASE[slug] || COLLECTIONS_DATABASE['heritage'];
  return {
    title: `${collection.title} — Nabab Lungi`,
    description: collection.narrative,
  };
}

export default async function CollectionDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS_DATABASE[slug] || COLLECTIONS_DATABASE['heritage'];

  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="transparent" />

        {/* Editorial Hero Banner */}
        <section aria-label="Hero" className="relative min-h-[60vh] w-full overflow-hidden bg-stone-900 flex items-end pb-16 pt-32 lg:min-h-[65vh]">
          <Image
            src={collection.bannerImage}
            alt={collection.title}
            fill
            className="object-cover opacity-80"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          <div className="relative z-10 w-full">
            <Container>
              <div className="max-w-2xl text-white space-y-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:text-white mb-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Collections
                </Link>

                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                  {collection.tag}
                </span>

                <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {collection.title}
                </h1>

                <p className="text-xs font-light leading-relaxed text-white/90 sm:text-sm max-w-lg">
                  {collection.narrative}
                </p>
              </div>
            </Container>
          </div>
        </section>

        {/* Product Grid Section */}
        <Section variant="default" className="py-16 lg:py-24">
          <Container>
            <div className="flex items-center justify-between border-b border-[#e3e2e2] pb-6 mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
                Showing <strong className="text-[#1b1c1c]">{collection.products.length}</strong> Curated Items
              </span>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:opacity-75"
              >
                View Full Shop Catalog
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {collection.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
