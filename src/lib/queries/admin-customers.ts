import { differenceInHours } from 'date-fns';
import { prisma } from '@/lib/db';
import type { AdminCustomerFilter, AdminCustomerRowDTO } from '@/types/portal-customers';

function normalizeFilter(filter: AdminCustomerFilter): Required<AdminCustomerFilter> {
  return {
    q: (filter.q || '').trim().toLowerCase(),
    status: filter.status || 'all',
    module: filter.module || 'all',
    risk: filter.risk || 'all',
  };
}

function computeRisk(subscriptionStatus: string | null, pendingApprovals: number, lastActivityAt: Date | null) {
  if (subscriptionStatus === 'payment_failed' || subscriptionStatus === 'canceled') return 'high' as const;
  const staleHours = lastActivityAt ? differenceInHours(new Date(), lastActivityAt) : 999;
  if (pendingApprovals >= 3 || staleHours > 168) return 'medium' as const;
  return 'low' as const;
}

export async function getAdminCustomerRows(filter: AdminCustomerFilter = {}): Promise<AdminCustomerRowDTO[]> {
  const normalized = normalizeFilter(filter);

  const workspaces = await prisma.workspace.findMany({
    include: {
      user: true,
      serviceInstances: {
        select: { moduleType: true, isEnabled: true },
      },
      _count: {
        select: {
          workItems: true,
          messageThreads: true,
        },
      },
      workItems: {
        orderBy: { updatedAt: 'desc' },
        take: 1,
        select: {
          title: true,
          type: true,
          status: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const rows = await Promise.all(
    workspaces.map(async (workspace) => {
      const modules = workspace.serviceInstances.filter((instance) => instance.isEnabled).map((instance) => instance.moduleType);

      const pendingApprovals = await prisma.workItem.count({
        where: {
          workspaceId: workspace.id,
          status: { in: ['Needs Review', 'Needs Client Review', 'Awaiting Approval'] },
        },
      });

      const latestItem = workspace.workItems[0] || null;
      const risk = computeRisk(workspace.stripeSubscriptionStatus, pendingApprovals, latestItem?.updatedAt || null);

      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        customerEmail: workspace.user.email,
        customerDisplayName: workspace.user.displayName,
        subscriptionStatus: workspace.stripeSubscriptionStatus,
        renewalDate: workspace.stripeCurrentPeriodEnd ? workspace.stripeCurrentPeriodEnd.toISOString() : null,
        planKey: workspace.stripePriceId,
        modules,
        totalItems: workspace._count.workItems,
        totalThreads: workspace._count.messageThreads,
        pendingApprovals,
        lastActivityTitle: latestItem?.title || null,
        lastActivityType: latestItem?.type || null,
        lastActivityStatus: latestItem?.status || null,
        lastActivityAt: latestItem?.updatedAt ? latestItem.updatedAt.toISOString() : null,
        risk,
      } satisfies AdminCustomerRowDTO;
    }),
  );

  return rows.filter((row) => {
    if (normalized.q) {
      const matchesQ =
        row.customerEmail.toLowerCase().includes(normalized.q) ||
        (row.customerDisplayName || '').toLowerCase().includes(normalized.q) ||
        row.workspaceName.toLowerCase().includes(normalized.q);
      if (!matchesQ) return false;
    }

    if (normalized.status !== 'all' && row.subscriptionStatus !== normalized.status) return false;
    if (normalized.module !== 'all' && !row.modules.includes(normalized.module)) return false;
    if (normalized.risk !== 'all' && row.risk !== normalized.risk) return false;

    return true;
  });
}
