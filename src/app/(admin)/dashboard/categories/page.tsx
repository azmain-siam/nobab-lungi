'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useToast } from '@/providers/toast-provider';
import { Plus, Search, Filter, Trash2, Edit, Grid } from 'lucide-react';

interface MockCategory {
  id: number;
  name: string;
  slug: string;
  parentType: 'lungi' | 'saree';
  sortOrder: number;
}

const MOCK_CATEGORIES: MockCategory[] = [
  { id: 1, name: 'Premium Cotton Lungi', slug: 'lungi-premium-cotton', parentType: 'lungi', sortOrder: 1 },
  { id: 2, name: 'Export Quality Lungi', slug: 'lungi-export-quality', parentType: 'lungi', sortOrder: 2 },
  { id: 3, name: 'Check Lungi', slug: 'lungi-check', parentType: 'lungi', sortOrder: 3 },
  { id: 4, name: 'Printed Lungi', slug: 'lungi-printed', parentType: 'lungi', sortOrder: 4 },
  { id: 5, name: 'Handloom Lungi', slug: 'lungi-handloom', parentType: 'lungi', sortOrder: 5 },
  { id: 6, name: 'Cotton Saree', slug: 'saree-cotton', parentType: 'saree', sortOrder: 1 },
  { id: 7, name: 'Jamdani Saree', slug: 'saree-jamdani', parentType: 'saree', sortOrder: 2 },
  { id: 8, name: 'Silk Saree', slug: 'saree-silk', parentType: 'saree', sortOrder: 3 },
  { id: 9, name: 'Printed Saree', slug: 'saree-printed', parentType: 'saree', sortOrder: 4 },
  { id: 10, name: 'Handloom Saree', slug: 'saree-handloom', parentType: 'saree', sortOrder: 5 },
];

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [parentTypeFilter, setParentTypeFilter] = useState('all');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const filteredCategories = MOCK_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesParent = parentTypeFilter === 'all' || cat.parentType === parentTypeFilter;

    return matchesSearch && matchesParent;
  });

  const handleDeleteConfirm = () => {
    toast.success(`Category #${deleteTargetId} deleted.`);
    setDeleteTargetId(null);
  };

  return (
    <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3e2e2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
            Category Management
          </h1>
          <p className="text-xs text-[#5e5e5b] mt-1">
            Organize products into lungi and saree taxonomy groups.
          </p>
        </div>

        <Button type="button" variant="primary" size="md" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#e3e2e2] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5e5e5b] stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full bg-[#fbf9f8] border border-[#e3e2e2] py-2 pl-9 pr-4 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5e5e5b]">
            <Filter className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Type:</span>
          </div>

          <select
            value={parentTypeFilter}
            onChange={(e) => setParentTypeFilter(e.target.value)}
            className="bg-[#fbf9f8] border border-[#e3e2e2] py-2 px-3 text-xs text-[#1b1c1c] rounded-none focus:border-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="lungi">Lungi Categories</option>
            <option value="saree">Saree Categories</option>
          </select>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white border border-[#e3e2e2]">
        {filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#fbf9f8] text-[#5e5e5b] uppercase tracking-wider">
                  <th className="p-4 font-semibold w-16">ID</th>
                  <th className="p-4 font-semibold">Category Name</th>
                  <th className="p-4 font-semibold">URL Slug</th>
                  <th className="p-4 font-semibold">Parent Type</th>
                  <th className="p-4 font-semibold">Sort Order</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#fbf9f8] transition">
                    <td className="p-4 font-display font-semibold text-[#1b1c1c]">#{cat.id}</td>
                    <td className="p-4 font-semibold text-[#1b1c1c]">{cat.name}</td>
                    <td className="p-4 font-mono text-[11px] text-[#5e5e5b]">{cat.slug}</td>
                    <td className="p-4">
                      {cat.parentType === 'lungi' ? (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200 uppercase">
                          Lungi
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-200 uppercase">
                          Saree
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#5e5e5b] font-medium">{cat.sortOrder}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-[#5e5e5b] hover:text-[#1b1c1c] transition"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4 stroke-[1.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(cat.id)}
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
          <div className="p-12 text-center space-y-3">
            <div className="p-3 bg-[#f5f3f3] border border-[#e3e2e2] w-fit mx-auto text-[#5e5e5b]">
              <Grid className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-base font-semibold text-[#1b1c1c]">No Categories Found</h3>
            <p className="text-xs text-[#5e5e5b] max-w-sm mx-auto">
              No categories match your search term.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        description="Are you sure you want to remove this category? Products linked to it will need re-categorization."
        confirmText="Delete Category"
      />
    </>
  );
}
