'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
    const baseStyles = 'relative font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

    const variants = {
      primary: 'bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]',
      secondary: 'bg-transparent border-2 border-[var(--neon-purple)] text-[var(--neon-purple)] hover:bg-[var(--neon-purple)] hover:text-black hover:shadow-[0_0_30px_rgba(157,0,255,0.6)]',
      ghost: 'bg-transparent text-[var(--foreground)] hover:bg-white/10',
      danger: 'bg-gradient-to-r from-[var(--neon-pink)] to-red-500 text-white hover:shadow-[0_0_30px_rgba(255,0,102,0.6)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-6 py-2.5 text-base rounded-lg',
      lg: 'px-8 py-3.5 text-lg rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && 'glow-pulse',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-20 bg-white transition-opacity"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
