import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
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
    <Section id="brand-story" variant="dark" className="py-20 lg:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image (Left) */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[450px] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Text Content (Right) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              OUR HERITAGE & CRAFT
            </span>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl leading-tight">
              {title}
            </h2>
            <p className="text-sm font-light leading-relaxed text-white/90 sm:text-base">
              {description}
            </p>
            {btnText && (
              <div className="pt-2">
                <Button href={btnUrl} variant="white" size="lg">
                  {btnText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
