import Image from 'next/image';
import Link from 'next/link';

export function HeritageStory() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card p-8 sm:p-12 lg:p-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Story Content */}
        <div className="space-y-6">
          <span className="label-caps tracking-[0.2em] text-secondary">
            Our Legacy &amp; Craft
          </span>

          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Woven with Tradition, Tailored for Comfort.
          </h2>

          <p className="text-base font-light leading-relaxed text-foreground/80 sm:text-lg">
            Every Nobab lungi is crafted in traditional handloom centers across Sirajganj, Pabna, and Tangail. Using 100% long-staple combed cotton and vegetable dyes, our master weavers blend centuries-old heritage with refined modern silhouettes.
          </p>

          <div className="grid grid-cols-2 gap-6 border-t border-border pt-6 text-foreground">
            <div>
              <p className="font-serif text-3xl font-bold text-secondary">60s &amp; 80s</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                Count Fine Yarn
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-secondary">100%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                Handloom Authentic
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-block rounded-md bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-primary-hover shadow-sm"
            >
              Discover Our Story
            </Link>
          </div>
        </div>

        {/* Story Visual Imagery */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[16/10] lg:aspect-[4/3]">
          <Image
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop"
            alt="Handloom shuttle and traditional cotton weave texture"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
