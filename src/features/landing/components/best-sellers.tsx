import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import type { ProductWithImages } from '@/types';

function mapProductToCardData(product: ProductWithImages): ProductCardData {
  const coverImage =
    product.product_images.find((img) => img.is_cover)?.url ||
    product.product_images[0]?.url ||
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop';

  const hasDiscount = product.discount_price && product.discount_price > 0 && product.discount_price < product.price;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.short_description || product.description || 'Authentic handloom cotton lungi.',
    image: coverImage,
    price: hasDiscount
      ? `৳${product.discount_price?.toLocaleString('en-BD')}`
      : `৳${product.price.toLocaleString('en-BD')}`,
    originalPrice: hasDiscount ? `৳${product.price.toLocaleString('en-BD')}` : undefined,
    badge: product.is_best_seller
      ? 'Best Seller'
      : product.is_new_arrival
      ? 'New Arrival'
      : product.is_featured
      ? 'Featured'
      : null,
  };
}

interface BestSellersProps {
  products?: ProductWithImages[];
}

export function BestSellers({ products = [] }: BestSellersProps) {
  const displayProducts = products.map(mapProductToCardData);

  if (displayProducts.length === 0) return null;

  return (
    <Section id="shop" variant="default" className="py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <RevealOnScroll>
          <SectionHeading
            title="Best Sellers"
            subtitle="Discover the handloom pieces our community loves most."
            actionHref="/products"
            actionLabel="VIEW ALL"
            align="center"
          />
        </RevealOnScroll>

        {/* Product Grid / Mobile Horizontal Scroll */}
        <StaggerContainer className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:pb-0">
          {displayProducts.map((product) => (
            <StaggerItem key={product.id} className="w-[260px] shrink-0 snap-start sm:w-auto sm:shrink">
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
