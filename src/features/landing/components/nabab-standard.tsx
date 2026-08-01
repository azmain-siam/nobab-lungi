import { Sparkles, Layers, Scissors, Truck, ShieldCheck, RefreshCw, Award, Heart, PackageCheck, Zap } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import type { HomepageConfig } from '@/types';

type WhyChooseUsItem = HomepageConfig['why_choose_us'][number];

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
    id: '1',
    icon: 'Sparkles',
    title: '100% Organic Cotton',
    description: 'Sourced from the finest mills to ensure breathability and unsurpassed softness.',
    sort_order: 1,
  },
  {
    id: '2',
    icon: 'Layers',
    title: 'Authentic Heritage',
    description: 'Woven by master artisans preserving generations of traditional loom artistry.',
    sort_order: 2,
  },
  {
    id: '3',
    icon: 'Scissors',
    title: 'Modern Comfort',
    description: 'Designed for everyday elegance, offering freedom of movement and style.',
    sort_order: 3,
  },
  {
    id: '4',
    icon: 'Truck',
    title: 'Nationwide Delivery',
    description: 'Bringing authentic luxury directly to your doorstep, anywhere in Bangladesh.',
    sort_order: 4,
  },
];

interface NababStandardProps {
  items?: WhyChooseUsItem[];
}

export function NababStandard({ items = [] }: NababStandardProps) {
  const cards = items.length > 0 ? items : DEFAULT_STANDARDS;

  return (
    <Section variant="default" className="py-20 lg:py-28">
      <Container>
        <SectionHeading title="Why Choose Nabab Lungi" align="center" />

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Sparkles;
            return (
              <div
                key={item.id || item.title}
                className="group text-center space-y-4 cursor-default"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#efeded] text-[#1b1c1c] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1b1c1c] group-hover:text-white group-hover:shadow-md">
                  <IconComponent className="h-6 w-6 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#1b1c1c] transition-colors duration-300 group-hover:text-black">
                  {item.title}
                </h3>
                <p className="mx-auto max-w-xs text-xs leading-relaxed text-[#5e5e5b]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
