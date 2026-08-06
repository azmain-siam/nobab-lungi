import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getHomepageConfig } from '@/services/homepage-service';
import {
  ArrowRight,
  ShieldCheck,
  Feather,
  Sparkles,
  Heart,
  Layers,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Craftsmanship — Nabab Lungi',
  description:
    'Woven with Heritage. Made for Today. Discover the craftsmanship, authenticity, and passion behind Nabab Lungi, Bangladesh’s premium handloom brand.',
};

const CRAFTSMANSHIP_STAGES = [
  {
    step: '01',
    title: 'Fine Combed Cotton',
    description:
      'We select high thread-count organic cotton yarn engineered specifically for tropical breathability and long-lasting strength.',
  },
  {
    step: '02',
    title: 'Yarn & Color Dyeing',
    description:
      'Yarns are hand-dyed using color-fast dyes that resist fading, maintaining their rich depth through countless washes.',
  },
  {
    step: '03',
    title: 'Traditional Loom Weaving',
    description:
      'Woven on traditional handlooms in Pabna & Tangail by artisan families who have passed down loom mastery for generations.',
  },
  {
    step: '04',
    title: 'Washing & Softening',
    description:
      'A gentle bio-washing process removes harsh loom stiffness, giving every piece an instant, day-one cloud softness.',
  },
  {
    step: '05',
    title: 'Quality Inspection',
    description:
      'Every lungi is individually inspected by hand for thread density, hem finishing, and flawless border alignment.',
  },
];

const BRAND_PILLARS = [
  {
    icon: Award,
    title: 'Authentic Bangladeshi Heritage',
    description: 'Deeply rooted in centuries of Bengal loom culture and weaving pride.',
  },
  {
    icon: Feather,
    title: 'Carefully Selected Materials',
    description: 'High thread-count, lightweight combed cotton yarn selected for softness.',
  },
  {
    icon: Sparkles,
    title: 'Cloud-Like Everyday Comfort',
    description: 'Engineered for tropical warmth, effortless drape, and freedom of movement.',
  },
  {
    icon: Layers,
    title: 'Refined Traditional Motifs',
    description: 'Muted tones, classic Bengali checks, and elegant dark weaves for modern life.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality You Can Feel',
    description: 'Pre-shrunk, soft-wash finish that grows smoother with every wash.',
  },
];

const BRAND_VALUES = [
  {
    title: 'QUALITY',
    description: 'We care about the subtle details that make a garment worth keeping for years.',
  },
  {
    title: 'AUTHENTICITY',
    description: 'We celebrate the genuine character and heritage of Bangladeshi lungi culture.',
  },
  {
    title: 'COMFORT',
    description: 'Traditional clothing should feel natural, effortless, and easy to live in.',
  },
  {
    title: 'TRUST',
    description: 'Every interaction with Nabab Lungi is built on honest pricing, fast delivery, and dependability.',
  },
];

export default async function AboutPage() {
  const config = await getHomepageConfig();

  const brandStory = config.brand_story || {
    title: 'The Legacy of Nobab Heritage Lungi',
    description:
      'Woven by master artisans of Bangladesh using 100% organic cotton threads and century-old loom techniques.',
  };

  return (
    <>
      {/* 1. HERO — BRAND STATEMENT */}
      <section
        aria-label="Hero"
        className="relative min-h-[60vh] sm:min-h-[70vh] w-full overflow-hidden bg-stone-900 flex items-end pb-16 sm:pb-20 pt-32"
      >
        <Image
          src="https://images.unsplash.com/photo-1549116259-a400a614c455?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Bangladeshi handloom weaving hero background"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/40 to-black/30" />

        <div className="relative z-10 w-full">
          <Container>
            <div className="max-w-3xl text-white space-y-4">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-300 bg-white/10 px-3 py-1 border border-white/20">
                HERITAGE & CRAFTSMANSHIP
              </span>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
                Woven with Heritage. <br className="hidden sm:inline" />
                Made for Today.
              </h1>

              <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed max-w-xl">
                Nabab Lungi brings together centuries of traditional Bangladeshi lungi weaving with
                refined modern quality, cloud-like cotton softness, and effortless everyday comfort.
              </p>

              <div className="pt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition shadow-lg"
                >
                  <span>Explore Our Collection</span>
                  <ArrowRight className="h-4 w-4 stroke-[2]" />
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <Section variant="default" className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
                  OUR ORIGIN & PHILOSOPHY
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1b1c1c] tracking-tight">
                  {brandStory.title || 'The Legacy of Nobab Heritage Lungi'}
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-light leading-relaxed text-[#5e5e5b]">
                <p>
                  For generations, the Bengali lungi has been far more than everyday loungewear — it is a timeless garment of unmatched comfort, breathability, and cultural identity across Bangladesh.
                </p>
                <p>
                  {brandStory.description ||
                    'Nabab Lungi was created to elevate this iconic tradition. We work directly with master loom artisans in Pabna and Tangail, combining fine organic cotton threads with refined check motifs, soft bio-washes, and a premium shopping experience.'}
                </p>
                <p>
                  We believe that traditional menswear should never feel outdated or compromised. Every Nabab Lungi is crafted to give you authentic loom pride with day-one softness that lasts.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-8 border-t border-[#e3e2e2]">
                <div>
                  <span className="font-display text-2xl font-bold text-[#1b1c1c]">100%</span>
                  <span className="block text-[11px] text-[#5e5e5b] font-light">Fine Organic Cotton</span>
                </div>
                <div className="h-8 w-px bg-[#e3e2e2]" />
                <div>
                  <span className="font-display text-2xl font-bold text-[#1b1c1c]">Pabna & Tangail</span>
                  <span className="block text-[11px] text-[#5e5e5b] font-light">Authentic Loom Hubs</span>
                </div>
              </div>
            </div>

            {/* Editorial Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-900 border border-[#e3e2e2] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                  alt="Crafting Nabab Lungi textiles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white p-4 bg-black/60 backdrop-blur-xs border border-white/10">
                  <p className="text-xs font-medium italic">
                    &ldquo;Preserving the soul of Bengali weaving while crafting pieces for modern comfort.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. THE ART OF LUNGI MAKING */}
      <Section variant="muted" className="py-16 lg:py-24 bg-[#f5f3f3]/60 border-y border-[#e3e2e2]">
        <Container>
          <div className="max-w-2xl text-left space-y-2 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
              CRAFTSMANSHIP JOURNEY
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1b1c1c] tracking-tight">
              The Art of Lungi Making
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#5e5e5b]">
              From raw combed yarn to your doorstep — every stage of our handloom process represents care and tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CRAFTSMANSHIP_STAGES.map((stage) => (
              <div
                key={stage.step}
                className="bg-white border border-[#e3e2e2] p-6 space-y-3 flex flex-col justify-between hover:shadow-sm transition"
              >
                <div className="space-y-3">
                  <span className="font-display text-2xl font-bold text-amber-800">
                    {stage.step}
                  </span>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-light text-[#5e5e5b] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. CRAFTSMANSHIP / PEOPLE BEHIND THE PRODUCT */}
      <Section variant="default" className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Left */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-stone-900 border border-[#e3e2e2] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
                  alt="Artisan loom craftsmanship in Bangladesh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content Right */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
                THE HUMAN TOUCH
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1b1c1c] tracking-tight">
                Master Artisans of Bengal
              </h2>
              <p className="text-xs sm:text-sm font-light text-[#5e5e5b] leading-relaxed">
                Behind every Nabab Lungi is the quiet dedication of artisan weavers who carry generations of loom knowledge in their hands. Working on traditional handlooms, they balance warp and weft tension with skill that machines cannot replicate.
              </p>

              <div className="p-5 bg-[#fbf9f8] border-l-2 border-[#1b1c1c] space-y-2">
                <p className="text-xs font-medium text-[#1b1c1c] italic">
                  &ldquo;A authentic handloom lungi carries weight, breathability, and character. It is an art form worn every day.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. WHY NABAB LUNGI */}
      <Section variant="muted" className="py-16 lg:py-24 bg-[#f5f3f3]/40 border-t border-[#e3e2e2]">
        <Container>
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
              OUR COMMITMENT
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1b1c1c] tracking-tight">
              Why Choose Nabab Lungi
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#5e5e5b]">
              Five reasons our customers trust us for their everyday comfort and gift needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRAND_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white border border-[#e3e2e2] p-6 space-y-3 hover:border-[#1b1c1c]/40 transition"
                >
                  <div className="p-2.5 bg-[#fbf9f8] border border-[#e3e2e2] w-fit text-[#1b1c1c]">
                    <Icon className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#1b1c1c]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-light text-[#5e5e5b] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 6. OUR VALUES */}
      <Section variant="default" className="py-16 lg:py-24 border-t border-[#e3e2e2]">
        <Container>
          <div className="text-left max-w-md space-y-2 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5e5e5b]">
              THE STANDARDS WE HOLD
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1b1c1c] tracking-tight">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BRAND_VALUES.map((val) => (
              <div key={val.title} className="space-y-2 border-t border-[#1b1c1c] pt-4">
                <span className="block text-xs font-bold uppercase tracking-[0.15em] text-[#1b1c1c]">
                  {val.title}
                </span>
                <p className="text-xs font-light text-[#5e5e5b] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 7. TRADITION MEETS TODAY */}
      <section aria-label="Tradition Meets Today" className="relative py-20 bg-stone-900 text-white overflow-hidden">
        <Container>
          <div className="max-w-3xl space-y-4">
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-300">
              HERITAGE FOR MODERN LIVING
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              Tradition Doesn&apos;t Mean Outdated.
            </h2>
            <p className="text-xs sm:text-sm font-light text-white/85 leading-relaxed max-w-xl">
              Nabab Lungi respects the legacy of traditional Bengali handlooms while presenting it through a clean, transparent, and refined modern e-commerce experience.
            </p>
          </div>
        </Container>
      </section>

      {/* 8. BRAND STATEMENT / CLOSING */}
      <Section variant="default" className="py-16 lg:py-24 text-center">
        <Container>
          <div className="max-w-2xl mx-auto space-y-4">
            <Heart className="h-6 w-6 text-rose-600 mx-auto stroke-[1.5]" />
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1b1c1c] tracking-tight">
              More than a lungi. A tradition woven into everyday life.
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#5e5e5b] leading-relaxed">
              Whether you are relaxing at home after a long day or gifting someone a piece of authentic Bangladeshi heritage, Nabab Lungi is made to accompany your everyday moments with pride.
            </p>
          </div>
        </Container>
      </Section>

      {/* 9. FINAL CTA */}
      <section aria-label="Call to Action" className="py-16 bg-[#fbf9f8] border-t border-[#e3e2e2] text-center">
        <Container>
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1b1c1c] tracking-tight">
              Find Your Everyday Comfort.
            </h2>
            <p className="text-xs text-[#5e5e5b] leading-relaxed">
              Explore our curated series of handcrafted lungis delivered directly across Bangladesh.
            </p>
            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1b1c1c] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition shadow-xs"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
