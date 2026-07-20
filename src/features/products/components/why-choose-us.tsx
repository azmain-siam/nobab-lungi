const BENEFITS = [
  {
    icon: '🧵',
    title: '100% Authentic',
    description:
      'Every product is sourced directly from skilled Bangladeshi weavers and certified manufacturers.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description:
      'Delivered within 2–5 business days. Free shipping on orders above ৳1,000 inside Bangladesh.',
  },
  {
    icon: '🔄',
    title: 'Easy Returns',
    description:
      'Not satisfied? Return within 7 days, no questions asked. Your satisfaction is guaranteed.',
  },
  {
    icon: '💳',
    title: 'Secure Payment',
    description:
      'Pay via Cash on Delivery, bKash, or Nagad. Your transactions are always safe with us.',
  },
];

export function WhyChooseUs() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Why Choose Nobab Lungi?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Trusted by thousands of families across Bangladesh
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <span className="text-3xl" aria-hidden="true">
              {benefit.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
