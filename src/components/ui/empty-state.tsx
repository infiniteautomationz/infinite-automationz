import type { ReactNode } from 'react';
import { Card } from './card';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <p className="text-lg font-semibold text-[var(--ia-text-strong)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--ia-text-muted)]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </Card>
  );
}
