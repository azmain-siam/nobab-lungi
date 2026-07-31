'use server';

import {
  createProductAction as createProductActionFeature,
  updateProductAction as updateProductActionFeature,
  deleteProductAction as deleteProductActionFeature,
  fetchAdminProductsAction as fetchAdminProductsActionFeature,
} from '@/features/dashboard/actions/product-actions';
import type { ProductInput } from '@/lib/validations/product';

export async function createProductAction(input: ProductInput) {
  return createProductActionFeature(input);
}

export async function updateProductAction(id: string, input: ProductInput) {
  return updateProductActionFeature(id, input);
}

export async function deleteProductAction(id: string) {
  return deleteProductActionFeature(id);
}

export async function fetchAdminProductsAction(options?: {
  search?: string;
  categoryId?: number;
  collectionId?: number;
  status?: string;
  stockFilter?: string;
  flagFilter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  return fetchAdminProductsActionFeature(options);
}
