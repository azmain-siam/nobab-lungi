import { Header } from '@/components/layout/header';
import { HeroSection } from '@/features/landing/components/hero-section';
import { NababStandard } from '@/features/landing/components/nabab-standard';
import { CuratedCollections } from '@/features/landing/components/curated-collections';
import { BestSellers } from '@/features/landing/components/best-sellers';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#fbf9f8]">
      <Header variant="transparent" />
      <main>
        <HeroSection />
        <NababStandard />
        <CuratedCollections />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
