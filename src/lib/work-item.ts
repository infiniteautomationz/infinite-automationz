export type WorkItemData = {
    postedUrls?: string[];
    hashtags?: string[];
    platforms?: string[];
    tags?: string[];
    revisionReason?: string;
    outOfScopeReason?: string;
    paidChangeRequestId?: string;
    [key: string]: unknown;
};

export function parseWorkItemData(dataJson: string | null): WorkItemData {
    if (!dataJson) return {};
    try {
        return JSON.parse(dataJson) as WorkItemData;
    } catch {
        return {};
    }
}

export function stringifyWorkItemData(data: WorkItemData): string {
    return JSON.stringify(data);
}

export const WORKFLOW_BY_TYPE: Record<string, string[]> = {
    social_post: ['Draft', 'Needs Review', 'Changes Requested', 'Approved', 'Scheduled', 'Posted'],
    website_change: ['Intake', 'In Progress', 'Needs Client Review', 'Approved', 'Completed'],
    receptionist_kb: ['Draft', 'Needs Review', 'Approved'],
    receptionist_change: ['Intake', 'In Progress', 'Needs Client Review', 'Approved', 'Completed'],
    avatar_request: ['Brief', 'Draft', 'Client Review', 'Approved', 'Final Delivered'],
    video_ad: ['Brief', 'Script', 'Draft Cut', 'Client Review', 'Approved', 'Final Delivered'],
    automation_request: ['Intake', 'Build', 'Test', 'Client Review', 'Live'],
    support_ticket: ['Intake', 'In Progress', 'Needs Client Review', 'Completed'],
};

export function getWorkflow(type: string): string[] {
    return WORKFLOW_BY_TYPE[type] || ['Draft', 'In Progress', 'Needs Review', 'Approved', 'Completed'];
}

export function canTransitionStatus(input: {
    type: string;
    currentStatus: string;
    nextStatus: string;
    isAdmin: boolean;
}) {
    const workflow = getWorkflow(input.type);
    if (!workflow.includes(input.nextStatus)) return false;

    if (input.isAdmin) return true;

    if (input.currentStatus === 'Needs Review') {
        return input.nextStatus === 'Approved' || input.nextStatus === 'Changes Requested';
    }

    return false;
}
