import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';
import { SectionHeader } from '@/components/shared/section-header';
import { Badge } from '@/components/ui/badge';

interface FeaturedCategoriesProps {
  categories: Category[];
}

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
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Lungi
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {lungiCats.map((cat) => (
            <CategoryCard key={cat.id} category={cat} type="lungi" />
          ))}
        </div>
      </div>

      {/* Saree row */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Saree
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sareeCats.map((cat) => (
            <CategoryCard key={cat.id} category={cat} type="saree" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  type: 'lungi' | 'saree';
}

function CategoryCard({ category, type }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-card p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:p-5"
      aria-label={`Browse ${category.name}`}
    >
      {/* Image (if uploaded) */}
      {category.image_url && (
        <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        </div>
      )}

      <Badge variant={type === 'lungi' ? 'primary' : 'secondary'} className="self-start">
        {type === 'lungi' ? 'Lungi' : 'Saree'}
      </Badge>

      <p className="mt-2 text-sm font-semibold text-gray-900 transition group-hover:text-primary">
        {category.name}
      </p>

      {category.description && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{category.description}</p>
      )}

      <span
        aria-hidden="true"
        className="mt-3 text-xs font-medium text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary"
      >
        Shop →
      </span>
    </Link>
  );
}
