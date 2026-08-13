import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { getCollectionBySlug } from '@/services/collection-service';
import { getPublicProducts } from '@/services/product-service';
import type { ProductWithImages } from '@/types';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1600&auto=format&fit=crop';

function mapProductToCardData(product: ProductWithImages): ProductCardData {
  const coverImage =
    product.product_images?.find((img) => img.is_cover)?.url ||
    product.product_images?.[0]?.url ||
    DEFAULT_BANNER;

  let badge: string | null = null;
  if (product.is_new_arrival) badge = 'New Arrival';
  else if (product.is_best_seller) badge = 'Best Seller';
  else if (product.is_featured) badge = 'Featured';

  const priceStr = `৳${(product.discount_price ?? product.price).toLocaleString('en-BD')}`;
  const originalPriceStr = product.discount_price
    ? `৳${product.price.toLocaleString('en-BD')}`
    : undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    collectionTag: product.fabric || 'Handloom',
    description: product.short_description || product.description || undefined,
    image: coverImage,
    price: priceStr,
    originalPrice: originalPriceStr,
    badge,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const collection = await getCollectionBySlug(slug, locale);

  if (!collection) {
    return {
      title: 'Collection — Nabab Lungi',
      description: 'Explore our handcrafted lungi collection.',
    };
  }

  return {
    title: `${collection.seo_title || collection.name} — Nabab Lungi`,
    description:
      collection.seo_description ||
      collection.description ||
      `Explore our ${collection.name} premium handcrafted lungis.`,
  };
}

export default async function CollectionDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const collection = await getCollectionBySlug(slug, locale);

  // Fallback for default predefined lungi collections if DB collection doc is missing
  const fallbackTitle = slug.replace(/-/g, ' ').toUpperCase();

  const title = collection?.name || `${fallbackTitle} COLLECTION`;
  const description =
    collection?.description ||
    'Timeless traditional check and pattern lungis hand-woven with fine organic cotton yarn by master Bengali artisans.';
  const bannerImage = collection?.banner_url || collection?.cover_image || DEFAULT_BANNER;

  // Fetch dynamic products matching this collection from MongoDB
  const productsRes = await getPublicProducts({
    collections: [slug],
    limit: 24,
    locale,
  });

  const cardProducts = productsRes.products.map(mapProductToCardData);

  return (
    <>
      {/* Editorial Hero Banner */}
      <section aria-label="Hero" className="relative min-h-[55vh] w-full overflow-hidden bg-stone-900 flex items-end pb-16 pt-32 lg:min-h-[60vh]">
        <Image
          src={bannerImage}
          alt={`${title} banner`}
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

              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                CURATED LUNGI SERIES
              </span>

              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="text-xs font-light leading-relaxed text-white/90 sm:text-sm max-w-lg">
                {description}
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Product Grid Section */}
      <Section variant="default" className="py-16 lg:py-24">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e3e2e2] pb-6 mb-10 gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
              Showing <strong className="text-[#1b1c1c]">{cardProducts.length}</strong> Handcrafted Lungi Items
            </span>
            <Link
              href={`/shop?collection=${slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1b1c1c] hover:underline"
            >
              <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
              View in Shop Catalog →
            </Link>
          </div>

          {cardProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cardProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-4 bg-[#fbf9f8]/60 border border-dashed border-[#e3e2e2] rounded-2xl max-w-md mx-auto">
              <ShoppingBag className="h-8 w-8 text-[#5e5e5b] mx-auto stroke-[1.5]" />
              <h2 className="font-display text-base font-semibold text-[#1b1c1c]">
                No Items Found in this Collection
              </h2>
              <p className="text-xs text-[#5e5e5b] max-w-xs mx-auto">
                Explore our full catalog to discover our full selection of handcrafted lungis.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
                >
                  Browse Full Shop Catalog
                </Link>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
