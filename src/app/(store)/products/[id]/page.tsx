import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ProductGallery } from '@/features/products/components/product-gallery';
import { ProductInfo, type ProductInfoData } from '@/features/products/components/product-info';
import { DeliveryInfo } from '@/features/products/components/delivery-info';
import { RelatedProducts } from '@/features/products/components/related-products';
import { getProductById, getRelatedProducts } from '@/services/product-service';
import { getCategoryById } from '@/services/category-service';
import { getStoreSettings } from '@/services/settings-service';
import type { ProductCardData } from '@/components/shared/product-card';
import type { ProductWithImages } from '@/types';

function mapProductToCardData(product: ProductWithImages): ProductCardData {
  const coverImage =
    product.product_images?.find((img) => img.is_cover)?.url ||
    product.product_images?.[0]?.url ||
    '/images/placeholder-product.svg';

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
    collectionTag: product.fabric || 'Heritage',
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
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found — Nabab Lungi',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} — Nabab Lungi`,
    description:
      product.seo_description ||
      product.short_description ||
      product.description ||
      `Buy authentic ${product.name} handcrafted in Bangladesh.`,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: product.product_images?.[0]?.url ? [product.product_images[0].url] : [],
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [storeSettings, category, relatedDocs] = await Promise.all([
    getStoreSettings(),
    product.category_id ? getCategoryById(product.category_id) : Promise.resolve(null),
    getRelatedProducts(product.category_id, product.id, 4),
  ]);

  const images =
    product.product_images && product.product_images.length > 0
      ? product.product_images.map((img) => img.url)
      : [
          'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=800&auto=format&fit=crop',
        ];

  let badge: string | null = null;
  if (product.is_new_arrival) badge = 'New Arrival';
  else if (product.is_best_seller) badge = 'Best Seller';
  else if (product.is_featured) badge = 'Featured';

  const priceStr = `৳${(product.discount_price ?? product.price).toLocaleString('en-BD')}`;
  const originalPriceStr = product.discount_price
    ? `৳${product.price.toLocaleString('en-BD')}`
    : undefined;

  const discountPercent =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : null;

  const productInfoData: ProductInfoData = {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    collectionTag: product.fabric || category?.name || 'Heritage Collection',
    categoryTag: category?.name || 'Lungi',
    description: product.description || product.short_description || '',
    price: priceStr,
    originalPrice: originalPriceStr,
    discountPercent,
    badge,
    inStock: product.stock > 0 && product.is_active,
    stockCount: product.stock,
    fabricDetails: product.fabric || '100% Organic Superfine Combed Cotton',
    color: product.color,
    pattern: product.pattern,
    weight: product.weight,
    craftsmanship: 'Traditional Handloom Weave',
    origin: product.country_of_origin || 'Bangladesh',
    images,
  };

  const relatedProducts: ProductCardData[] = relatedDocs.map(mapProductToCardData);

  return (
    <div className="py-12 lg:py-16">
      <Container className="space-y-16">
        {/* Upper Product Stage: Gallery (Left) & Information (Right) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ProductGallery images={images} productName={product.name} />
          </div>
          <div className="lg:col-span-6">
            <ProductInfo
              product={productInfoData}
              insideDhakaCharge={storeSettings.delivery.inside_dhaka_charge}
              outsideDhakaCharge={storeSettings.delivery.outside_dhaka_charge}
              estimatedDeliveryTime={storeSettings.delivery.estimated_delivery_time}
            />
          </div>
        </div>

        {/* Delivery & Policy Card (Dynamic Store Settings) */}
        <DeliveryInfo
          insideDhakaCharge={storeSettings.delivery.inside_dhaka_charge}
          outsideDhakaCharge={storeSettings.delivery.outside_dhaka_charge}
          estimatedDeliveryTime={storeSettings.delivery.estimated_delivery_time}
        />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </Container>
    </div>
  );
}
