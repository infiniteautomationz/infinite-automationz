export type DateRangePreset = '7d' | '30d' | '90d';

export type AdminAnalyticsSummaryDTO = {
  activeClients: number;
  estimatedMRR: number;
  pendingApprovals: number;
  avgTurnaroundDays: number;
  avgApprovalAgingHours: number;
  totalRevisions: number;
  paymentFailedCount: number;
  canceledCount: number;
  workload7: number;
  workload30: number;
};

export type AdminAnalyticsSeriesDTO = {
  label: string;
  created: number;
  completed: number;
  approvals: number;
};
