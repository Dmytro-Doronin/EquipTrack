'use client';

import { DashboardStatePlaceholder } from '@/components/dashboard/DashboardStatePlaceholder';
import { NoOrganizationDashboard } from '@/components/dashboard/NoOrganizationDashboard';
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

    return <DashboardStatePlaceholder state={dashboardPageState.dashboardState} />;
};
