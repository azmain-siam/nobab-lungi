import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { SectionHeading } from '@/components/ui/section-heading';

const RELATED_PRODUCTS: ProductCardData[] = [
  {
    id: '2',
    name: 'Charcoal Silk Weave',
    collectionTag: 'Luxury',
    description: 'Premium silk blend for executive comfort and occasion wear.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 95,
    price: '৳4,800',
    originalPrice: '৳5,500',
    badge: 'Premium',
  },
  {
    id: '3',
    name: 'Earth Tone Essential',
    collectionTag: 'Daily Elegance',
    description: 'Breathable everyday cotton comfort designed for easy lounge.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 210,
    price: '৳1,850',
    badge: null,
    subTag: 'Limited Edition',
  },
  {
    id: '4',
    name: 'Heritage Check Lungi',
    collectionTag: 'Heritage',
    description: '100% fine cotton yarn with traditional Bengali check pattern.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 128,
    price: '৳1,250',
    badge: null,
  },
  {
    id: '5',
    name: 'Royal Silk Blend',
    collectionTag: 'Luxury',
    description: 'Rich lustrous fabric with hand-embroidered border motifs.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    rating: '5.0',
    reviewsCount: 84,
    price: '৳5,200',
    originalPrice: '৳6,000',
    badge: 'Premium',
  },
];

export function RelatedProducts() {
  return (
    <div className="space-y-8 pt-16 border-t border-[#e3e2e2]">
      <SectionHeading title="You May Also Like" actionHref="/products" actionLabel="EXPLORE SHOP" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {RELATED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
