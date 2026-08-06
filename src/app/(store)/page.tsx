import { WhatsAppCTA } from "@/components/shared/whatsapp-cta";
import { BestSellers } from "@/features/landing/components/best-sellers";
import { HeritageBrandStory } from "@/features/landing/components/brand-story";
import { CuratedCollections } from "@/features/landing/components/curated-collections";
import { HeroSection } from "@/features/landing/components/hero-section";
import { NababStandard } from "@/features/landing/components/nabab-standard";
import { NewArrivals } from "@/features/landing/components/new-arrivals";
import { getPublicHomepageData } from "@/services/homepage-service";

export const revalidate = 60; // Revalidate public homepage cache every 60 seconds

export default async function HomePage() {
  const data = await getPublicHomepageData();

  // Section order map driven by CMS visibility config or fallback order
  const isSectionVisible = (key: string) => {
    const sec = data.config.sections.find((s) => s.key === key);
    return sec ? sec.is_visible : true;
  };

  return (
    <>
      {/* 2. Hero Banner */}
      {isSectionVisible("hero") && <HeroSection banners={data.banners} />}

      {/* 6. Why Choose Nabab Lungi */}
      {isSectionVisible("why_choose_us") && (
        <NababStandard items={data.config.why_choose_us} />
      )}

      {/* 3. Featured Categories & 4. Premium Featured Collections */}
      {(isSectionVisible("featured_categories") ||
        isSectionVisible("featured_collections")) && (
        <CuratedCollections
          collections={data.collections}
          categories={data.categories}
        />
      )}

      {/* 5. Best Sellers */}
      {isSectionVisible("best_sellers") && (
        <BestSellers products={data.bestSellers} />
      )}

      {/* 7. New Arrivals */}
      {isSectionVisible("new_arrivals") && (
        <NewArrivals products={data.newArrivals} />
      )}

      {/* 8. Heritage Brand Story */}
      {isSectionVisible("brand_story") && (
        <HeritageBrandStory story={data.config.brand_story} />
      )}

      {/* 9. WhatsApp Floating CTA */}
      <WhatsAppCTA
        whatsappNumber={data.storeSettings.general.whatsapp_number}
      />
    </>
  );
}
