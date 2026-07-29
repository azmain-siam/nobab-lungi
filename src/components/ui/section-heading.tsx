import Link from 'next/link';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
  actionHref,
  actionLabel = 'VIEW ALL',
  className = '',
}: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div className={`text-center max-w-lg mx-auto mb-12 sm:mb-14 ${className}`}>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-xs text-[#5e5e5b] sm:text-sm font-light">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-between gap-4 mb-8 sm:mb-10 ${className}`}>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1b1c1c] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-xs text-[#5e5e5b] sm:text-sm font-light">
            {subtitle}
          </p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1b1c1c] transition hover:opacity-70 whitespace-nowrap"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
