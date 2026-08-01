import { ProductCard, type ProductCardData } from '@/components/shared/product-card';
import { SectionHeading } from '@/components/ui/section-heading';

interface RelatedProductsProps {
  products: ProductCardData[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-8 pt-16 border-t border-[#e3e2e2]">
      <SectionHeading title="You May Also Like" actionHref="/products" actionLabel="EXPLORE SHOP" />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
