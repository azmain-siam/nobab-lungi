'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
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
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Package,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  RefreshCw,
  Star,
  Flame,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

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

  // Form Fields (8 Sections)
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

  // Handle Name Change & Auto Slug/SKU
  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
    if (autoSku && val.trim().length >= 2) {
      const generatedSku = `NL-${val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSku(generatedSku);
    }
  };

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

  // Cloudinary Image Upload
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

  // Cover Image Selection
  const setAsCoverImage = (index: number) => {
    setProductImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_cover: idx === index,
      }))
    );
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      if (next.length > 0 && !next.some((img) => img.is_cover)) {
        next[0].is_cover = true;
      }
      return next;
    });
  };

  // Toggle Collection Selection
  const toggleCollectionSelect = (colId: number) => {
    const numId = Number(colId);
    setSelectedCollectionIds((prev) =>
      prev.some((id) => Number(id) === numId)
        ? prev.filter((id) => Number(id) !== numId)
        : [...prev, numId]
    );
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

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filters & Search Controls Bar */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by product name, SKU, or slug..."
              className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
            />
          </div>

          {/* Filter Select Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#5e5e5b]">
              <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value={0}>All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Collection Filter */}
            {collections.length > 0 && (
              <select
                value={selectedCollection}
                onChange={(e) => {
                  setSelectedCollection(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
              >
                <option value={0}>All Collections</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            )}

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* Homepage Flag Filter */}
            <select
              value={flagFilter}
              onChange={(e) => {
                setFlagFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
            >
              <option value="all">All Flags</option>
              <option value="featured">Featured</option>
              <option value="best_seller">Best Seller</option>
              <option value="new_arrival">New Arrival</option>
            </select>

            {/* Sort Control */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2.5 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer font-medium"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low → High)</option>
              <option value="price_desc">Price (High → Low)</option>
              <option value="stock_asc">Stock (Low → High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">Cover</th>
                  <th className="p-4 font-semibold">Product & SKU</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price (BDT)</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Flags</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {products.map((p) => {
                  const coverImg =
                    p.product_images.find((img) => img.is_cover)?.url ||
                    p.product_images[0]?.url;

                  return (
                    <tr key={p.id} className="hover:bg-[#fbf9f8] transition">
                      <td className="p-4">
                        {coverImg ? (
                          <div className="relative h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                            <Image
                              src={coverImg}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center text-[#5e5e5b]">
                            <ImageIcon className="h-4 w-4 stroke-[1.5]" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#1b1c1c] max-w-xs truncate">{p.name}</div>
                        <div className="font-mono text-[10px] text-[#5e5e5b]">{p.sku || 'No SKU'}</div>
                      </td>
                      <td className="p-4 text-[#5e5e5b] font-medium">
                        {p.category_name || `Category #${p.category_id || '-'}`}
                      </td>
                      <td className="p-4 font-display font-semibold text-[#1b1c1c]">
                        {p.discount_price ? (
                          <div>
                            <span className="text-emerald-700">৳{p.discount_price.toLocaleString('en-BD')}</span>
                            <span className="text-[10px] text-[#5e5e5b] line-through block font-normal">
                              ৳{p.price.toLocaleString('en-BD')}
                            </span>
                          </div>
                        ) : (
                          `৳${p.price.toLocaleString('en-BD')}`
                        )}
                      </td>
                      <td className="p-4">
                        {p.stock > 0 ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            {p.stock} Units
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {p.status === 'published' ? (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200 uppercase">
                            Published
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-[#5e5e5b] bg-[#f5f3f3] px-2 py-0.5 border border-[#e3e2e2] uppercase">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {p.is_featured && (
                            <span className="text-[9px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200" title="Featured Product">
                              <Star className="h-2.5 w-2.5 inline fill-amber-500 text-amber-500 mr-0.5" />
                              Featured
                            </span>
                          )}
                          {p.is_best_seller && (
                            <span className="text-[9px] font-semibold text-purple-800 bg-purple-50 px-1.5 py-0.5 border border-purple-200" title="Best Seller">
                              <Flame className="h-2.5 w-2.5 inline text-purple-600 mr-0.5" />
                              Best Seller
                            </span>
                          )}
                          {p.is_new_arrival && (
                            <span className="text-[9px] font-semibold text-cyan-800 bg-cyan-50 px-1.5 py-0.5 border border-cyan-200" title="New Arrival">
                              <Sparkles className="h-2.5 w-2.5 inline text-cyan-600 mr-0.5" />
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 text-red-600 hover:text-red-800 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Package className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Products Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No products match your current search query or filter criteria.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {products.length} of {total} products
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-semibold text-[#1b1c1c]">
                Page {currentPage} of {pages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                disabled={currentPage === pages || isLoading}
                className="p-1.5 border border-[#e3e2e2] disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed hover:bg-[#f5f3f3]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Product Drawer (8 Structured Sections) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">
                  {editingProduct
                    ? `Updating ${editingProduct.name} (${editingProduct.sku || 'No SKU'})`
                    : 'Fill in details to list a new lungi item in the store catalog.'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 8 Structured Form Sections */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Royal Heritage Silk Lungi — Emerald Edition"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#1b1c1c]">URL Slug *</label>
                      <button
                        type="button"
                        onClick={() => setAutoSlug(!autoSlug)}
                        className="text-[10px] text-[#5e5e5b] hover:text-[#1b1c1c] underline"
                      >
                        {autoSlug ? 'Manual Edit' : 'Auto-Generate'}
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setAutoSlug(false);
                      }}
                      placeholder="e.g. royal-heritage-silk-lungi-emerald"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs font-mono text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Short Summary Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Brief one-line summary for product cards..."
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Full Craftsmanship Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed weaving history, cotton thread count, and care instructions..."
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Media & Product Images */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  2. Product Images (Cloudinary) *
                </h3>

                <div className="space-y-3">
                  {/* Upload Box */}
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-6 text-center space-y-2">
                    {isUploadingImage ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading images to Cloudinary...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                        <div className="text-xs text-[#5e5e5b]">
                          <label className="font-semibold text-[#1b1c1c] hover:underline cursor-pointer">
                            Click to upload product photos
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-[#5e5e5b]">JPG, PNG, WEBP up to 5MB. First image selected as cover.</p>
                      </>
                    )}
                  </div>

                  {/* Image Preview Grid */}
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                      {productImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative h-24 bg-[#f5f3f3] border overflow-hidden group ${
                            img.is_cover ? 'border-2 border-emerald-600 ring-2 ring-emerald-500/20' : 'border-[#e3e2e2]'
                          }`}
                        >
                          <Image src={img.url} alt={`Image ${idx + 1}`} fill className="object-cover" />

                          {img.is_cover && (
                            <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
                              <CheckCircle className="h-2.5 w-2.5" />
                              COVER
                            </span>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                            {!img.is_cover && (
                              <button
                                type="button"
                                onClick={() => setAsCoverImage(idx)}
                                className="px-1.5 py-1 bg-white text-[#1b1c1c] text-[9px] font-bold uppercase hover:bg-emerald-50 transition"
                                title="Set as Cover Image"
                              >
                                Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-red-600 text-white hover:bg-red-700 transition"
                              title="Remove Image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Pricing */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  3. Pricing & Discounts (BDT)
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Regular Price (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Sale Discount Price (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="e.g. 2100 (Optional)"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                    <p className="text-[10px] text-[#5e5e5b]">Must be less than Regular Price.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Inventory */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  4. Inventory & Stock Control
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#1b1c1c]">SKU Code *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSku(`NL-LUN-${Math.floor(1000 + Math.random() * 9000)}`);
                          setAutoSku(false);
                        }}
                        className="text-[10px] text-[#5e5e5b] hover:text-[#1b1c1c] underline"
                      >
                        Generate Random SKU
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => {
                        setSku(e.target.value);
                        setAutoSku(false);
                      }}
                      placeholder="e.g. LUN-COT-001"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs font-mono uppercase text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Category & Collections */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  5. Category & Collections Taxonomy
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Product Category *</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                    >
                      <option value={0}>-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.parent_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {collections.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Assign Showcase Collections</label>
                      <div className="grid grid-cols-2 gap-2 border border-[#e3e2e2] bg-[#fbf9f8] p-3 max-h-36 overflow-y-auto">
                        {collections.map((col) => (
                          <label key={col.id} className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCollectionIds.some((id) => Number(id) === Number(col.id))}
                              onChange={() => toggleCollectionSelect(col.id)}
                              className="h-3.5 w-3.5 rounded-none border-[#e3e2e2] accent-[#1b1c1c]"
                            />
                            <span className="truncate">{col.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 6: Product Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  6. Heritage Craft Specifications
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Fabric Material</label>
                    <input
                      type="text"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. 100% Organic Cotton"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Weave Pattern</label>
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="e.g. Classic Check / Jacquard"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Color</label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Emerald & Indigo"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 450g"
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7: Visibility & Homepage Flags */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  7. Store Visibility & Promotional Flags
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-2 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Featured</label>
                    <button
                      type="button"
                      onClick={() => setIsFeatured(!isFeatured)}
                      className={`w-full py-1.5 px-2 text-xs font-semibold uppercase tracking-wider border transition ${
                        isFeatured ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                    >
                      {isFeatured ? 'Yes' : 'No'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">Best Seller</label>
                    <button
                      type="button"
                      onClick={() => setIsBestSeller(!isBestSeller)}
                      className={`w-full py-1.5 px-2 text-xs font-semibold uppercase tracking-wider border transition ${
                        isBestSeller ? 'bg-purple-50 text-purple-800 border-purple-300' : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                    >
                      {isBestSeller ? 'Yes' : 'No'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">New Arrival</label>
                    <button
                      type="button"
                      onClick={() => setIsNewArrival(!isNewArrival)}
                      className={`w-full py-1.5 px-2 text-xs font-semibold uppercase tracking-wider border transition ${
                        isNewArrival ? 'bg-cyan-50 text-cyan-800 border-cyan-300' : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                    >
                      {isNewArrival ? 'Yes' : 'No'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 8: SEO Metadata */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] border-b border-[#e3e2e2] pb-2">
                  8. SEO Search Optimization (Optional)
                </h3>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">SEO Meta Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Custom page title for Google..."
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#1b1c1c]">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder="Custom snippet description for search engine results..."
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e3e2e2]">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || isUploadingImage}
                >
                  {isSubmitting
                    ? 'Saving Product...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        description={
          deleteTarget
            ? `Are you sure you want to delete product "${deleteTarget.name}" (${deleteTarget.sku || 'No SKU'})?`
            : ''
        }
        confirmText="Delete Product"
        isLoading={isDeleting}
      />
    </>
  );
}
