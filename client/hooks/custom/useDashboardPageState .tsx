'use client';

import { useDashboardContext } from '@/hooks/query/useDashboardContext';
import { resolveDashboardState } from '@/models/resolveDashboardState';
import { useAuthStore } from '@/stores/auth.store';
import { DashboardContext, DashboardState } from '@/types/dashboard/types';

type UseDashboardPageState =
    | {
          status: 'loading';
      }
    | {
          status: 'error';
          error: unknown;
      }
    | {
          status: 'success';
          context: DashboardContext;
          dashboardState: DashboardState;
      };

export const useDashboardPageState = (): UseDashboardPageState => {
    const authStatus = useAuthStore((state) => state.status);

    const { data: dashboardContext, error, isPending } = useDashboardContext();

    if (authStatus === 'checking' || isPending) {
        return {
            status: 'loading',
        };
    }

    if (error || !dashboardContext) {
        return {
            status: 'error',
            error,
        };
    }

    return {
        status: 'success',
        context: dashboardContext,
        dashboardState: resolveDashboardState(dashboardContext),
    };
};
