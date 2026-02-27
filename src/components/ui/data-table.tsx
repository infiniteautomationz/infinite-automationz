import type { ReactNode } from 'react';
import { cn } from './cn';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  compact?: boolean;
  stickyLastColumn?: boolean;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  compact = false,
  stickyLastColumn = false,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('portal-surface overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="border-b border-[var(--ia-border)] bg-white/[0.03]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ia-text-muted)]',
                    stickyLastColumn && index === columns.length - 1 && 'sticky right-0 bg-[var(--ia-bg-1)]',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="group transition-colors duration-[var(--ia-motion-150)] hover:bg-white/[0.03]">
                {columns.map((column, index) => (
                  <td
                    key={`${rowKey(row)}-${column.key}`}
                    className={cn(
                      compact ? 'px-4 py-3 text-sm' : 'px-4 py-4 text-sm',
                      'align-top text-[var(--ia-text)]',
                      stickyLastColumn && index === columns.length - 1 && 'sticky right-0 bg-[var(--ia-bg-1)]',
                      column.className,
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
