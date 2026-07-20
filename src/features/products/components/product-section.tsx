import type { ProductWithImages } from '@/types';
import { SectionHeader } from '@/components/shared/section-header';
import { ProductCard } from '@/components/shared/product-card';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ProductWithImages[];
  viewAllHref: string;
  emptyMessage?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  emptyMessage = 'New products are being added. Check back soon!',
}: ProductSectionProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        viewAllHref={products.length > 0 ? viewAllHref : undefined}
      />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
          <p className="text-2xl" aria-hidden="true">🧵</p>
          <p className="mt-3 text-sm font-medium text-gray-700">Coming Soon</p>
          <p className="mt-1 text-xs text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
