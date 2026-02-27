import { Card } from './card';
import { cn } from './cn';

export type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: 'neutral' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
};

const toneStyles: Record<NonNullable<KpiCardProps['tone']>, string> = {
  neutral: 'border-[var(--ia-border)]',
  gold: 'border-[var(--ia-border-gold)] bg-[linear-gradient(180deg,#1b1710,#111115)] shadow-[var(--ia-shadow-gold)]',
  success: 'border-[#22c55e55] bg-[linear-gradient(180deg,#0f1d14,#111115)]',
  warning: 'border-[#f59e0b55] bg-[linear-gradient(180deg,#20180d,#111115)]',
  danger: 'border-[#ef444455] bg-[linear-gradient(180deg,#211214,#111115)]',
  info: 'border-[#3b82f655] bg-[linear-gradient(180deg,#11192a,#111115)]',
};

export function KpiCard({ label, value, hint, tone = 'neutral', className }: KpiCardProps) {
  return (
    <Card className={cn('p-5 transition-transform duration-[var(--ia-motion-220)] hover:-translate-y-0.5', toneStyles[tone], className)}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ia-text-muted)]">{label}</p>
      <p className="portal-kpi-number mt-2 text-4xl leading-none text-[var(--ia-text-strong)]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[var(--ia-text-muted)]">{hint}</p> : null}
    </Card>
  );
}
