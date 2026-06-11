import type { DashboardContext } from '@/types/dashboard/types';

import { apiClient } from '@/shared/api/apiClient';

type DashboardContextPayload = Omit<
    DashboardContext,
    | 'latestAssets'
    | 'membersPreview'
    | 'myAssets'
    | 'myTransfers'
    | 'pendingRequests'
    | 'recentActivity'
    | 'stats'
> &
    Partial<
        Pick<
            DashboardContext,
            | 'latestAssets'
            | 'membersPreview'
            | 'myAssets'
            | 'myTransfers'
            | 'pendingRequests'
            | 'recentActivity'
        >
    > & {
        stats?: Partial<DashboardContext['stats']> | null;
    };

type DashboardContextResponse =
    | DashboardContextPayload
    | {
          success: boolean;
          data: DashboardContextPayload;
      };

export const getDashboardContext = async (): Promise<DashboardContext> => {
    const response = await apiClient.get<DashboardContextResponse>('/dashboard');
    const payload = response.data;

    if ('data' in payload) {
        return normalizeDashboardContext(payload.data);
    }

    return normalizeDashboardContext(payload);
};

const normalizeDashboardContext = (context: DashboardContextPayload): DashboardContext => {
    const latestAssets = context.latestAssets ?? [];
    const membersPreview = context.membersPreview ?? [];
    const myAssets = context.myAssets ?? [];
    const myTransfers = context.myTransfers ?? [];

    return {
        ...context,
        latestAssets,
        membersPreview,
        myAssets,
        myTransfers,
        pendingRequests: context.pendingRequests ?? [],
        recentActivity: context.recentActivity ?? [],
        stats: normalizeDashboardStats(context.stats, myAssets, myTransfers),
    };
};

const normalizeDashboardStats = (
    stats: Partial<DashboardContext['stats']> | null | undefined,
    myAssets: DashboardContext['myAssets'],
    myTransfers: DashboardContext['myTransfers'],
): DashboardContext['stats'] => ({
    assignedAssets: stats?.assignedAssets ?? myAssets.length,
    availableAssets: stats?.availableAssets ?? 0,
    lostAssets: stats?.lostAssets ?? 0,
    maintenanceAssets: stats?.maintenanceAssets ?? 0,
    members: stats?.members ?? 0,
    overdueReturns:
        stats?.overdueReturns ?? myAssets.filter((asset) => isOverdue(asset.dueDate)).length,
    pendingJoinRequests: stats?.pendingJoinRequests ?? 0,
    pendingTransfers:
        stats?.pendingTransfers ??
        myTransfers.filter((transfer) => transfer.status === 'pending').length,
    totalAssets: stats?.totalAssets ?? 0,
});

const isOverdue = (dueDate?: string | null): boolean => {
    if (!dueDate) {
        return false;
    }

    const date = new Date(dueDate);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    return date < new Date();
};
