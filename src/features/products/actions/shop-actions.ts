'use server';

import { getPublicProducts, getShopFilterData, type PublicProductsQueryOptions } from '@/services/product-service';

export async function fetchPublicProductsAction(options?: PublicProductsQueryOptions) {
  const [productsData, filtersData] = await Promise.all([
    getPublicProducts(options),
    getShopFilterData(),
  ]);

  return {
    products: productsData.products,
    total: productsData.total,
    pages: productsData.pages,
    currentPage: productsData.currentPage,
    categories: filtersData.categories,
    collections: filtersData.collections,
    fabrics: filtersData.fabrics,
    patterns: filtersData.patterns,
    colors: filtersData.colors,
  };
}
