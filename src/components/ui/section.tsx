import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'dark';
  className?: string;
}

export function Section({
  children,
  variant = 'default',
  className = '',
  ...props
}: SectionProps) {
  const variantStyles = {
    default: 'bg-[#fbf9f8]',
    muted: 'bg-[#f5f3f3]',
    dark: 'bg-[#1b1c1c] text-white',
  };

  return (
    <section
      className={`py-12 lg:py-16 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
