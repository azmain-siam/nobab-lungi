'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { uploadImageAction } from '@/actions/upload';
import {
  fetchAdminCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/features/dashboard/actions/category-actions';
import type { Category } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Grid,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Categories & Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [parentTypeFilter, setParentTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [parentType, setParentType] = useState<'lungi' | 'saree'>('lungi');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchCategories = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchAdminCategoriesAction({
      search: searchQuery,
      status: statusFilter,
      parentType: parentTypeFilter,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setCategories(res.categories);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter, parentTypeFilter, currentPage, refreshKey]);

  // Handle Name Input Change & Auto Slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Open Drawer for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setAutoSlug(true);
    setParentType('lungi');
    setDescription('');
    setImageUrl('');
    setSortOrder(0);
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setAutoSlug(false);
    setParentType(category.parent_type);
    setDescription(category.description || '');
    setImageUrl(category.image_url || '');
    setSortOrder(category.sort_order || 0);
    setIsActive(category.is_active ?? true);
    setIsDrawerOpen(true);
  };

  // Image Upload Handler to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'CATEGORIES');
      if (res.success && res.url) {
        setImageUrl(res.url);
        toast.success('Category image uploaded to Cloudinary.');
      } else {
        toast.error(res.error || 'Failed to upload image.');
      }
    } catch {
      toast.error('An unexpected error occurred during image upload.');
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submission (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      image_url: imageUrl || null,
      parent_type: parentType,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, payload);
        if (res.success) {
          toast.success(`Category "${name}" updated successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchCategories();
          });
        } else {
          toast.error(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createCategoryAction(payload);
        if (res.success) {
          toast.success(`Category "${name}" created successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchCategories();
          });
        } else {
          toast.error(res.error || 'Failed to create category.');
        }
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Category "${deleteTarget.name}" deleted successfully.`);
        setDeleteTarget(null);
        startTransition(() => {
          refetchCategories();
        });
      } else {
        toast.error(res.error || 'Failed to delete category.');
      }
    } catch {
      toast.error('An unexpected error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Category Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Organize products into lungi and saree categories, manage slugs, and toggle active status.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchCategories()}
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
            Add Category
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
            placeholder="Search categories by name or slug..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5e5e5b]">
            <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <select
            value={parentTypeFilter}
            onChange={(e) => {
              setParentTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="lungi">Lungi</option>
            <option value="saree">Saree</option>
          </select>
        </div>
      </div>

      {/* Categories Table View */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          /* Loading Skeleton State */
          <div className="p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">Image</th>
                  <th className="p-4 font-semibold">Category Name</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Parent Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4">
                      {cat.image_url ? (
                        <div className="relative h-10 w-10 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                          <Image
                            src={cat.image_url}
                            alt={cat.name}
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
                      <div className="font-semibold text-[#1b1c1c]">{cat.name}</div>
                      {cat.description && (
                        <div className="text-[11px] text-[#5e5e5b] truncate max-w-xs">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#5e5e5b]">{cat.slug}</td>
                    <td className="p-4">
                      {cat.parent_type === 'lungi' ? (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200 uppercase tracking-wider">
                          Lungi
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-200 uppercase tracking-wider">
                          Saree
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {cat.is_active !== false ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 uppercase">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-[#1b1c1c]">
                      {cat.product_count ?? 0} Products
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Grid className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Categories Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No categories match your search criteria. Click &quot;Add Category&quot; to create your first product category.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {categories.length} of {total} categories
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

      {/* Drawer / Modal Form for Create & Edit */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">
                  {editingCategory
                    ? `Updating category #${editingCategory.id}`
                    : 'Fill in details to add a new category taxonomy.'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Silk Jamdani Saree"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1b1c1c]">
                    URL Slug *
                  </label>
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
                  placeholder="e.g. silk-jamdani-saree"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] font-mono rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              {/* Parent Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Parent Category Type *
                </label>
                <select
                  value={parentType}
                  onChange={(e) => setParentType(e.target.value as 'lungi' | 'saree')}
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                >
                  <option value="lungi">Lungi</option>
                  <option value="saree">Saree</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Category Thumbnail Image
                </label>

                {imageUrl ? (
                  <div className="relative h-32 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt="Category Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                      title="Remove Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-6 text-center space-y-2">
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading to Cloudinary...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                        <div className="text-xs text-[#5e5e5b]">
                          <label className="font-semibold text-[#1b1c1c] hover:underline cursor-pointer">
                            Click to upload image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-[#5e5e5b]">PNG, JPG, WEBP up to 5MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details about this category..."
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              {/* Sort Order & Active Switch */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e3e2e2]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Visibility Status</label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-2 px-3 text-xs font-semibold uppercase tracking-wider border transition ${isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
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
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingCategory
                      ? 'Update Category'
                      : 'Create Category'}
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
        title="Delete Category?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This will check for product dependencies first.`
            : ''
        }
        confirmText="Delete Category"
        isLoading={isDeleting}
      />
    </>
  );
}
