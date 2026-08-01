'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { uploadImageAction } from '@/actions/upload';
import {
  fetchHomepageDataAction,
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
  updateHomepageSectionsAction,
  updateFeaturedCategoriesAction,
  updateFeaturedCollectionsAction,
  updateFeaturedProductsAction,
  updateBestSellersAction,
  updateNewArrivalsConfigAction,
  updateBrandStoryAction,
  saveWhyChooseUsCardAction,
  deleteWhyChooseUsCardAction,
  updateNewsletterConfigAction,
} from '@/features/dashboard/actions/homepage-actions';
import type { Banner, Category, Collection, HomepageConfig, HomepageSection, WhyChooseUsCard } from '@/types';
import type { AdminProductListItem } from '@/services/product-service';
import {
  Sliders,
  Plus,
  Trash2,
  Edit,
  X,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Loader2,
  Layout,
  Grid,
  Layers,
  Package,
  Flame,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Mail,
  CheckCircle,
} from 'lucide-react';

export default function AdminHomepageCMSPage() {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Active CMS Tab
  const [activeTab, setActiveTab] = useState<
    | 'banners'
    | 'sections'
    | 'categories'
    | 'collections'
    | 'featured_products'
    | 'best_sellers'
    | 'new_arrivals'
    | 'brand_story'
    | 'why_us'
    | 'newsletter'
  >('banners');

  // Master Data State
  const [banners, setBanners] = useState<Banner[]>([]);
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hero Banner Drawer State
  const [isBannerDrawerOpen, setIsBannerDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerDescription, setBannerDescription] = useState('');
  const [bannerDesktopImg, setBannerDesktopImg] = useState('');
  const [bannerMobileImg, setBannerMobileImg] = useState('');
  const [bannerPrimaryBtnText, setBannerPrimaryBtnText] = useState('Shop Now');
  const [bannerPrimaryBtnUrl, setBannerPrimaryBtnUrl] = useState('/products');
  const [bannerSecondaryBtnText, setBannerSecondaryBtnText] = useState('');
  const [bannerSecondaryBtnUrl, setBannerSecondaryBtnUrl] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerIsPrimary, setBannerIsPrimary] = useState(false);
  const [bannerSortOrder, setBannerSortOrder] = useState(0);
  const [bannerStartDate, setBannerStartDate] = useState('');
  const [bannerEndDate, setBannerEndDate] = useState('');

  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Why Choose Us Drawer State
  const [isWhyUsDrawerOpen, setIsWhyUsDrawerOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<WhyChooseUsCard | null>(null);
  const [cardIcon, setCardIcon] = useState('Sparkles');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardSortOrder, setCardSortOrder] = useState(0);

  // Delete Modals State
  const [deleteBannerTarget, setDeleteBannerTarget] = useState<Banner | null>(null);
  const [deleteCardTarget, setDeleteCardTarget] = useState<WhyChooseUsCard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const refetchData = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchHomepageDataAction()
      .then((res) => {
        if (isMounted) {
          setBanners(res.banners);
          setConfig(res.config);
          setCategories(res.categories);
          setCollections(res.collections);
          setProducts(res.products);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching homepage CMS data:', error);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Open Create Banner Drawer
  const handleOpenCreateBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerDescription('');
    setBannerDesktopImg('');
    setBannerMobileImg('');
    setBannerPrimaryBtnText('Shop Special Lungi');
    setBannerPrimaryBtnUrl('/products');
    setBannerSecondaryBtnText('View Collections');
    setBannerSecondaryBtnUrl('/collections');
    setBannerIsActive(true);
    setBannerIsPrimary(banners.length === 0);
    setBannerSortOrder(0);
    setBannerStartDate('');
    setBannerEndDate('');
    setIsBannerDrawerOpen(true);
  };

  // Open Edit Banner Drawer
  const handleOpenEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle || '');
    setBannerDescription(banner.description || '');
    setBannerDesktopImg(banner.desktop_image);
    setBannerMobileImg(banner.mobile_image || '');
    setBannerPrimaryBtnText(banner.primary_btn_text || 'Shop Now');
    setBannerPrimaryBtnUrl(banner.primary_btn_url || '/products');
    setBannerSecondaryBtnText(banner.secondary_btn_text || '');
    setBannerSecondaryBtnUrl(banner.secondary_btn_url || '');
    setBannerIsActive(banner.is_active);
    setBannerIsPrimary(banner.is_primary);
    setBannerSortOrder(banner.sort_order || 0);
    setBannerStartDate(banner.start_date ? banner.start_date.split('T')[0] : '');
    setBannerEndDate(banner.end_date ? banner.end_date.split('T')[0] : '');
    setIsBannerDrawerOpen(true);
  };

  // Desktop Banner Upload
  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDesktop(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        setBannerDesktopImg(res.url);
        toast.success('Desktop banner uploaded to Cloudinary.');
      } else {
        toast.error(res.error || 'Failed to upload desktop banner.');
      }
    } catch {
      toast.error('An error occurred during upload.');
    } finally {
      setIsUploadingDesktop(false);
    }
  };

  // Mobile Banner Upload
  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMobile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        setBannerMobileImg(res.url);
        toast.success('Mobile banner uploaded to Cloudinary.');
      } else {
        toast.error(res.error || 'Failed to upload mobile banner.');
      }
    } catch {
      toast.error('An error occurred during upload.');
    } finally {
      setIsUploadingMobile(false);
    }
  };

  // Banner Submit Handler
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerDesktopImg) {
      toast.error('Please upload a desktop banner image.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: bannerTitle,
      subtitle: bannerSubtitle || null,
      description: bannerDescription || null,
      desktop_image: bannerDesktopImg,
      mobile_image: bannerMobileImg || null,
      primary_btn_text: bannerPrimaryBtnText || null,
      primary_btn_url: bannerPrimaryBtnUrl || null,
      secondary_btn_text: bannerSecondaryBtnText || null,
      secondary_btn_url: bannerSecondaryBtnUrl || null,
      is_active: bannerIsActive,
      is_primary: bannerIsPrimary,
      sort_order: Number(bannerSortOrder),
      start_date: bannerStartDate || null,
      end_date: bannerEndDate || null,
    };

    try {
      if (editingBanner) {
        const res = await updateBannerAction(editingBanner.id, payload);
        if (res.success) {
          toast.success(`Banner "${bannerTitle}" updated.`);
          setIsBannerDrawerOpen(false);
          startTransition(() => refetchData());
        } else {
          toast.error(res.error || 'Failed to update banner.');
        }
      } else {
        const res = await createBannerAction(payload);
        if (res.success) {
          toast.success(`Banner "${bannerTitle}" created.`);
          setIsBannerDrawerOpen(false);
          startTransition(() => refetchData());
        } else {
          toast.error(res.error || 'Failed to create banner.');
        }
      }
    } catch {
      toast.error('An error occurred while saving banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Banner Delete Confirm
  const handleDeleteBannerConfirm = async () => {
    if (!deleteBannerTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteBannerAction(deleteBannerTarget.id);
      if (res.success) {
        toast.success(`Banner "${deleteBannerTarget.title}" deleted.`);
        setDeleteBannerTarget(null);
        startTransition(() => refetchData());
      } else {
        toast.error(res.error || 'Failed to delete banner.');
      }
    } catch {
      toast.error('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Section Toggle Visibility & Reorder
  const handleToggleSectionVisible = async (key: string) => {
    if (!config) return;

    const updatedSections = config.sections.map((s: HomepageSection) =>
      s.key === key ? { ...s, is_visible: !s.is_visible } : s
    );

    setConfig({ ...config, sections: updatedSections });

    const res = await updateHomepageSectionsAction(updatedSections);
    if (res.success) {
      toast.success('Homepage section visibility updated.');
    } else {
      toast.error(res.error || 'Failed to update sections.');
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    if (!config) return;

    const newSections = [...config.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    // Recalculate sort_order
    newSections.forEach((s: HomepageSection, idx: number) => {
      s.sort_order = idx + 1;
    });

    setConfig({ ...config, sections: newSections });

    const res = await updateHomepageSectionsAction(newSections);
    if (res.success) {
      toast.success('Section display order updated.');
    } else {
      toast.error(res.error || 'Failed to reorder sections.');
    }
  };

  // Toggle Featured Categories
  const handleToggleFeaturedCategory = async (catId: number) => {
    if (!config) return;

    const currentIds = config.featured_category_ids || [];
    const nextIds = currentIds.includes(catId)
      ? currentIds.filter((id: number) => id !== catId)
      : [...currentIds, catId];

    setConfig({ ...config, featured_category_ids: nextIds });

    const res = await updateFeaturedCategoriesAction(nextIds);
    if (res.success) {
      toast.success('Featured categories updated.');
    } else {
      toast.error(res.error || 'Failed to update categories.');
    }
  };

  // Toggle Featured Collections
  const handleToggleFeaturedCollection = async (colId: number) => {
    if (!config) return;

    const currentIds = config.featured_collection_ids || [];
    const nextIds = currentIds.includes(colId)
      ? currentIds.filter((id: number) => id !== colId)
      : [...currentIds, colId];

    setConfig({ ...config, featured_collection_ids: nextIds });

    const res = await updateFeaturedCollectionsAction(nextIds);
    if (res.success) {
      toast.success('Featured collections updated.');
    } else {
      toast.error(res.error || 'Failed to update collections.');
    }
  };

  // Toggle Featured Products
  const handleToggleFeaturedProduct = async (prodId: string) => {
    if (!config) return;

    const currentIds = config.featured_product_ids || [];
    const nextIds = currentIds.includes(prodId)
      ? currentIds.filter((id: string) => id !== prodId)
      : [...currentIds, prodId];

    setConfig({ ...config, featured_product_ids: nextIds });

    const res = await updateFeaturedProductsAction(nextIds);
    if (res.success) {
      toast.success('Featured products updated.');
    } else {
      toast.error(res.error || 'Failed to update featured products.');
    }
  };

  // Toggle Best Sellers
  const handleToggleBestSellerProduct = async (prodId: string) => {
    if (!config) return;

    const currentIds = config.best_seller_product_ids || [];
    const nextIds = currentIds.includes(prodId)
      ? currentIds.filter((id: string) => id !== prodId)
      : [...currentIds, prodId];

    setConfig({ ...config, best_seller_product_ids: nextIds });

    const res = await updateBestSellersAction(nextIds);
    if (res.success) {
      toast.success('Best seller products updated.');
    } else {
      toast.error(res.error || 'Failed to update best sellers.');
    }
  };

  // Save New Arrivals Config
  const handleSaveNewArrivalsConfig = async (limit: number, isActive: boolean) => {
    if (!config) return;

    const nextConfig = { limit, is_active: isActive };
    setConfig({ ...config, new_arrivals_config: nextConfig });

    const res = await updateNewArrivalsConfigAction(limit, isActive);
    if (res.success) {
      toast.success('New arrivals settings saved.');
    } else {
      toast.error(res.error || 'Failed to save new arrivals settings.');
    }
  };

  // Brand Story Upload & Save
  const handleBrandStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadImageAction(formData, 'BANNERS');
      if (res.success && res.url) {
        const updatedStory = { ...config.brand_story, image_url: res.url };
        setConfig({ ...config, brand_story: updatedStory });
        toast.success('Brand story image uploaded.');
      } else {
        toast.error(res.error || 'Failed to upload image.');
      }
    } catch {
      toast.error('An error occurred during upload.');
    }
  };

  const handleSaveBrandStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setIsSubmitting(true);
    try {
      const res = await updateBrandStoryAction(config.brand_story);
      if (res.success) {
        toast.success('Brand story updated successfully.');
      } else {
        toast.error(res.error || 'Failed to update brand story.');
      }
    } catch {
      toast.error('An error occurred while saving brand story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Why Choose Us Card
  const handleSaveWhyUsCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cardPayload = {
      id: editingCard ? editingCard.id : `card-${Date.now()}`,
      icon: cardIcon,
      title: cardTitle,
      description: cardDescription,
      sort_order: Number(cardSortOrder),
    };

    try {
      const res = await saveWhyChooseUsCardAction(cardPayload);
      if (res.success) {
        toast.success(`Feature card "${cardTitle}" saved.`);
        setIsWhyUsDrawerOpen(false);
        startTransition(() => refetchData());
      } else {
        toast.error(res.error || 'Failed to save card.');
      }
    } catch {
      toast.error('An error occurred while saving card.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWhyUsCardConfirm = async () => {
    if (!deleteCardTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteWhyChooseUsCardAction(deleteCardTarget.id);
      if (res.success) {
        toast.success(`Feature card "${deleteCardTarget.title}" deleted.`);
        setDeleteCardTarget(null);
        startTransition(() => refetchData());
      } else {
        toast.error(res.error || 'Failed to delete card.');
      }
    } catch {
      toast.error('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Newsletter Config
  const handleSaveNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setIsSubmitting(true);
    try {
      const res = await updateNewsletterConfigAction(config.newsletter);
      if (res.success) {
        toast.success('Newsletter settings saved.');
      } else {
        toast.error(res.error || 'Failed to save newsletter settings.');
      }
    } catch {
      toast.error('An error occurred while saving newsletter settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl flex items-center gap-2">
            {/* <Sliders className="h-6 w-6 stroke-[1.5] text-amber-800" /> */}
            Homepage CMS Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Dynamically control hero banners, section ordering, featured collections, and homepage promotional modules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => refetchData()}
            disabled={isLoading || isPending}
            className="p-2.5"
            title="Refresh All CMS Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading || isPending ? 'animate-spin' : ''}`} />
          </Button>

          {activeTab === 'banners' && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleOpenCreateBanner}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Hero Banner
            </Button>
          )}

          {activeTab === 'why_us' && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                setEditingCard(null);
                setCardIcon('Sparkles');
                setCardTitle('');
                setCardDescription('');
                setCardSortOrder(0);
                setIsWhyUsDrawerOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Feature Card
            </Button>
          )}
        </div>
      </div>

      {/* 10 Module Tabs Navigation */}
      <div className="bg-white border border-[#e3e2e2] overflow-x-auto">
        <nav className="flex whitespace-nowrap border-b border-[#e3e2e2] text-xs font-semibold">
          {[
            { id: 'banners', label: 'Hero Banners', icon: Layout },
            { id: 'sections', label: 'Section Layout', icon: Sliders },
            { id: 'categories', label: 'Featured Categories', icon: Grid },
            { id: 'collections', label: 'Featured Collections', icon: Layers },
            { id: 'featured_products', label: 'Featured Products', icon: Package },
            { id: 'best_sellers', label: 'Best Sellers', icon: Flame },
            { id: 'new_arrivals', label: 'New Arrivals', icon: Sparkles },
            { id: 'brand_story', label: 'Brand Story', icon: BookOpen },
            { id: 'why_us', label: 'Why Choose Us', icon: ShieldCheck },
            { id: 'newsletter', label: 'Newsletter', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition ${isActive
                    ? 'border-[#1b1c1c] text-[#1b1c1c] bg-[#fbf9f8]'
                    : 'border-transparent text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#fbf9f8]'
                  }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#1b1c1c]' : 'text-[#5e5e5b]'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white border border-[#e3e2e2] p-8 space-y-4">
            <div className="h-6 bg-[#f5f3f3] w-1/3 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-[#fbf9f8] border border-[#e3e2e2] animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* MODULE 1: HERO BANNERS */}
            {activeTab === 'banners' && (
              <div className="bg-white border border-[#e3e2e2]">
                {banners.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                          <th className="p-4 font-semibold w-24">Desktop Img</th>
                          <th className="p-4 font-semibold">Banner Title</th>
                          <th className="p-4 font-semibold">CTA Button</th>
                          <th className="p-4 font-semibold">Primary Banner</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Display Order</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e2e2]">
                        {banners.map((b) => (
                          <tr key={b.id} className="hover:bg-[#fbf9f8] transition">
                            <td className="p-4">
                              <div className="relative h-12 w-20 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                                <Image
                                  src={b.desktop_image}
                                  alt={b.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-[#1b1c1c]">{b.title}</div>
                              {b.subtitle && <div className="text-[11px] text-[#5e5e5b]">{b.subtitle}</div>}
                            </td>
                            <td className="p-4">
                              <span className="font-mono text-[11px] text-[#1b1c1c] bg-[#f5f3f3] px-2 py-0.5 border border-[#e3e2e2]">
                                {b.primary_btn_text || 'Shop Now'} ({b.primary_btn_url || '/products'})
                              </span>
                            </td>
                            <td className="p-4">
                              {b.is_primary ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 border border-amber-300">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  PRIMARY HERO
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#5e5e5b]">Standard Slide</span>
                              )}
                            </td>
                            <td className="p-4">
                              {b.is_active ? (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
                                  Active
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 uppercase">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-medium text-[#1b1c1c]">{b.sort_order}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBanner(b)}
                                  className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                                  title="Edit Banner"
                                >
                                  <Edit className="h-4 w-4 stroke-[1.5]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteBannerTarget(b)}
                                  className="p-1.5 text-red-600 hover:text-red-800 transition"
                                  title="Delete Banner"
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
                      <Layout className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Hero Banners Configured</h3>
                    <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
                      Click &quot;Add Hero Banner&quot; to upload promotional slides for the storefront hero carousel.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleOpenCreateBanner}
                      className="gap-2 mt-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Hero Banner
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 2: SECTION LAYOUT & ORDERING */}
            {activeTab === 'sections' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Homepage Section Hierarchy & Visibility
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Enable or disable sections and reorder their vertical arrangement on the live homepage.
                  </p>
                </div>

                <div className="divide-y divide-[#e3e2e2] border border-[#e3e2e2]">
                  {config.sections.map((section: HomepageSection, idx: number) => (
                    <div
                      key={section.key}
                      className={`flex items-center justify-between p-4 transition ${section.is_visible ? 'bg-white' : 'bg-[#fbf9f8] opacity-60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#5e5e5b] w-6">
                          #{section.sort_order}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-[#1b1c1c]">{section.name}</div>
                          <div className="font-mono text-[10px] text-[#5e5e5b]">{section.key}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Move Controls */}
                        <div className="flex items-center gap-1 border border-[#e3e2e2]">
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 hover:bg-[#f5f3f3] disabled:opacity-30 transition"
                            title="Move Up"
                          >
                            <MoveUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === config.sections.length - 1}
                            className="p-1.5 hover:bg-[#f5f3f3] disabled:opacity-30 transition"
                            title="Move Down"
                          >
                            <MoveDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Visibility Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleSectionVisible(section.key)}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${section.is_visible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                        >
                          {section.is_visible ? (
                            <>
                              <Eye className="h-3.5 w-3.5" /> Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" /> Hidden
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 3: FEATURED CATEGORIES */}
            {activeTab === 'categories' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Featured Homepage Categories
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Select categories to highlight in the Featured Categories showcase grid.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                  {categories.map((cat) => {
                    const isSelected = (config.featured_category_ids || []).includes(cat.id);

                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleToggleFeaturedCategory(cat.id)}
                        className={`p-4 border text-center cursor-pointer transition relative ${isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                            : 'border-[#e3e2e2] bg-[#fbf9f8] hover:border-[#1b1c1c]'
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 text-emerald-700">
                            <CheckCircle className="h-4 w-4 fill-emerald-600 text-white" />
                          </div>
                        )}
                        <div className="font-semibold text-xs text-[#1b1c1c]">{cat.name}</div>
                        <div className="text-[10px] text-[#5e5e5b] uppercase mt-0.5">{cat.parent_type}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 4: FEATURED COLLECTIONS */}
            {activeTab === 'collections' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Featured Homepage Collections
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Select collections to display in the Featured Collections banner grid.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {collections.map((col) => {
                    const isSelected = (config.featured_collection_ids || []).includes(col.id);

                    return (
                      <div
                        key={col.id}
                        onClick={() => handleToggleFeaturedCollection(col.id)}
                        className={`p-4 border flex items-center justify-between cursor-pointer transition ${isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                            : 'border-[#e3e2e2] bg-[#fbf9f8] hover:border-[#1b1c1c]'
                          }`}
                      >
                        <div>
                          <div className="font-semibold text-xs text-[#1b1c1c]">{col.name}</div>
                          <div className="font-mono text-[10px] text-[#5e5e5b]">{col.slug}</div>
                        </div>

                        {isSelected ? (
                          <CheckCircle className="h-5 w-5 fill-emerald-600 text-white" />
                        ) : (
                          <span className="text-[10px] text-[#5e5e5b] border border-[#e3e2e2] px-2 py-1 bg-white">
                            Select
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 5: FEATURED PRODUCTS */}
            {activeTab === 'featured_products' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Featured Homepage Products Selection
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Curate specific products to showcase in the Featured Products section.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 max-h-96 overflow-y-auto border border-[#e3e2e2] p-3">
                  {products.map((p) => {
                    const isSelected = (config.featured_product_ids || []).includes(p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleFeaturedProduct(p.id)}
                        className={`p-3 border flex items-center justify-between cursor-pointer transition ${isSelected
                            ? 'border-emerald-600 bg-emerald-50/50'
                            : 'border-[#e3e2e2] bg-[#fbf9f8] hover:border-[#1b1c1c]'
                          }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-xs text-[#1b1c1c] truncate">{p.name}</div>
                          <div className="text-[10px] text-emerald-700 font-display">৳{p.price}</div>
                        </div>

                        {isSelected ? (
                          <CheckCircle className="h-4 w-4 fill-emerald-600 text-white shrink-0" />
                        ) : (
                          <span className="text-[9px] text-[#5e5e5b] border border-[#e3e2e2] px-1.5 py-0.5 bg-white shrink-0">
                            Add
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 6: BEST SELLERS */}
            {activeTab === 'best_sellers' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Best Sellers Manual Selection
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Select products to feature in the Best Sellers showcase carousel.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 max-h-96 overflow-y-auto border border-[#e3e2e2] p-3">
                  {products.map((p) => {
                    const isSelected = (config.best_seller_product_ids || []).includes(p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleBestSellerProduct(p.id)}
                        className={`p-3 border flex items-center justify-between cursor-pointer transition ${isSelected
                            ? 'border-purple-600 bg-purple-50/50'
                            : 'border-[#e3e2e2] bg-[#fbf9f8] hover:border-[#1b1c1c]'
                          }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-xs text-[#1b1c1c] truncate">{p.name}</div>
                          <div className="text-[10px] text-purple-700 font-display">৳{p.price}</div>
                        </div>

                        {isSelected ? (
                          <Flame className="h-4 w-4 text-purple-600 fill-purple-500 shrink-0" />
                        ) : (
                          <span className="text-[9px] text-[#5e5e5b] border border-[#e3e2e2] px-1.5 py-0.5 bg-white shrink-0">
                            Select
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 7: NEW ARRIVALS */}
            {activeTab === 'new_arrivals' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4 max-w-xl">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    New Arrivals Showcase Settings
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Automatically displays the latest published items in the store.
                  </p>
                </div>

                <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Maximum Products Displayed</label>
                    <input
                      type="number"
                      min={4}
                      max={24}
                      value={config.new_arrivals_config.limit}
                      onChange={(e) =>
                        handleSaveNewArrivalsConfig(
                          Number(e.target.value),
                          config.new_arrivals_config.is_active
                        )
                      }
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#e3e2e2] pt-3">
                    <span className="text-xs font-semibold text-[#1b1c1c]">Showcase Active Status</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveNewArrivalsConfig(
                          config.new_arrivals_config.limit,
                          !config.new_arrivals_config.is_active
                        )
                      }
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${config.new_arrivals_config.is_active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                    >
                      {config.new_arrivals_config.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: BRAND STORY */}
            {activeTab === 'brand_story' && config && (
              <form onSubmit={handleSaveBrandStory} className="bg-white border border-[#e3e2e2] p-6 space-y-5 max-w-2xl">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Heritage Brand Story Content
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Manage the promotional brand story section on the homepage.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Story Title *</label>
                    <input
                      type="text"
                      required
                      value={config.brand_story.title}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          brand_story: { ...config.brand_story, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Craftsmanship Narrative *</label>
                    <textarea
                      rows={4}
                      required
                      value={config.brand_story.description}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          brand_story: { ...config.brand_story, description: e.target.value },
                        })
                      }
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Section Image</label>
                    {config.brand_story.image_url ? (
                      <div className="relative h-40 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                        <Image
                          src={config.brand_story.image_url}
                          alt="Brand Story Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setConfig({
                              ...config,
                              brand_story: { ...config.brand_story, image_url: null },
                            })
                          }
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-5 text-center">
                        <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                          Click to upload brand story photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBrandStoryImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Button Label</label>
                      <input
                        type="text"
                        value={config.brand_story.button_text || ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            brand_story: { ...config.brand_story, button_text: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#1b1c1c]">Button URL</label>
                      <input
                        type="text"
                        value={config.brand_story.button_url || ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            brand_story: { ...config.brand_story, button_url: e.target.value },
                          })
                        }
                        className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e3e2e2] flex justify-end">
                  <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving Brand Story...' : 'Save Brand Story'}
                  </Button>
                </div>
              </form>
            )}

            {/* MODULE 9: WHY CHOOSE US */}
            {activeTab === 'why_us' && config && (
              <div className="bg-white border border-[#e3e2e2] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                      Why Choose Us Feature Cards
                    </h3>
                    <p className="text-xs text-[#5e5e5b]">
                      Manage feature highlights displayed on the homepage.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingCard(null);
                      setCardIcon('Sparkles');
                      setCardTitle('');
                      setCardDescription('');
                      setCardSortOrder(0);
                      setIsWhyUsDrawerOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Feature Card
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {config.why_choose_us.map((card: WhyChooseUsCard) => (
                    <div
                      key={card.id}
                      className="p-4 border border-[#e3e2e2] bg-[#fbf9f8] flex items-start justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-[#1b1c1c]">{card.title}</div>
                        <div className="text-xs text-[#5e5e5b] mt-1">{card.description}</div>
                        <div className="font-mono text-[10px] text-[#5e5e5b] mt-2">
                          Icon: {card.icon} | Order: {card.sort_order}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCard(card);
                            setCardIcon(card.icon);
                            setCardTitle(card.title);
                            setCardDescription(card.description);
                            setCardSortOrder(card.sort_order);
                            setIsWhyUsDrawerOpen(true);
                          }}
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c]"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCardTarget(card)}
                          className="p-1.5 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 10: NEWSLETTER */}
            {activeTab === 'newsletter' && config && (
              <form onSubmit={handleSaveNewsletter} className="bg-white border border-[#e3e2e2] p-6 space-y-4 max-w-xl">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    Newsletter Subscription Banner
                  </h3>
                  <p className="text-xs text-[#5e5e5b]">
                    Customize newsletter subscription heading and active status.
                  </p>
                </div>

                <div className="space-y-4 border-t border-[#e3e2e2] pt-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Heading *</label>
                    <input
                      type="text"
                      required
                      value={config.newsletter.heading}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          newsletter: { ...config.newsletter, heading: e.target.value },
                        })
                      }
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1b1c1c]">Subheading Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={config.newsletter.description}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          newsletter: { ...config.newsletter, description: e.target.value },
                        })
                      }
                      className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#e3e2e2] pt-3">
                    <span className="text-xs font-semibold text-[#1b1c1c]">Master Enable Switch</span>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          newsletter: {
                            ...config.newsletter,
                            is_enabled: !config.newsletter.is_enabled,
                          },
                        })
                      }
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition ${config.newsletter.is_enabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                    >
                      {config.newsletter.is_enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e3e2e2] flex justify-end">
                  <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving Newsletter...' : 'Save Newsletter Settings'}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Hero Banner Drawer Form */}
      {isBannerDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsBannerDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">
                  {editingBanner ? `Updating Banner #${editingBanner.id}` : 'Add a new slide to the main hero slider.'}
                </p>
              </div>
              <button
                onClick={() => setIsBannerDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Royal Heritage Handloom Collection 2026"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Subtitle</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. 100% Organic Cotton Thread Weave"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              {/* Desktop Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1b1c1c]">Desktop Image *</label>
                {bannerDesktopImg ? (
                  <div className="relative h-32 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                    <Image src={bannerDesktopImg} alt="Desktop Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerDesktopImg('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-5 text-center">
                    {isUploadingDesktop ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading Desktop Banner...
                      </div>
                    ) : (
                      <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                        Click to upload desktop banner
                        <input type="file" accept="image/*" onChange={handleDesktopUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1b1c1c]">Mobile Image (Optional)</label>
                {bannerMobileImg ? (
                  <div className="relative h-28 w-full bg-[#fbf9f8] border border-[#e3e2e2] overflow-hidden group">
                    <Image src={bannerMobileImg} alt="Mobile Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerMobileImg('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white shadow-md hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#e3e2e2] bg-[#fbf9f8] p-5 text-center">
                    {isUploadingMobile ? (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#5e5e5b]">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading Mobile Banner...
                      </div>
                    ) : (
                      <label className="font-semibold text-xs text-[#1b1c1c] hover:underline cursor-pointer">
                        Click to upload mobile banner
                        <input type="file" accept="image/*" onChange={handleMobileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Primary Button Text</label>
                  <input
                    type="text"
                    value={bannerPrimaryBtnText}
                    onChange={(e) => setBannerPrimaryBtnText(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Primary Button URL</label>
                  <input
                    type="text"
                    value={bannerPrimaryBtnUrl}
                    onChange={(e) => setBannerPrimaryBtnUrl(e.target.value)}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e3e2e2]">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Display Order</label>
                  <input
                    type="number"
                    value={bannerSortOrder}
                    onChange={(e) => setBannerSortOrder(Number(e.target.value))}
                    className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Primary Hero Banner</label>
                  <button
                    type="button"
                    onClick={() => setBannerIsPrimary(!bannerIsPrimary)}
                    className={`w-full py-2 px-2 text-xs font-semibold uppercase tracking-wider border transition ${bannerIsPrimary
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-[#f5f3f3] text-[#5e5e5b] border-[#e3e2e2]'
                      }`}
                  >
                    {bannerIsPrimary ? 'Primary' : 'Standard'}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1b1c1c]">Status</label>
                  <button
                    type="button"
                    onClick={() => setBannerIsActive(!bannerIsActive)}
                    className={`w-full py-2 px-2 text-xs font-semibold uppercase tracking-wider border transition ${bannerIsActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                  >
                    {bannerIsActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e3e2e2]">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsBannerDrawerOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting || isUploadingDesktop || isUploadingMobile}
                >
                  {isSubmitting
                    ? 'Saving Banner...'
                    : editingBanner
                      ? 'Update Banner'
                      : 'Create Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Why Choose Us Feature Card Drawer Form */}
      {isWhyUsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setIsWhyUsDrawerOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e3e2e2] animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#e3e2e2] bg-[#fbf9f8]">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
                  {editingCard ? 'Edit Feature Card' : 'Add Feature Card'}
                </h2>
                <p className="text-xs text-[#5e5e5b]">Why Choose Us highlight card.</p>
              </div>
              <button
                onClick={() => setIsWhyUsDrawerOpen(false)}
                className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWhyUsCard} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Icon Identifier *</label>
                <select
                  value={cardIcon}
                  onChange={(e) => setCardIcon(e.target.value)}
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
                >
                  <option value="Sparkles">Sparkles (Quality)</option>
                  <option value="ShieldCheck">ShieldCheck (Authentic)</option>
                  <option value="Truck">Truck (Fast Delivery)</option>
                  <option value="RefreshCw">RefreshCw (Return & Exchange)</option>
                  <option value="Star">Star (Premium)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Card Title *</label>
                <input
                  type="text"
                  required
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="e.g. 100% Handloom Cotton"
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Short description snippet..."
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1b1c1c]">Sort Order</label>
                <input
                  type="number"
                  value={cardSortOrder}
                  onChange={(e) => setCardSortOrder(Number(e.target.value))}
                  className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e3e2e2]">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsWhyUsDrawerOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving Card...' : 'Save Card'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Banner Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteBannerTarget !== null}
        onClose={() => setDeleteBannerTarget(null)}
        onConfirm={handleDeleteBannerConfirm}
        title="Delete Hero Banner?"
        description={
          deleteBannerTarget ? `Are you sure you want to delete banner "${deleteBannerTarget.title}"?` : ''
        }
        confirmText="Delete Banner"
        isLoading={isDeleting}
      />

      {/* Delete Feature Card Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteCardTarget !== null}
        onClose={() => setDeleteCardTarget(null)}
        onConfirm={handleDeleteWhyUsCardConfirm}
        title="Delete Feature Card?"
        description={
          deleteCardTarget ? `Are you sure you want to delete card "${deleteCardTarget.title}"?` : ''
        }
        confirmText="Delete Card"
        isLoading={isDeleting}
      />
    </>
  );
}
