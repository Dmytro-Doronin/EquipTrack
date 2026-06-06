import type { DashboardContext } from '@/types/dashboard/types';

import { apiClient } from '@/api/apiClient';

type DashboardContextPayload = Omit<
    DashboardContext,
    'myAssets' | 'myTransfers' | 'pendingRequests' | 'recentActivity' | 'stats'
> &
    Partial<
        Pick<DashboardContext, 'myAssets' | 'myTransfers' | 'pendingRequests' | 'recentActivity'>
    > & {
        stats?: DashboardContext['stats'] | null;
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
    const myAssets = context.myAssets ?? [];
    const myTransfers = context.myTransfers ?? [];

    return {
        ...context,
        myAssets,
        myTransfers,
        pendingRequests: context.pendingRequests ?? [],
        recentActivity: context.recentActivity ?? [],
        stats: context.stats ?? {
            assignedAssets: myAssets.length,
            overdueReturns: myAssets.filter((asset) => isOverdue(asset.dueDate)).length,
            pendingTransfers: myTransfers.filter((transfer) => transfer.status === 'pending')
                .length,
        },
    };
};

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
