import { addDays, differenceInHours, eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { prisma } from '@/lib/db';
import type { AdminAnalyticsSeriesDTO, AdminAnalyticsSummaryDTO, DateRangePreset } from '@/types/portal-analytics';

const PLAN_MRR_MAP: Record<string, number> = {
  bundle_digital_presence: 149,
  bundle_operations_scale: 299,
  bundle_social_growth: 199,
  svc_social_media_automation: 199,
  svc_ai_website: 149,
  svc_ai_receptionist: 299,
  svc_ai_avatar_clone: 199,
  svc_ai_video_ads: 199,
  svc_advanced_custom_automations: 299,
};

const REVIEW_STATUSES = ['Needs Review', 'Needs Client Review', 'Client Review', 'Awaiting Approval'];
const DONE_STATUSES = ['Completed', 'Posted', 'Final Delivered'];

export async function getAdminAnalyticsSummary(workspaceId?: string): Promise<AdminAnalyticsSummaryDTO> {
  const whereWorkspace = workspaceId ? { id: workspaceId } : {};
  const whereWorkItem = workspaceId ? { workspaceId } : {};
  const now = new Date();

  const [workspaces, allItems, pendingApprovals] = await Promise.all([
    prisma.workspace.findMany({ where: whereWorkspace, orderBy: { createdAt: 'asc' } }),
    prisma.workItem.findMany({
      where: whereWorkItem,
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        revisionCount: true,
        dueDate: true,
      },
    }),
    prisma.workItem.findMany({
      where: { ...whereWorkItem, status: { in: REVIEW_STATUSES } },
      select: { id: true, createdAt: true },
    }),
  ]);

  const activeClients = workspaces.filter((workspace) => workspace.stripeSubscriptionStatus === 'active').length;
  const paymentFailedCount = workspaces.filter((workspace) => workspace.stripeSubscriptionStatus === 'payment_failed').length;
  const canceledCount = workspaces.filter((workspace) => workspace.stripeSubscriptionStatus === 'canceled').length;

  const estimatedMRR = workspaces.reduce((sum, workspace) => {
    if (workspace.stripeSubscriptionStatus !== 'active' || !workspace.stripePriceId) return sum;
    return sum + (PLAN_MRR_MAP[workspace.stripePriceId] ?? 0);
  }, 0);

  const completedItems = allItems.filter((item) => DONE_STATUSES.includes(item.status));
  const avgTurnaroundDays = completedItems.length
    ? completedItems.reduce((sum, item) => sum + (item.updatedAt.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60 * 24), 0) /
      completedItems.length
    : 0;

  const avgApprovalAgingHours = pendingApprovals.length
    ? pendingApprovals.reduce((sum, item) => sum + differenceInHours(now, item.createdAt), 0) / pendingApprovals.length
    : 0;

  const totalRevisions = allItems.reduce((sum, item) => sum + item.revisionCount, 0);
  const next7 = addDays(now, 7);
  const next30 = addDays(now, 30);
  const workload7 = allItems.filter((item) => item.dueDate && item.dueDate >= now && item.dueDate <= next7).length;
  const workload30 = allItems.filter((item) => item.dueDate && item.dueDate >= now && item.dueDate <= next30).length;

  return {
    activeClients,
    estimatedMRR,
    pendingApprovals: pendingApprovals.length,
    avgTurnaroundDays,
    avgApprovalAgingHours,
    totalRevisions,
    paymentFailedCount,
    canceledCount,
    workload7,
    workload30,
  };
}

export async function getAdminAnalyticsSeries(range: DateRangePreset = '30d', workspaceId?: string): Promise<AdminAnalyticsSeriesDTO[]> {
  const now = new Date();
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const from = startOfDay(subDays(now, days - 1));

  const whereWorkspace = workspaceId ? { workspaceId } : {};

  const [createdItems, completedItems, reviewItems] = await Promise.all([
    prisma.workItem.findMany({
      where: { ...whereWorkspace, createdAt: { gte: from } },
      select: { createdAt: true },
    }),
    prisma.workItem.findMany({
      where: { ...whereWorkspace, status: { in: DONE_STATUSES }, updatedAt: { gte: from } },
      select: { updatedAt: true },
    }),
    prisma.workItem.findMany({
      where: { ...whereWorkspace, status: { in: REVIEW_STATUSES }, updatedAt: { gte: from } },
      select: { updatedAt: true },
    }),
  ]);

  const buckets = eachDayOfInterval({ start: from, end: now }).map((date) => {
    const label = format(date, days > 30 ? 'MMM d' : 'EEE');
    return {
      key: format(date, 'yyyy-MM-dd'),
      label,
      created: 0,
      completed: 0,
      approvals: 0,
    };
  });

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  createdItems.forEach((item) => {
    const key = format(item.createdAt, 'yyyy-MM-dd');
    const bucket = byKey.get(key);
    if (bucket) bucket.created += 1;
  });

  completedItems.forEach((item) => {
    const key = format(item.updatedAt, 'yyyy-MM-dd');
    const bucket = byKey.get(key);
    if (bucket) bucket.completed += 1;
  });

  reviewItems.forEach((item) => {
    const key = format(item.updatedAt, 'yyyy-MM-dd');
    const bucket = byKey.get(key);
    if (bucket) bucket.approvals += 1;
  });

  return buckets.map(({ label, created, completed, approvals }) => ({ label, created, completed, approvals }));
}
