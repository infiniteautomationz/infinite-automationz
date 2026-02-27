import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, rightSlot, className }: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {eyebrow ? <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--ia-brand-gold)]">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ia-text-strong)]">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ia-text-soft)]">{description}</p> : null}
      </div>
      {rightSlot ? <div className="flex items-center gap-2">{rightSlot}</div> : null}
    </header>
  );
}
