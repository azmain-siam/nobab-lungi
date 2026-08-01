import { Sparkles, Layers, Scissors, Truck } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';

const STANDARDS = [
    {
        icon: Sparkles,
        title: 'Premium Cotton',
        description:
            'Sourced from the finest mills to ensure breathability and unsurpassed softness.',
    },
    {
        icon: Layers,
        title: 'Heritage Craft',
        description:
            'Woven by master artisans preserving generations of traditional techniques.',
    },
    {
        icon: Scissors,
        title: 'Modern Comfort',
        description:
            'Designed for everyday elegance, offering freedom of movement and style.',
    },
    {
        icon: Truck,
        title: 'Nationwide Delivery',
        description:
            'Bringing authentic luxury directly to your doorstep, anywhere in the country.',
    },
];

export function NababStandards() {
    return (
        <Section variant="default" className="py-20 lg:py-28">
            <Container>
                <SectionHeading title="The Nabab Standard" align="center" />

                <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {STANDARDS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="group text-center space-y-4 cursor-default"
                            >
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#efeded] text-[#1b1c1c] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1b1c1c] group-hover:text-white group-hover:shadow-md">
                                    <Icon className="h-6 w-6 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
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