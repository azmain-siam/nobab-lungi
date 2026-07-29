'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CollectionRecord {
  id: string;
  tag: string;
  title: string;
  itemCount: number;
  bannerImage: string;
  isFeatured: boolean;
}

const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: '1',
    tag: 'THE CLASSICS',
    title: 'Heritage Collection',
    itemCount: 8,
    bannerImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    id: '2',
    tag: 'MODERN SOPHISTICATION',
    title: 'Executive Series',
    itemCount: 6,
    bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    id: '3',
    tag: 'EVERYDAY LUXURY',
    title: 'Luxury Cotton',
    itemCount: 12,
    bannerImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    id: '4',
    tag: 'ROYAL HERITAGE',
    title: 'Artisanal Saree Series',
    itemCount: 5,
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    isFeatured: true,
  },
];

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);

  const toggleFeatured = (id: string) => {
    setCollections(
      collections.map((c) =>
        c.id === id ? { ...c, isFeatured: !c.isFeatured } : c
      )
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Collection &amp; Banner Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Manage curated product series and homepage editorial hero banners.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2"
          onClick={() => alert('Add Collection Modal')}
        >
          <Plus className="h-4 w-4" />
          Create Collection
        </Button>
      </div>

      {/* Collections Table */}
      <div className="bg-white border border-[#e3e2e2] overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
              <th className="p-3 font-semibold">Collection</th>
              <th className="p-3 font-semibold">Tagline</th>
              <th className="p-3 font-semibold">Assigned Products</th>
              <th className="p-3 font-semibold">Bento Featured</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e2e2]">
            {collections.map((item) => (
              <tr key={item.id} className="hover:bg-[#fbf9f8]">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden bg-[#efeded]">
                      <Image
                        src={item.bannerImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="font-display font-semibold text-[#1b1c1c]">
                      {item.title}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-[11px] font-mono text-[#5e5e5b]">
                  {item.tag}
                </td>
                <td className="p-3 font-medium text-[#1b1c1c]">
                  {item.itemCount} Items
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleFeatured(item.id)}
                    className={`text-xs font-semibold px-2 py-0.5 border cursor-pointer ${
                      item.isFeatured
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-[#efeded] text-[#5e5e5b] border-[#e3e2e2]'
                    }`}
                  >
                    {item.isFeatured ? '✓ Featured' : 'Hidden'}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => alert(`Edit ${item.title}`)}
                      className="p-1 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                    >
                      <Edit className="h-4 w-4 stroke-[1.5]" />
                    </button>
                    <button
                      onClick={() =>
                        setCollections(collections.filter((c) => c.id !== item.id))
                      }
                      className="p-1 text-[#5e5e5b] hover:text-red-600 transition"
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
    </>
  );
}
