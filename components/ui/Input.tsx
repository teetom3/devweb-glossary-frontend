'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-[var(--neon-cyan)]">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'bg-[var(--background-secondary)] border-2 border-[var(--glass-border)]',
            'text-[var(--foreground)] placeholder:text-gray-500',
            'focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
            'transition-all duration-300',
            error && 'border-[var(--neon-pink)] focus:border-[var(--neon-pink)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--neon-pink)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
