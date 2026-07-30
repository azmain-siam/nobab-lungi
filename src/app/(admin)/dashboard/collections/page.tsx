'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { uploadImageAction } from '@/actions/upload';
import {
  fetchAdminCollectionsAction,
  createCollectionAction,
  updateCollectionAction,
  deleteCollectionAction,
} from '@/features/dashboard/actions/collection-actions';
import type { Collection } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Layers,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  RefreshCw,
  Star,
} from 'lucide-react';

export default function AdminCollectionsPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Collections State
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchCollections = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchAdminCollectionsAction({
      search: searchQuery,
      status: statusFilter,
      featured: featuredFilter,
      page: currentPage,
      limit: 8,
    })
      .then((res) => {
        if (isMounted) {
          setCollections(res.collections);
          setTotal(res.total);
          setPages(res.pages);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading collections:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter, featuredFilter, currentPage, refreshKey]);

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

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setName('');
    setSlug('');
    setAutoSlug(true);
    setDescription('');
    setCoverImage('');
    setBannerUrl('');
    setIsFeatured(false);
    setSortOrder(0);
    setIsActive(true);
    setSeoTitle('');
    setSeoDescription('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setName(collection.name);
    setSlug(collection.slug);
    setAutoSlug(false);
    setDescription(collection.description || '');
    setCoverImage(collection.cover_image || collection.banner_url || '');
    setBannerUrl(collection.banner_url || '');
    setIsFeatured(collection.is_featured);
    setSortOrder(collection.sort_order || 0);
    setIsActive(collection.is_active ?? true);
    setSeoTitle(collection.seo_title || '');
    setSeoDescription(collection.seo_description || '');
    setIsDrawerOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'COLLECTIONS');
      if (res.success && res.url) {
        setCoverImage(res.url);
        toast.success('Collection cover image uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload cover image.');
      }
    } catch {
      toast.error('An error occurred during cover image upload.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'COLLECTIONS');
      if (res.success && res.url) {
        setBannerUrl(res.url);
        toast.success('Collection banner image uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload banner image.');
      }
    } catch {
      toast.error('An error occurred during banner image upload.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      cover_image: coverImage || null,
      banner_url: bannerUrl || null,
      is_featured: isFeatured,
      sort_order: Number(sortOrder),
      is_active: isActive,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
    };

    try {
      if (editingCollection) {
        const res = await updateCollectionAction(editingCollection.id, payload);
        if (res.success) {
          toast.success(`Collection "${name}" updated successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchCollections();
          });
        } else {
          toast.error(res.error || 'Failed to update collection.');
        }
      } else {
        const res = await createCollectionAction(payload);
        if (res.success) {
          toast.success(`Collection "${name}" created successfully.`);
          setIsDrawerOpen(false);
          startTransition(() => {
            refetchCollections();
          });
        } else {
          toast.error(res.error || 'Failed to create collection.');
        }
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteCollectionAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Collection "${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        startTransition(() => {
          refetchCollections();
        });
      } else {
        toast.error(res.error || 'Failed to delete collection.');
      }
    } catch {
      toast.error('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Collections Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Curate hero lungi collections, banner promotions, and featured showcase drops.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchCollections()}
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
            Create Collection
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search collections by name or slug..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

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
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Collections</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Standard Only</option>
          </select>
        </div>
      </div>

      {/* Collection Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : collections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold w-20">Cover</th>
                  <th className="p-4 font-semibold">Collection Name</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Featured</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Display Order</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4">
                      {col.cover_image || col.banner_url ? (
                        <div className="relative h-10 w-14 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                          <Image
                            src={col.cover_image || col.banner_url || ''}
                            alt={col.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-14 bg-[#f5f3f3] border border-[#e3e2e2] flex items-center justify-center text-[#5e5e5b]">
                          <ImageIcon className="h-4 w-4 stroke-[1.5]" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-[#1b1c1c]">{col.name}</td>
                    <td className="p-4 font-mono text-[11px] text-[#5e5e5b]">{col.slug}</td>
                    <td className="p-4">
                      {col.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-300">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#5e5e5b]">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      {col.is_active !== false ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 uppercase">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#5e5e5b] font-medium">{col.sort_order}</td>
                    <td className="p-4 font-medium text-[#1b1c1c]">
                      {col.product_count ?? 0} Products
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(col)}
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                          title="Edit Collection"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(col)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition"
                          title="Delete Collection"
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
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Layers className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Collections Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No collections match your criteria. Click &quot;Create Collection&quot; to build a showcase.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              Create Collection
            </Button>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#e3e2e2] text-xs text-[#5e5e5b]">
            <span>
              Showing {collections.length} of {total} collections
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

      {/* Create / Edit Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingCollection ? 'Edit Collection' : 'Create New Collection'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">
                  {editingCollection
                    ? `Updating collection #${editingCollection.id}`
                    : 'Curate a new lungi collection drop for your storefront.'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Eid Special Royal Collection 2026"
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
                  placeholder="e.g. eid-special-royal-collection"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] font-mono rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Cover Image
                </label>
                {coverImage ? (
                  <div className="relative h-32 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                    <Image
                      src={coverImage}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                      title="Remove Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-5 text-center space-y-1">
                    {isUploadingCover ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Cover to Cloudinary...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                        <div className="text-xs text-[#5e5e5b]">
                          <label className="font-semibold text-[#1b1c1c] hover:underline cursor-pointer">
                            Click to upload cover image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Banner Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Banner Image (Optional Showcase Banner)
                </label>
                {bannerUrl ? (
                  <div className="relative h-28 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                    <Image
                      src={bannerUrl}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                      title="Remove Banner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-5 text-center space-y-1">
                    {isUploadingBanner ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading Banner to Cloudinary...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-[#5e5e5b] mx-auto stroke-[1.5]" />
                        <div className="text-xs text-[#5e5e5b]">
                          <label className="font-semibold text-[#1b1c1c] hover:underline cursor-pointer">
                            Click to upload banner image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Promotional details about this collection drop..."
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
                />
              </div>

              {/* Display Settings */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e3e2e2]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Display Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Featured Showcase</label>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`w-full py-2 px-2 text-xs font-semibold uppercase tracking-wider border transition ${
                      isFeatured
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                    }`}
                  >
                    {isFeatured ? 'Featured' : 'Standard'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Visibility</label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full py-2 px-2 text-xs font-semibold uppercase tracking-wider border transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="space-y-3 pt-2 border-t border-[#e3e2e2]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5e5e5b]">
                  SEO Metadata (Optional)
                </h3>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#1b1c1c]">SEO Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Custom page title for search engines..."
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#1b1c1c]">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Custom description snippet for Google..."
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-1.5 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

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
                  disabled={isSubmitting || isUploadingCover || isUploadingBanner}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingCollection
                    ? 'Update Collection'
                    : 'Create Collection'}
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
        title="Delete Collection?"
        description={
          deleteTarget
            ? `Are you sure you want to delete collection "${deleteTarget.name}"?`
            : ''
        }
        confirmText="Delete Collection"
        isLoading={isDeleting}
      />
    </>
  );
}
