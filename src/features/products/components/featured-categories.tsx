import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';
import { SectionHeader } from '@/components/shared/section-header';

interface FeaturedCategoriesProps {
  categories: Category[];
}

// Curated colors per parent_type × index
const LUNGI_COLORS = [
  'bg-amber-50 border-amber-200 hover:bg-amber-100',
  'bg-orange-50 border-orange-200 hover:bg-orange-100',
  'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  'bg-lime-50 border-lime-200 hover:bg-lime-100',
  'bg-amber-50 border-amber-200 hover:bg-amber-100',
];

const SAREE_COLORS = [
  'bg-rose-50 border-rose-200 hover:bg-rose-100',
  'bg-pink-50 border-pink-200 hover:bg-pink-100',
  'bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100',
  'bg-purple-50 border-purple-200 hover:bg-purple-100',
  'bg-rose-50 border-rose-200 hover:bg-rose-100',
];

const LUNGI_BADGE = 'bg-amber-100 text-amber-800';
const SAREE_BADGE = 'bg-rose-100 text-rose-800';

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) return null;

  const lungiCats = categories.filter((c) => c.parent_type === 'lungi');
  const sareeCats = categories.filter((c) => c.parent_type === 'saree');

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Shop by Category"
        subtitle="Explore our full range of authentic Bangladeshi textiles"
      />

      {/* Lungi row */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-700">
          Lungi
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {lungiCats.map((cat, idx) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              colorClass={LUNGI_COLORS[idx % LUNGI_COLORS.length]}
              badgeClass={LUNGI_BADGE}
            />
          ))}
        </div>
      </div>

      {/* Saree row */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-rose-700">
          Saree
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sareeCats.map((cat, idx) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              colorClass={SAREE_COLORS[idx % SAREE_COLORS.length]}
              badgeClass={SAREE_BADGE}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  colorClass: string;
  badgeClass: string;
}

function CategoryCard({ category, colorClass, badgeClass }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border p-4 transition sm:p-5 ${colorClass}`}
      aria-label={`Browse ${category.name}`}
    >
      {/* Image (if uploaded) */}
      {category.image_url && (
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        </div>
      )}

      <span className={`self-start rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
        {category.parent_type === 'lungi' ? 'Lungi' : 'Saree'}
      </span>

      <p className="mt-2 text-sm font-semibold text-gray-900 transition group-hover:text-gray-700">
        {category.name}
      </p>

      {category.description && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{category.description}</p>
      )}

      <span
        aria-hidden="true"
        className="mt-3 text-xs font-medium text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-gray-700"
      >
        Shop →
      </span>
    </Link>
  );
}
