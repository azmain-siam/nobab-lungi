'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { uploadImageAction } from '@/actions/upload';
import {
  fetchAdminProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from '@/features/dashboard/actions/product-actions';
import { fetchAdminCategoriesAction } from '@/features/dashboard/actions/category-actions';
import { fetchAdminCollectionsAction } from '@/features/dashboard/actions/collection-actions';
import type { Category, Collection } from '@/types';
import type { AdminProductListItem } from '@/services/product-service';
import { Plus, RefreshCw } from 'lucide-react';
import { ProductFilters } from '@/features/dashboard/components/product-filters';
import { ProductsTable } from '@/features/dashboard/components/products-table';
import { ProductFormDrawer } from '@/features/dashboard/components/product-form-drawer';

export default function AdminProductsPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Data State
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [flagFilter, setFlagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Form Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductListItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [sku, setSku] = useState('');
  const [autoSku, setAutoSku] = useState(true);
  const [stock, setStock] = useState<string>('10');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([]);
  const [fabric, setFabric] = useState('100% Organic Cotton');
  const [pattern, setPattern] = useState('Traditional Check');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('450g');
  const [countryOfOrigin, setCountryOfOrigin] = useState('Bangladesh');
  const [productImages, setProductImages] = useState<
    { url: string; alt_text?: string; sort_order: number; is_cover: boolean }[]
  >([]);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchProducts = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch Categories & Collections for dropdowns
  useEffect(() => {
    fetchAdminCategoriesAction({ limit: 100 }).then((res) => setCategories(res.categories)).catch(() => {});
    fetchAdminCollectionsAction({ limit: 100 }).then((res) => setCollections(res.collections)).catch(() => {});
  }, []);

  // Fetch Products Effect
  useEffect(() => {
    let isMounted = true;

    fetchAdminProductsAction({
      search: searchQuery,
      categoryId: selectedCategory > 0 ? selectedCategory : undefined,
      collectionId: selectedCollection > 0 ? selectedCollection : undefined,
      status: statusFilter,
      stockFilter,
      flagFilter,
      sort: sortBy,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setProducts(res.products);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    searchQuery,
    selectedCategory,
    selectedCollection,
    statusFilter,
    stockFilter,
    flagFilter,
    sortBy,
    currentPage,
    refreshKey,
  ]);

  // Open Create Drawer
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setAutoSlug(true);
    setShortDescription('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setSku(`NL-LUN-${Math.floor(1000 + Math.random() * 9000)}`);
    setAutoSku(true);
    setStock('15');
    setCategoryId(categories.length > 0 ? categories[0].id : 0);
    setSelectedCollectionIds([]);
    setFabric('100% Organic Cotton');
    setPattern('Classic Check');
    setColor('Navy Blue');
    setWeight('450g');
    setCountryOfOrigin('Bangladesh');
    setProductImages([]);
    setStatus('published');
    setIsActive(true);
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);
    setSeoTitle('');
    setSeoDescription('');
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (product: AdminProductListItem) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setAutoSlug(false);
    setShortDescription(product.short_description ?? '');
    setDescription(product.description ?? '');
    setPrice(String(product.price));
    setDiscountPrice(product.discount_price ? String(product.discount_price) : '');
    setSku(product.sku ?? '');
    setAutoSku(false);
    setStock(String(product.stock));
    setCategoryId(product.category_id || (categories.length > 0 ? categories[0].id : 0));
    
    const parsedCollectionIds = Array.isArray(product.collection_ids)
      ? product.collection_ids.map((id) => Number(id)).filter((id) => !isNaN(id))
      : [];
    setSelectedCollectionIds(parsedCollectionIds);

    setFabric(product.fabric ?? '100% Organic Cotton');
    setPattern(product.pattern ?? 'Classic Check');
    setColor(product.color ?? '');
    setWeight(product.weight ?? '450g');
    setCountryOfOrigin(product.country_of_origin ?? 'Bangladesh');

    const mappedImgs = (product.product_images || []).map((img, idx) => ({
      url: img.url,
      alt_text: img.alt_text || product.name,
      sort_order: img.sort_order ?? idx,
      is_cover: img.is_cover ?? idx === 0,
    }));
    setProductImages(mappedImgs);

    setStatus(product.status || 'published');
    setIsActive(product.is_active ?? true);
    setIsFeatured(product.is_featured ?? false);
    setIsBestSeller(product.is_best_seller ?? false);
    setIsNewArrival(product.is_new_arrival ?? false);
    setSeoTitle(product.seo_title || '');
    setSeoDescription(product.seo_description || '');
    setIsDrawerOpen(true);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await uploadImageAction(formData, 'PRODUCTS');
        if (res.success && res.url) {
          setProductImages((prev) => [
            ...prev,
            {
              url: res.url!,
              alt_text: name || 'Product Image',
              sort_order: prev.length,
              is_cover: prev.length === 0,
            },
          ]);
          toast.success(`Image ${i + 1} uploaded to Cloudinary.`);
        } else {
          toast.error(res.error || 'Failed to upload image.');
        }
      }
    } catch {
      toast.error('An error occurred during image upload.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (productImages.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    if (!categoryId || categoryId === 0) {
      toast.error('Please select a product category.');
      return;
    }

    const regPrice = Number(price);
    const discPrice = discountPrice ? Number(discountPrice) : null;

    if (discPrice && discPrice > regPrice) {
      toast.error('Sale price cannot exceed regular price.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      sku,
      short_description: shortDescription || null,
      description: description || null,
      price: regPrice,
      discount_price: discPrice,
      stock: Number(stock),
      category_id: categoryId,
      collection_ids: selectedCollectionIds,
      fabric: fabric || null,
      pattern: pattern || null,
      color: color || null,
      weight: weight || null,
      country_of_origin: countryOfOrigin || 'Bangladesh',
      product_images: productImages,
      status,
      is_active: isActive,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      is_new_arrival: isNewArrival,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
    };

    try {
      if (editingProduct) {
        const res = await updateProductAction(editingProduct.id, payload);
        if (res.success) {
          toast.success(`Product "${name}" updated successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchProducts();
          });
        } else {
          toast.error(res.error || 'Failed to update product.');
        }
      } else {
        const res = await createProductAction(payload);
        if (res.success) {
          toast.success(`Product "${name}" created successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchProducts();
          });
        } else {
          toast.error(res.error || 'Failed to create product.');
        }
      }
    } catch {
      toast.error('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteProductAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Product "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        startTransition(() => {
          refetchProducts();
        });
      } else {
        toast.error(res.error || 'Failed to delete product.');
      }
    } catch {
      toast.error('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Product Catalog
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Manage inventory, pricing, SKU codes, Cloudinary media, and homepage promotional flags.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchProducts()}
            disabled={isLoading || isPending}
            className="p-2.5"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
          </Button>

          <Button type="button" variant="primary" size="md" onClick={handleOpenCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Product Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCollection={selectedCollection}
        onCollectionChange={setSelectedCollection}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
        flagFilter={flagFilter}
        onFlagChange={setFlagFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
        collections={collections}
      />

      {/* Products Data Table & Mobile Card View */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDeleteClick={(p) => setDeleteTarget(p)}
        currentPage={currentPage}
        totalPages={pages}
        totalProducts={total}
        onPageChange={setCurrentPage}
      />

      {/* Product Form Drawer */}
      <ProductFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        collections={collections}
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        autoSlug={autoSlug}
        setAutoSlug={setAutoSlug}
        shortDescription={shortDescription}
        setShortDescription={setShortDescription}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        discountPrice={discountPrice}
        setDiscountPrice={setDiscountPrice}
        sku={sku}
        setSku={setSku}
        autoSku={autoSku}
        setAutoSku={setAutoSku}
        stock={stock}
        setStock={setStock}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        selectedCollectionIds={selectedCollectionIds}
        setSelectedCollectionIds={setSelectedCollectionIds}
        fabric={fabric}
        setFabric={setFabric}
        pattern={pattern}
        setPattern={setPattern}
        color={color}
        setColor={setColor}
        weight={weight}
        setWeight={setWeight}
        countryOfOrigin={countryOfOrigin}
        setCountryOfOrigin={setCountryOfOrigin}
        productImages={productImages}
        setProductImages={setProductImages}
        status={status}
        setStatus={setStatus}
        isActive={isActive}
        setIsActive={setIsActive}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
        isBestSeller={isBestSeller}
        setIsBestSeller={setIsBestSeller}
        isNewArrival={isNewArrival}
        setIsNewArrival={setIsNewArrival}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        isUploadingImage={isUploadingImage}
        isSubmitting={isSubmitting}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Product Listing?"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Keep Product"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
