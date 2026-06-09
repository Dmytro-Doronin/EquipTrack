import { DashboardContext, DashboardState } from '@/types/dashboard/types';

export const resolveDashboardState = (context: DashboardContext): DashboardState => {
    if (context.activeOrganization && context.membership?.status === 'active') {
        if (context.membership.role === 'owner' || context.membership.role === 'admin') {
            return 'ADMIN_DASHBOARD';
        }

        return 'MEMBER_DASHBOARD';
    }

    if (context.pendingRequests.length > 0) {
        return 'PENDING_ORGANIZATION_REQUEST';
    }

    return 'NO_ORGANIZATION';
};
