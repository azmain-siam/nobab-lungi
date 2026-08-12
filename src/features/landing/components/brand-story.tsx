import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { RevealOnScroll } from '@/components/ui/motion-wrappers';
import type { HomepageConfig } from '@/types';

interface BrandStoryProps {
  story?: HomepageConfig['brand_story'];
}

export function HeritageBrandStory({ story }: BrandStoryProps) {
  if (!story || story.is_active === false) return null;

  const title = story.title || 'The Legacy of Nobab Heritage Lungi';
  const description =
    story.description ||
    'Woven by master artisans of Bangladesh using 100% organic cotton threads and century-old loom techniques. Designed for unmatched breathability, royal comfort, and timeless Bengali dignity.';
  const imageUrl =
    story.image_url ||
    'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop';
  const btnText = story.button_text || 'Explore Craftsmanship';
  const btnUrl = story.button_url || '/about';

  return (
    <section id="brand-story" className="relative w-full min-h-[500px] md:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover object-right md:object-center"
        sizes="100vw"
        priority
      />

      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c1c]/90 via-[#1b1c1c]/60 to-transparent sm:via-[#1b1c1c]/70 md:via-[#1b1c1c]/40" />

      {/* Content Container */}
      <Container className="relative z-10 w-full py-20">
        <RevealOnScroll className="max-w-xl space-y-6 md:space-y-8">
          <span className="inline-block font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            Our Heritage & Craft
          </span>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-sm">
            {title}
          </h2>

          <p className="font-sans text-base md:text-lg font-light leading-relaxed text-white/90 drop-shadow-sm">
            {description}
          </p>

          {btnText && (
            <div className="pt-4">
              <Link
                href={btnUrl}
                className="group relative inline-flex items-center justify-center overflow-hidden border border-white/80 px-10 py-4 text-white transition-all duration-500 hover:border-white hover:text-[#1b1c1c]"
              >
                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full"></span>
                <span className="relative font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-colors duration-500">{btnText}</span>
              </Link>
            </div>
          )}
        </RevealOnScroll>
      </Container>
    </section>
  );
}
