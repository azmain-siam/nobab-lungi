'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { Plus, Search, Trash2, Edit, Layers, Image as ImageIcon } from 'lucide-react';

interface MockCollection {
  id: number;
  name: string;
  slug: string;
  isFeatured: boolean;
  bannerUrl: string;
  sortOrder: number;
}

interface MockBanner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const MOCK_COLLECTIONS: MockCollection[] = [
  {
    id: 1,
    name: 'Eid Special 2026',
    slug: 'eid-special',
    isFeatured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
    sortOrder: 1,
  },
  {
    id: 2,
    name: 'Summer Breeze Linen',
    slug: 'summer-collection',
    isFeatured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=60',
    sortOrder: 2,
  },
  {
    id: 3,
    name: 'Artisan Heritage Drops',
    slug: 'new-arrivals',
    isFeatured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60',
    sortOrder: 3,
  },
];

const MOCK_BANNERS: MockBanner[] = [
  {
    id: 1,
    title: 'Wear Tradition with Pride',
    subtitle: 'Handcrafted luxury lungis & Jamdani sarees',
    imageUrl: '/images/banner/banner.jpeg',
    isActive: true,
    sortOrder: 1,
  },
];

export default function AdminCollectionsPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredCollections = MOCK_COLLECTIONS.filter(
    (col) =>
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    toast.success(`Item ${deleteTargetId} removed.`);
    setDeleteTargetId(null);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Collections & Banner Drops
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Curate hero store showcases and homepage banner promotional slides.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button type="button" variant="primary" size="md" className="gap-2">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e3e2e2] p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Featured Collections Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#1b1c1c] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#1b1c1c] stroke-[1.5]" />
            Curated Collections
          </h2>
        </div>

        <div className="bg-white border border-[#e3e2e2]">
          {filteredCollections.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                    <th className="p-4 font-semibold w-16">Banner</th>
                    <th className="p-4 font-semibold">Collection Name</th>
                    <th className="p-4 font-semibold">Slug</th>
                    <th className="p-4 font-semibold">Featured</th>
                    <th className="p-4 font-semibold">Sort Order</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e2e2]">
                  {filteredCollections.map((col) => (
                    <tr key={col.id} className="hover:bg-[#fbf9f8] transition">
                      <td className="p-4">
                        <div className="relative h-10 w-14 bg-[#f5f3f3] border border-[#e3e2e2] overflow-hidden shrink-0">
                          <Image
                            src={col.bannerUrl}
                            alt={col.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-[#1b1c1c]">{col.name}</td>
                      <td className="p-4 font-mono text-[11px] text-[#5e5e5b]">{col.slug}</td>
                      <td className="p-4">
                        {col.isFeatured ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#5e5e5b]">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-[#5e5e5b] font-medium">{col.sortOrder}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                            title="Edit Collection"
                          >
                            <Edit className="h-4 w-4 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(`collection-${col.id}`)}
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
            <div className="p-12 text-center text-xs text-[#5e5e5b]">No collections found.</div>
          )}
        </div>
      </div>

      {/* Homepage Banners Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#1b1c1c] flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-[#1b1c1c] stroke-[1.5]" />
            Homepage Banners
          </h2>
          <Button type="button" variant="secondary" size="sm" className="gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Slide
          </Button>
        </div>

        <div className="bg-white border border-[#e3e2e2]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Subtitle</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Order</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {MOCK_BANNERS.map((banner) => (
                  <tr key={banner.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4 font-semibold text-[#1b1c1c]">{banner.title}</td>
                    <td className="p-4 text-[#5e5e5b]">{banner.subtitle}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-[#5e5e5b] font-medium">{banner.sortOrder}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(`banner-${banner.id}`)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition"
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
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item?"
        description="Are you sure you want to remove this item? It will be unlinked from the storefront homepage."
        confirmText="Remove Item"
      />
    </>
  );
}
