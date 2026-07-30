import { connectToDatabase } from '@/lib/db';
import { Product, IProduct } from '@/models/Product';
import type { ProductWithImages, Product as ProductType } from '@/types';

function mapProductToProductWithImages(doc: Record<string, unknown>): ProductWithImages {
  const images = (doc.product_images as Record<string, unknown>[]) || [];

  return {
    id: String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    sku: (doc.sku as string) ?? null,
    description: (doc.description as string) ?? null,
    price: doc.price as number,
    discount_price: (doc.discount_price as number) ?? null,
    stock: doc.stock as number,
    category_id: (doc.category_id as number) ?? null,
    is_featured: (doc.is_featured as boolean) ?? false,
    is_best_seller: (doc.is_best_seller as boolean) ?? false,
    is_new_arrival: (doc.is_new_arrival as boolean) ?? false,
    is_active: (doc.is_active as boolean) ?? true,
    seo_title: (doc.seo_title as string) ?? null,
    seo_description: (doc.seo_description as string) ?? null,
    created_at: doc.created_at ? (doc.created_at as Date).toISOString() : new Date().toISOString(),
    updated_at: doc.updated_at ? (doc.updated_at as Date).toISOString() : new Date().toISOString(),
    product_images: images.map((img) => ({
      id: img._id ? String(img._id) : String(doc._id),
      product_id: String(doc._id),
      url: img.url as string,
      alt_text: (img.alt_text as string) ?? null,
      sort_order: (img.sort_order as number) ?? 0,
    })),
  };
}

export async function getNewArrivals(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_new_arrival: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export async function getBestSellers(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_best_seller: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithImages[]> {
  try {
    await connectToDatabase();
    const products = await Product.find({ is_active: true, is_featured: true })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    return products.map((p) => mapProductToProductWithImages(p as unknown as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug, is_active: true }).lean();

    if (!product) return null;
    return mapProductToProductWithImages(product as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function createProduct(productData: {
  name: string;
  sku?: string;
  description?: string;
  price: number; // whole BDT
  stock: number;
  category_id?: number;
  imageUrl?: string;
}): Promise<{ success: boolean; product?: ProductType; error?: string }> {
  try {
    await connectToDatabase();
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product_images = productData.imageUrl
      ? [{ url: productData.imageUrl, alt_text: productData.name, sort_order: 0 }]
      : [];

    const newProduct = (await Product.create({
      name: productData.name,
      slug,
      sku: productData.sku || null,
      description: productData.description || null,
      price: Math.round(productData.price * 100),
      stock: productData.stock,
      category_id: productData.category_id || null,
      is_active: productData.stock > 0,
      product_images,
    })) as unknown as IProduct;

    const docId = String((newProduct as unknown as Record<string, unknown>)._id);

    return {
      success: true,
      product: {
        id: docId,
        name: newProduct.name,
        slug: newProduct.slug,
        sku: newProduct.sku ?? null,
        description: newProduct.description ?? null,
        price: newProduct.price,
        discount_price: newProduct.discount_price ?? null,
        stock: newProduct.stock,
        category_id: newProduct.category_id ?? null,
        is_featured: newProduct.is_featured,
        is_best_seller: newProduct.is_best_seller,
        is_new_arrival: newProduct.is_new_arrival,
        is_active: newProduct.is_active,
        seo_title: newProduct.seo_title ?? null,
        seo_description: newProduct.seo_description ?? null,
        created_at: new Date(newProduct.created_at).toISOString(),
        updated_at: new Date(newProduct.updated_at).toISOString(),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product.';
    return { success: false, error: message };
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductType>
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    await Product.findByIdAndUpdate(id, { $set: updates });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product.';
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return { success: false, error: message };
  }
}
