import Image from 'next/image';
import Link from 'next/link';
import type { Collection } from '@/types';
import { SectionHeader } from '@/components/shared/section-header';

interface FeaturedCollectionsProps {
  collections: Collection[];
}

const COLLECTION_GRADIENTS = [
  'from-amber-900 to-amber-700',
  'from-stone-800 to-stone-600',
  'from-emerald-900 to-emerald-700',
];

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  if (collections.length === 0) return null;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Featured Collections"
        subtitle="Curated selections for every occasion"
        viewAllHref="/collections"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection, idx) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            gradient={COLLECTION_GRADIENTS[idx % COLLECTION_GRADIENTS.length]}
          />
        ))}
      </div>
    </div>
  );
}

interface CollectionCardProps {
  collection: Collection;
  gradient: string;
}

function CollectionCard({ collection, gradient }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl"
      aria-label={`Browse ${collection.name} collection`}
    >
      {/* Background — image if available, gradient fallback */}
      {collection.banner_url ? (
        <>
          <Image
            src={collection.banner_url}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`}
        />
      )}

      {/* Content */}
      <div className="relative p-6">
        <p className="text-xl font-bold text-white">{collection.name}</p>
        {collection.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/75">{collection.description}</p>
        )}
        <span className="mt-4 inline-block text-xs font-semibold text-amber-300 transition group-hover:translate-x-1">
          Explore Collection →
        </span>
      </div>
    </Link>
  );
}
