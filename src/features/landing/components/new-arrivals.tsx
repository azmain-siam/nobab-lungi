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
    badge: 'New Arrival',
  };
}

interface NewArrivalsProps {
  products?: ProductWithImages[];
}

export function NewArrivals({ products = [] }: NewArrivalsProps) {
  const displayProducts = products.map(mapProductToCardData);

  if (displayProducts.length === 0) return null;

  return (
    <Section id="new-arrivals" variant="default" className="py-20 lg:py-28 bg-[#f5f3f3]/50">
      <Container>
        {/* Section Header */}
        <RevealOnScroll>
          <SectionHeading
            title="New Arrivals Showcase"
            subtitle="Explore the latest handcrafted drops straight from the loom."
            actionHref="/products"
            actionLabel="EXPLORE ALL"
          />
        </RevealOnScroll>

        {/* Product Grid */}
        <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
