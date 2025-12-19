'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: 'cyan' | 'magenta' | 'purple' | 'none';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glow = 'none', children, ...props }, ref) => {
    const glowColors = {
      cyan: 'hover:shadow-[0_0_40px_rgba(0,255,255,0.3)]',
      magenta: 'hover:shadow-[0_0_40px_rgba(255,0,255,0.3)]',
      purple: 'hover:shadow-[0_0_40px_rgba(157,0,255,0.3)]',
      none: '',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -5 } : undefined}
        className={cn(
          'glass rounded-xl p-6 transition-all duration-300',
          hover && 'hover:border-[var(--neon-cyan)]',
          glowColors[glow],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
