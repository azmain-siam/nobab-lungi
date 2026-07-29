import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { ProductGallery } from '@/features/products/components/product-gallery';
import { ProductInfo } from '@/features/products/components/product-info';
import { DeliveryInfo } from '@/features/products/components/delivery-info';
import { ProductReviews } from '@/features/products/components/product-reviews';
import { RelatedProducts } from '@/features/products/components/related-products';

const PRODUCT_DATABASE: Record<string, {
  id: string;
  name: string;
  collectionTag: string;
  categoryTag: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: string;
  reviewsCount: number;
  badge?: string | null;
  inStock: boolean;
  fabricDetails: string;
  images: string[];
}> = {
  '1': {
    id: '1',
    name: 'Midnight Indigo Lungi',
    collectionTag: 'Heritage Collection',
    categoryTag: 'Lungi',
    description:
      'Hand-woven fine cotton lungi crafted using traditional Bangladeshi dyeing and weaving techniques. Breathable, durable, and styled for effortless luxury.',
    price: '৳2,450',
    originalPrice: '৳3,200',
    rating: '5.0',
    reviewsCount: 128,
    badge: 'New Arrival',
    inStock: true,
    fabricDetails: '100% Organic Superfine Combed Cotton (60s count)',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    ],
  },
  '2': {
    id: '2',
    name: 'Charcoal Silk Weave',
    collectionTag: 'Executive Series',
    categoryTag: 'Lungi',
    description:
      'Premium silk-cotton blend designed for special occasions and executive loungewear. Features subtle lustrous metallic thread borders.',
    price: '৳4,800',
    originalPrice: '৳5,500',
    rating: '5.0',
    reviewsCount: 95,
    badge: 'Premium',
    inStock: true,
    fabricDetails: '50% Mulberry Silk / 50% Fine Egyptian Cotton',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    ],
  },
  '3': {
    id: '3',
    name: 'Earth Tone Essential',
    collectionTag: 'Luxury Cotton',
    categoryTag: 'Lungi',
    description:
      'Ultra-soft everyday lounge lungi made with breathable fine yarn weave. Perfect for warm Bangladeshi climates.',
    price: '৳1,850',
    rating: '5.0',
    reviewsCount: 210,
    badge: null,
    inStock: true,
    fabricDetails: '100% Breathable Fine Handloom Cotton',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCT_DATABASE[id] || PRODUCT_DATABASE['1'];
  return {
    title: `${product.name} — Nabab Lungi`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCT_DATABASE[id] || PRODUCT_DATABASE['1'];

  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />

        <main className="py-12 lg:py-16">
          <Container className="space-y-16">
            {/* Upper Product Stage: Gallery (Left) & Information (Right) */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                />
              </div>
              <div className="lg:col-span-6">
                <ProductInfo product={product} />
              </div>
            </div>

            {/* Delivery & Policy Card */}
            <DeliveryInfo />

            {/* Product Reviews */}
            <ProductReviews />

            {/* Related Products */}
            <RelatedProducts />
          </Container>
        </main>
      </div>

      <Footer />
    </div>
  );
}
