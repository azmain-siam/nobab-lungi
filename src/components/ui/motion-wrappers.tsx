'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  distance = 20,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Common Motion Design Tokens & Variants
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const crossfadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7, ease: easeOutExpo } },
  exit: { opacity: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

export const slideDownMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};

export const dropdownFadeVariants: Variants = {
  closed: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
};
