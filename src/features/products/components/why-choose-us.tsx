import { ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: '100% Authentic Handloom',
    description:
      'Every product is sourced directly from certified Bangladeshi weavers and traditional artisan looms.',
  },
  {
    icon: Truck,
    title: 'Express Islandwide Delivery',
    description:
      'Swift 2–4 day delivery across Bangladesh. Free shipping on orders above ৳1,000.',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    description:
      'Hassle-free 7-day return guarantee. Your satisfaction and trust are our top priorities.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description:
      'Pay via Cash on Delivery (COD), bKash, Nagad, or credit card with 100% encryption.',
  },
];

export function WhyChooseUs() {
  return (
    <div className="space-y-10 rounded-xl border border-border/80 bg-surface-container/30 px-6 py-12 sm:px-10">
      <div className="text-center max-w-xl mx-auto">
        <span className="label-caps tracking-[0.2em] text-secondary">Why Choose Us</span>
        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          The Nobab Guarantee
        </h2>
        <p className="mt-2 text-sm font-light text-foreground/70">
          Trusted by over 50,000 customers across Bangladesh for genuine quality &amp; comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="group rounded-lg border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-secondary/50 hover:shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light text-secondary transition-transform group-hover:scale-110">
                <Icon aria-hidden="true" className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="mt-4 font-serif text-base font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-foreground/70">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
