'use server';

import { createProduct, updateProduct, deleteProduct } from '@/services/product-service';
import { productSchema } from '@/lib/validations/product';
import type { Product } from '@/types';

export async function createProductAction(data: {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  imageUrl?: string;
}) {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  return await createProduct(parsed.data);
}

export async function updateProductAction(id: string, updates: Partial<Product>) {
  return await updateProduct(id, updates);
}

export async function deleteProductAction(id: string) {
  return await deleteProduct(id);
}
