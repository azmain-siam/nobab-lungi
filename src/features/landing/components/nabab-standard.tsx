import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrappers";
import type { HomepageConfig } from "@/types";
import {
  Award,
  Heart,
  Layers,
  PackageCheck,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

type WhyChooseUsItem = HomepageConfig["why_choose_us"][number];

const ICON_MAP: Record<string, typeof Sparkles> = {
  Sparkles,
  Layers,
  Scissors,
  Truck,
  ShieldCheck,
  RefreshCw,
  Award,
  Heart,
  PackageCheck,
  Zap,
};

const DEFAULT_STANDARDS = [
  {
    id: "1",
    icon: "Sparkles",
    title: "100% Organic Cotton",
    description:
      "Sourced from the finest mills to ensure breathability and unsurpassed softness.",
    sort_order: 1,
  },
  {
    id: "2",
    icon: "Layers",
    title: "Authentic Heritage",
    description:
      "Woven by master artisans preserving generations of traditional loom artistry.",
    sort_order: 2,
  },
  {
    id: "3",
    icon: "Scissors",
    title: "Modern Comfort",
    description:
      "Designed for everyday elegance, offering freedom of movement and style.",
    sort_order: 3,
  },
  {
    id: "4",
    icon: "Truck",
    title: "Nationwide Delivery",
    description:
      "Bringing authentic luxury directly to your doorstep, anywhere in Bangladesh.",
    sort_order: 4,
  },
];

interface NababStandardProps {
  items?: WhyChooseUsItem[];
}

export function NababStandard({ items = [] }: NababStandardProps) {
  const cards = items.length > 0 ? items : DEFAULT_STANDARDS;

  return (
    <Section variant="default" className="py-10 sm:py-16 lg:py-24">
      <Container>
        <RevealOnScroll>
          <SectionHeading title="The Nabab Standard" align="center" className="mb-6 sm:mb-12" />
        </RevealOnScroll>

        <StaggerContainer className="mt-6 sm:mt-12 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-8 lg:grid-cols-4">
          {cards.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Sparkles;
            return (
              <StaggerItem
                key={item.id || item.title}
                className="group text-center space-y-2 sm:space-y-3 cursor-default px-1"
              >
                <div className="mx-auto flex h-11 w-11 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#efeded] text-[#1b1c1c] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1b1c1c] group-hover:text-white group-hover:shadow-md">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-xs sm:text-base font-semibold text-[#1b1c1c] transition-colors duration-300 group-hover:text-black">
                  {item.title}
                </h3>
                <p className="mx-auto max-w-xs text-[11px] sm:text-xs leading-tight sm:leading-relaxed text-[#5e5e5b]">
                  {item.description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
