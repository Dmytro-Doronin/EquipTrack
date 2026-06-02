import { DashboardContext, DashboardState } from '@/types/dashboard/types';

export const resolveDashboardState = (context: DashboardContext): DashboardState => {
    if (!context.activeOrganization) {
        if (context.pendingRequests.length > 0) {
            return 'PENDING_ORGANIZATION_REQUEST';
        }

        return 'NO_ORGANIZATION';
    }

    if (context.membership?.role === 'owner' || context.membership?.role === 'admin') {
        return 'ADMIN_DASHBOARD';
    }

    return 'MEMBER_DASHBOARD';
};
