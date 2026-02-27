import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-[0.04em] transition-all duration-[var(--ia-motion-150)] ease-[var(--ia-ease-standard)] disabled:pointer-events-none disabled:opacity-50 portal-focus-ring',
  {
    variants: {
      variant: {
        default:
          'rounded-[var(--ia-radius-sm)] border border-[var(--ia-border-gold)] bg-[linear-gradient(135deg,#f4d77b,#d4af37)] text-[#111] shadow-[var(--ia-shadow-gold)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'rounded-[var(--ia-radius-sm)] border border-[#ef444480] bg-[#ef444420] text-[#fecaca] hover:bg-[#ef444438] hover:-translate-y-0.5',
        outline:
          'rounded-[var(--ia-radius-sm)] border border-[var(--ia-border)] bg-white/[0.02] text-[var(--ia-text)] hover:border-[var(--ia-border-strong)] hover:bg-white/[0.08]',
        secondary:
          'rounded-[var(--ia-radius-sm)] border border-[#3b82f666] bg-[#3b82f620] text-[#bfdbfe] hover:bg-[#3b82f630] hover:-translate-y-0.5',
        ghost: 'rounded-[var(--ia-radius-sm)] text-[var(--ia-text)] hover:bg-white/[0.08] hover:text-[var(--ia-text-strong)]',
        link: 'rounded-[var(--ia-radius-xs)] text-[var(--ia-brand-gold-highlight)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 text-sm',
        sm: 'h-9 px-3 text-xs uppercase tracking-[0.1em]',
        lg: 'h-11 px-6 text-sm uppercase tracking-[0.1em]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
