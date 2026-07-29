import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';

const PRODUCTS: ProductCardData[] = [
  {
    id: '1',
    name: 'Heritage Check Lungi',
    collectionTag: 'Heritage',
    description: '100% fine cotton yarn with traditional Bengali check pattern.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 128,
    price: '৳1,250',
    badge: 'New Arrival',
  },
  {
    id: '2',
    name: 'Silk Cotton Blend',
    collectionTag: 'Executive',
    description: 'Premium silk blend for executive comfort and occasion wear.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 95,
    price: '৳2,850',
    originalPrice: '৳3,200',
    badge: 'Premium',
  },
  {
    id: '3',
    name: 'Midnight Indigo',
    collectionTag: 'Heritage',
    description: 'Hand-woven fine cotton with traditional pattern borders.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 210,
    price: '৳1,450',
    badge: null,
  },
  {
    id: '4',
    name: 'Classic White Cotton',
    collectionTag: 'Luxury',
    description: 'Breathable everyday cotton comfort designed for easy lounge.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 58,
    price: '৳950',
    badge: null,
    subTag: 'Limited Edition',
  },
];

export function BestSellers() {
  return (
    <Section id="shop" variant="default" className="py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <SectionHeading
          title="Best Sellers"
          subtitle="Discover the pieces our community loves most."
          align="center"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
