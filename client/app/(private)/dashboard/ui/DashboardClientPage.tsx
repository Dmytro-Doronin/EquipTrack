'use client';

import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DashboardStatePlaceholder } from '@/components/dashboard/DashboardStatePlaceholder';
import { MemberDashboard } from '@/components/dashboard/MemberDashboard';
import { NoOrganizationDashboard } from '@/components/dashboard/NoOrganizationDashboard';
import { PendingOrganizationDashboard } from '@/components/dashboard/PendingOrganizationDashboard';
import { Loader } from '@/components/loader/Loader';
import { useDashboardPageState } from '@/hooks/custom/useDashboardPageState ';

export const DashboardClientPage = () => {
    const dashboardPageState = useDashboardPageState();

    if (dashboardPageState.status === 'loading') {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (dashboardPageState.status === 'error') {
        return (
            <section className="rounded-xl border border-danger/30 bg-danger/5 p-6">
                <h2 className="text-xl font-bold text-dark">Dashboard unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    We could not load your dashboard context. Please refresh the page or try again
                    later.
                </p>
            </section>
        );
    }

    if (dashboardPageState.dashboardState === 'NO_ORGANIZATION') {
        return <NoOrganizationDashboard />;
    }

    if (dashboardPageState.dashboardState === 'PENDING_ORGANIZATION_REQUEST') {
        return (
            <PendingOrganizationDashboard
                pendingRequests={dashboardPageState.context.pendingRequests}
            />
        );
    }

    if (
        dashboardPageState.dashboardState === 'ADMIN_DASHBOARD' &&
        dashboardPageState.context.activeOrganization
    ) {
        return <AdminDashboard organization={dashboardPageState.context.activeOrganization} />;
    }

    if (
        dashboardPageState.dashboardState === 'MEMBER_DASHBOARD' &&
        dashboardPageState.context.activeOrganization
    ) {
        return (
            <MemberDashboard
                context={dashboardPageState.context}
                organization={dashboardPageState.context.activeOrganization}
            />
        );
    }

    return <DashboardStatePlaceholder state={dashboardPageState.dashboardState} />;
};
