'use client';

import React from 'react';
import Image from 'next/image';
import { X, Upload, Trash2, Loader2, ImageIcon, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Category, Collection } from '@/types';
import type { AdminProductListItem } from '@/services/product-service';

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: AdminProductListItem | null;
  categories: Category[];
  collections: Collection[];
  // Form State & Handlers
  name: string;
  setName: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  autoSlug: boolean;
  setAutoSlug: (val: boolean) => void;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  discountPrice: string;
  setDiscountPrice: (val: string) => void;
  sku: string;
  setSku: (val: string) => void;
  autoSku: boolean;
  setAutoSku: (val: boolean) => void;
  stock: string;
  setStock: (val: string) => void;
  categoryId: number;
  setCategoryId: (val: number) => void;
  selectedCollectionIds: number[];
  setSelectedCollectionIds: (val: number[] | ((prev: number[]) => number[])) => void;
  fabric: string;
  setFabric: (val: string) => void;
  pattern: string;
  setPattern: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  weight: string;
  setWeight: (val: string) => void;
  countryOfOrigin: string;
  setCountryOfOrigin: (val: string) => void;
  productImages: { url: string; alt_text?: string; sort_order: number; is_cover: boolean }[];
  setProductImages: React.Dispatch<
    React.SetStateAction<
      { url: string; alt_text?: string; sort_order: number; is_cover: boolean }[]
    >
  >;
  status: 'published' | 'draft';
  setStatus: (val: 'published' | 'draft') => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  isBestSeller: boolean;
  setIsBestSeller: (val: boolean) => void;
  isNewArrival: boolean;
  setIsNewArrival: (val: boolean) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  // Bengali Translations
  nameBn: string;
  setNameBn: (val: string) => void;
  shortDescriptionBn: string;
  setShortDescriptionBn: (val: string) => void;
  descriptionBn: string;
  setDescriptionBn: (val: string) => void;
  fabricBn: string;
  setFabricBn: (val: string) => void;
  patternBn: string;
  setPatternBn: (val: string) => void;
  colorBn: string;
  setColorBn: (val: string) => void;
  countryOfOriginBn: string;
  setCountryOfOriginBn: (val: string) => void;
  seoTitleBn: string;
  setSeoTitleBn: (val: string) => void;
  seoDescriptionBn: string;
  setSeoDescriptionBn: (val: string) => void;
  isUploadingImage: boolean;
  isSubmitting: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProductFormDrawer({
  isOpen,
  onClose,
  editingProduct,
  categories,
  collections,
  name,
  setName,
  slug,
  setSlug,
  autoSlug,
  setAutoSlug,
  shortDescription,
  setShortDescription,
  description,
  setDescription,
  price,
  setPrice,
  discountPrice,
  setDiscountPrice,
  sku,
  setSku,
  autoSku,
  setAutoSku,
  stock,
  setStock,
  categoryId,
  setCategoryId,
  selectedCollectionIds,
  setSelectedCollectionIds,
  fabric,
  setFabric,
  pattern,
  setPattern,
  color,
  setColor,
  weight,
  setWeight,
  countryOfOrigin,
  setCountryOfOrigin,
  productImages,
  setProductImages,
  status,
  setStatus,
  isActive,
  setIsActive,
  isFeatured,
  setIsFeatured,
  isBestSeller,
  setIsBestSeller,
  isNewArrival,
  setIsNewArrival,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  nameBn,
  setNameBn,
  shortDescriptionBn,
  setShortDescriptionBn,
  descriptionBn,
  setDescriptionBn,
  fabricBn,
  setFabricBn,
  patternBn,
  setPatternBn,
  colorBn,
  setColorBn,
  countryOfOriginBn,
  setCountryOfOriginBn,
  seoTitleBn,
  setSeoTitleBn,
  seoDescriptionBn,
  setSeoDescriptionBn,
  isUploadingImage,
  isSubmitting,
  onImageUpload,
  onSubmit,
}: ProductFormDrawerProps) {
  if (!isOpen) return null;

  const handleCollectionToggle = (colId: number) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.is_cover)) {
        next[0].is_cover = true;
      }
      return next;
    });
  };

  const handleSetCover = (index: number) => {
    setProductImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_cover: i === index,
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Content Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#e3e2e2] flex items-center justify-between bg-[#fbf9f8]">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#1b1c1c]">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
            </h2>
            <p className="text-xs text-[#5e5e5b]">
              {editingProduct ? 'Update product details and inventory.' : 'Publish a new handloom lungi to the storefront.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] hover:bg-[#e3e2e2]/50 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              1. Basic Information
            </h3>

            <Input
              label="Product Name"
              required
              placeholder="e.g. Royal Handloom Cotton Lungi"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (autoSlug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Input
                  label="URL Slug"
                  required
                  placeholder="e.g. royal-handloom-cotton-lungi"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setAutoSlug(false);
                  }}
                  containerClassName="flex-1"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-[#5e5e5b] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoSlug}
                  onChange={(e) => setAutoSlug(e.target.checked)}
                  className="rounded-none text-[#1b1c1c]"
                />
                Auto-generate slug from product name
              </label>
            </div>

            <Textarea
              label="Short Summary"
              placeholder="Brief overview displayed on product cards..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={2}
            />

            <Textarea
              label="Detailed Description"
              placeholder="Comprehensive product details, weave specifications, care instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* SECTION 2: PRICING & INVENTORY */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              2. Pricing & Stock Control
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (BDT ৳)"
                required
                type="number"
                placeholder="1200"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Input
                label="Discount / Sale Price (BDT ৳)"
                type="number"
                placeholder="950 (Optional)"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Stock Keeping Unit (SKU)"
                  required
                  placeholder="NL-LUN-1001"
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    setAutoSku(false);
                  }}
                />
                <label className="flex items-center gap-2 text-xs text-[#5e5e5b] cursor-pointer pt-1.5">
                  <input
                    type="checkbox"
                    checked={autoSku}
                    onChange={(e) => setAutoSku(e.target.checked)}
                    className="rounded-none text-[#1b1c1c]"
                  />
                  Auto-generate SKU
                </label>
              </div>

              <Input
                label="Inventory Units"
                required
                type="number"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 3: CATEGORY & COLLECTIONS */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              3. Category & Collections
            </h3>

            <Select
              label="Primary Category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              <option value={0}>Select Primary Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            {collections.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
                  Featured Collections (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 border border-[#e3e2e2] bg-[#fbf9f8]">
                  {collections.map((col) => (
                    <label key={col.id} className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCollectionIds.includes(col.id)}
                        onChange={() => handleCollectionToggle(col.id)}
                        className="rounded-none text-[#1b1c1c]"
                      />
                      <span className="truncate">{col.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: PRODUCT SPECIFICATIONS */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              4. Specifications & Origin
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fabric"
                placeholder="100% Organic Cotton"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
              />
              <Input
                label="Pattern"
                placeholder="Traditional Check"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Color"
                placeholder="Navy Blue"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <Input
                label="Weight"
                placeholder="450g"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Input
                label="Origin"
                placeholder="Bangladesh"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION 5: CLOUDINARY MEDIA */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              5. Product Images (Cloudinary CDN)
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
                Upload High-Resolution Product Images
              </label>

              <label className="border-2 border-dashed border-[#e3e2e2] hover:border-[#1b1c1c] p-6 text-center block cursor-pointer bg-[#fbf9f8] transition group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <div className="space-y-2">
                  {isUploadingImage ? (
                    <Loader2 className="h-6 w-6 text-[#1b1c1c] animate-spin mx-auto" />
                  ) : (
                    <Upload className="h-6 w-6 text-[#5e5e5b] group-hover:text-[#1b1c1c] mx-auto stroke-[1.5] transition" />
                  )}
                  <div className="text-xs font-semibold text-[#1b1c1c]">
                    {isUploadingImage ? 'Uploading image to Cloudinary...' : 'Click or drop files to upload'}
                  </div>
                  <p className="text-[10px] text-[#5e5e5b]">PNG, JPG, WEBP formats up to 5MB.</p>
                </div>
              </label>

              {/* Uploaded Images List */}
              {productImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {productImages.map((img, idx) => (
                    <div key={idx} className="relative border border-[#e3e2e2] bg-[#fbf9f8] p-2 space-y-2 group">
                      <div className="relative h-24 w-full">
                        <Image
                          src={img.url}
                          alt={img.alt_text || 'Product image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className={`font-semibold uppercase ${
                            img.is_cover
                              ? 'text-emerald-700 font-bold'
                              : 'text-[#5e5e5b] hover:text-[#1b1c1c]'
                          }`}
                        >
                          {img.is_cover ? '★ Main Cover' : 'Set Cover'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-rose-700 hover:text-rose-900"
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

          {/* SECTION 6: PROMOTIONAL FLAGS & STATUS */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              6. Status & Promotional Badges
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Publishing Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              >
                <option value="published">Published (Visible on Store)</option>
                <option value="draft">Draft (Hidden)</option>
              </Select>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1b1c1c]">
                  Catalog Visibility
                </label>
                <label className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded-none text-[#1b1c1c]"
                  />
                  Active Product Listing
                </label>
              </div>
            </div>

            <div className="p-3 border border-[#e3e2e2] bg-[#fbf9f8] space-y-2">
              <div className="text-xs font-semibold text-[#1b1c1c] uppercase">Homepage Showcase Badges</div>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded-none"
                  />
                  Featured Item
                </label>
                <label className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded-none"
                  />
                  Best Seller
                </label>
                <label className="flex items-center gap-2 text-xs text-[#1b1c1c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded-none"
                  />
                  New Arrival
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 7: SEO META INFORMATION */}
          <div className="space-y-4 border-b border-[#e3e2e2] pb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5e5b]">
              7. Search Engine Optimization (SEO)
            </h3>

            <Input
              label="SEO Title Tag"
              placeholder="e.g. Royal Handloom Lungi | Authentic Bangladeshi Weave"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <Textarea
              label="SEO Meta Description"
              placeholder="Custom description for Google search results..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* SECTION 8: BENGALI TRANSLATIONS (বাংলা সংস্করণ) */}
          <div className="space-y-4 pb-4 bg-[#fbf9f8] p-4 border border-[#e3e2e2]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b1c1c] flex items-center gap-2">
                <span className="bg-[#1b1c1c] text-white px-1.5 py-0.5 text-[10px]">বাংলা</span>
                8. Bengali Translations (Optional Overrides)
              </h3>
            </div>

            <Input
              label="Product Name (বাংলা নাম)"
              placeholder="যেমন: রয়্যাল হ্যান্ডলুম কটন লুঙ্গি"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
            />

            <Textarea
              label="Short Summary (সংক্ষিপ্ত বিবরণ)"
              placeholder="প্রোডাক্ট কার্ডে দেখানোর জন্য সংক্ষেপে লিখুন..."
              value={shortDescriptionBn}
              onChange={(e) => setShortDescriptionBn(e.target.value)}
              rows={2}
            />

            <Textarea
              label="Detailed Description (বিস্তারিত বিবরণ)"
              placeholder="বুনন পদ্ধতি, বিবরণ ও যত্ন সম্পর্কিত তথ্য..."
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fabric (ফেব্রিক)"
                placeholder="১০০% অর্গানিক কটন"
                value={fabricBn}
                onChange={(e) => setFabricBn(e.target.value)}
              />
              <Input
                label="Pattern (প্যাটার্ন)"
                placeholder="ঐতিহ্যবাহী চেক"
                value={patternBn}
                onChange={(e) => setPatternBn(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Color (রং)"
                placeholder="নেভি ব্লু"
                value={colorBn}
                onChange={(e) => setColorBn(e.target.value)}
              />
              <Input
                label="Country of Origin (উৎপাদনকারী দেশ)"
                placeholder="বাংলাদেশ"
                value={countryOfOriginBn}
                onChange={(e) => setCountryOfOriginBn(e.target.value)}
              />
            </div>

            <Input
              label="SEO Title (বাংলা মেটা শিরোনাম)"
              placeholder="যেমন: রয়্যাল হ্যান্ডলুম লুঙ্গি | নোবাব ঐতিহ্য"
              value={seoTitleBn}
              onChange={(e) => setSeoTitleBn(e.target.value)}
            />

            <Textarea
              label="SEO Meta Description (বাংলা মেটা বিবরণ)"
              placeholder="গুগল সার্চ ফলাফলের জন্য বিস্তারিত বাংলা বিবরণ..."
              value={seoDescriptionBn}
              onChange={(e) => setSeoDescriptionBn(e.target.value)}
              rows={2}
            />
          </div>

          {/* Drawer Actions Footer */}
          <div className="pt-4 border-t border-[#e3e2e2] flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting || isUploadingImage}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : editingProduct ? (
                'Save Changes'
              ) : (
                'Publish Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
