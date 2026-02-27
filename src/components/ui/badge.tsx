import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[var(--ia-border-gold)] bg-[var(--ia-brand-gold-soft)] text-[var(--ia-brand-gold-highlight)]',
        secondary: 'border-[var(--ia-border)] bg-white/[0.04] text-[var(--ia-text)]',
        destructive: 'border-[#ef444466] bg-[#ef44441a] text-[#fecaca]',
        outline: 'border-[var(--ia-border)] text-[var(--ia-text)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
