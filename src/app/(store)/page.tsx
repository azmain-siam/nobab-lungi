import { HeroSection } from '@/features/landing/components/hero-section';
import { NababStandard } from '@/features/landing/components/nabab-standard';
import { CuratedCollections } from '@/features/landing/components/curated-collections';
import { BestSellers } from '@/features/landing/components/best-sellers';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NababStandard />
      <CuratedCollections />
      <BestSellers />
    </>
  );
}
