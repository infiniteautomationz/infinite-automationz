import { cn } from './cn';

export type StatusPillProps = {
  label: string;
  tone?: 'gold' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
  compact?: boolean;
  className?: string;
};

const toneClasses: Record<NonNullable<StatusPillProps['tone']>, string> = {
  gold: 'border-[#d4af3770] text-[#f4d77b] bg-[#d4af371e]',
  danger: 'border-[#ef444466] text-[#fecaca] bg-[#ef44441a]',
  warning: 'border-[#f59e0b66] text-[#fde68a] bg-[#f59e0b1a]',
  success: 'border-[#22c55e66] text-[#bbf7d0] bg-[#22c55e1a]',
  info: 'border-[#3b82f666] text-[#bfdbfe] bg-[#3b82f61a]',
  neutral: 'border-[var(--ia-border)] text-[var(--ia-text)] bg-white/[0.03]',
};

export function StatusPill({ label, tone = 'neutral', compact = false, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border uppercase tracking-[0.12em] font-semibold',
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
