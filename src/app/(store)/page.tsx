import type { Metadata } from 'next';
import { getActiveBanners } from '@/services/banner-service';
import { getAllCategories } from '@/services/category-service';
import { getFeaturedCollections } from '@/services/collection-service';
import { getNewArrivals, getBestSellers } from '@/services/product-service';
import { HeroBanner } from '@/features/products/components/hero-banner';
import { FeaturedCategories } from '@/features/products/components/featured-categories';
import { ProductSection } from '@/features/products/components/product-section';
import { FeaturedCollections } from '@/features/collections/components/featured-collections';
import { HeritageStory } from '@/features/products/components/heritage-story';
import { WhyChooseUs } from '@/features/products/components/why-choose-us';

export const metadata: Metadata = {
  title: 'Nobab Lungi — Premium Bangladeshi Lungi & Saree',
  description:
    "Bangladesh's finest lungi and saree store. Shop premium cotton, handloom, Jamdani, and export-quality products. Fast delivery across Bangladesh.",
  openGraph: {
    title: 'Nobab Lungi — Premium Bangladeshi Lungi & Saree',
    description:
      "Authentic handcrafted lungis and sarees from Bangladesh's finest weavers. Delivered to your doorstep.",
    type: 'website',
  },
};

/**
 * Homepage — Server Component.
 * All data fetched in parallel at request time.
 */
export default async function HomePage() {
  const [banners, categories, collections, newArrivals, bestSellers] = await Promise.all([
    getActiveBanners(),
    getAllCategories(),
    getFeaturedCollections(),
    getNewArrivals(8),
    getBestSellers(8),
  ]);

  return (
    <div className="bg-background min-h-screen">
      <HeroBanner banners={banners} />

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 sm:py-24 sm:space-y-28 lg:px-8">
        <FeaturedCategories categories={categories} />

        <ProductSection
          title="New Arrivals"
          subtitle="The latest additions to our handloom collection"
          products={newArrivals}
          viewAllHref="/products?filter=new-arrivals"
        />

        <HeritageStory />

        <ProductSection
          title="Best Sellers"
          subtitle="Our most loved traditional wear, chosen by customers"
          products={bestSellers}
          viewAllHref="/products?filter=best-sellers"
          emptyMessage="Our best sellers will appear here as products are added."
        />

        <FeaturedCollections collections={collections} />

        <WhyChooseUs />
      </div>
    </div>
  );
}
