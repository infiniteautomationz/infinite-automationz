export type AdminCustomerFilter = {
  q?: string;
  status?: 'all' | 'active' | 'payment_failed' | 'canceled';
  module?: 'all' | 'SOCIAL' | 'WEBSITE' | 'RECEPTIONIST' | 'AVATAR' | 'VIDEO_ADS' | 'AUTOMATIONS';
  risk?: 'all' | 'high' | 'medium' | 'low';
};

export type AdminCustomerRowDTO = {
  workspaceId: string;
  workspaceName: string;
  customerEmail: string;
  customerDisplayName: string | null;
  subscriptionStatus: string | null;
  renewalDate: string | null;
  planKey: string | null;
  modules: string[];
  totalItems: number;
  totalThreads: number;
  pendingApprovals: number;
  lastActivityTitle: string | null;
  lastActivityType: string | null;
  lastActivityStatus: string | null;
  lastActivityAt: string | null;
  risk: 'high' | 'medium' | 'low';
};
