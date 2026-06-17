import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getDashboardContext } from '@/shared/api/dashboard/getDashboardContext';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { getErrorMessage } from '@/utils/ErrorUtil';

export const dashboardContextQueryKey = ['dashboard-context'] as const;

export function useDashboardContext() {
    const notifyError = useNotificationStore((s) => s.error);
    const authStatus = useAuthStore((state) => state.status);

    const query = useQuery({
        queryKey: dashboardContextQueryKey,
        queryFn: getDashboardContext,
        enabled: authStatus === 'authenticated',
    });

    useEffect(() => {
        if (!query.isError) {
            return;
        }

        const msg = getErrorMessage(query.error);
        notifyError(msg ?? 'Failed to load dashboard context');
    }, [query.isError, query.error, notifyError]);

    return query;
}
