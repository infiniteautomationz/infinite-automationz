import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[var(--ia-radius-sm)] border border-[var(--ia-border)] bg-black/30 px-3 py-2 text-sm text-[var(--ia-text-strong)] placeholder:text-[var(--ia-text-muted)] focus-visible:border-[var(--ia-border-gold)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
