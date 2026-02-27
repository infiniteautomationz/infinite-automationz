import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

type WorkspaceBillingView = {
    id: string;
    stripeSubscriptionStatus: string | null;
    billingLockReason: string | null;
    lockedAt: Date | null;
};

const READ_ONLY_STATUSES = new Set(['payment_failed', 'canceled']);

export function isWorkspaceReadOnly(workspace: WorkspaceBillingView): boolean {
    if (workspace.lockedAt) return true;
    if (!workspace.stripeSubscriptionStatus) return false;
    return READ_ONLY_STATUSES.has(workspace.stripeSubscriptionStatus);
}

export function getWorkspaceLockReason(workspace: WorkspaceBillingView): string {
    if (workspace.billingLockReason) return workspace.billingLockReason;
    if (workspace.stripeSubscriptionStatus === 'canceled') return 'Subscription canceled';
    if (workspace.stripeSubscriptionStatus === 'payment_failed') return 'Payment failed';
    return 'Billing lock';
}

export async function getPortalUserContext(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            workspaces: {
                include: {
                    serviceInstances: true,
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    if (user.role === 'ADMIN') {
        const cookieStore = await cookies();
        const selectedWorkspaceId = cookieStore.get('admin_workspace_id')?.value || null;

        let workspace =
            selectedWorkspaceId
                ? await prisma.workspace.findUnique({
                      where: { id: selectedWorkspaceId },
                      include: { serviceInstances: true },
                  })
                : null;

        if (!workspace) {
            workspace = user.workspaces[0] ?? (await prisma.workspace.findFirst({
                orderBy: { updatedAt: 'desc' },
                include: { serviceInstances: true },
            }));
        }

        if (!workspace) {
            return null;
        }

        // Safe preview mode keeps admin impersonation read-only.
        if (selectedWorkspaceId && !workspace.lockedAt) {
            workspace = {
                ...workspace,
                lockedAt: new Date(),
                billingLockReason: workspace.billingLockReason || 'Admin preview mode (read-only)',
            };
        }

        return {
            user,
            workspace,
        };
    }

    if (user.workspaces.length === 0) {
        return null;
    }

    return {
        user,
        workspace: user.workspaces[0],
    };
}

export async function assertWorkItemAccess(userId: string, workItemId: string) {
    const context = await getPortalUserContext(userId);
    if (!context) {
        throw new Error('Workspace not found');
    }

    const item = await prisma.workItem.findUnique({
        where: { id: workItemId },
    });

    if (!item || item.workspaceId !== context.workspace.id) {
        throw new Error('Work item not found');
    }

    return {
        ...context,
        item,
    };
}

export function assertWorkspaceMutable(workspace: WorkspaceBillingView) {
    if (isWorkspaceReadOnly(workspace)) {
        throw new Error(`Workspace is read-only: ${getWorkspaceLockReason(workspace)}`);
    }
}
