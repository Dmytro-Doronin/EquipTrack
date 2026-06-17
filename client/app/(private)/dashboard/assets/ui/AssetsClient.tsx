'use client';

import { AssetTable } from '@/components/assets/AssetTable/AssetTable';
import { NoOrganizationDashboard } from '@/components/dashboard/NoOrganizationDashboard';
import { PendingOrganizationDashboard } from '@/components/dashboard/PendingOrganizationDashboard';
import { Loader } from '@/components/loader/Loader';
import { useDashboardAccess } from '@/hooks/custom/useDashboardAccess';
import { useAssetsQuery } from '@/hooks/query/useAssetsQuery';

export const AssetsClient = () => {
    const {
        canReadAsset,
        dashboard,
        error: dashboardError,
        isError: isDashboardError,
        isLoading: isDashboardLoading,
    } = useDashboardAccess();
    const { assets, errorMessage, isError, isPending } = useAssetsQuery({
        enabled: Boolean(dashboard?.activeOrganization) && canReadAsset,
    });

    if (isDashboardLoading) {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isDashboardError || !dashboard) {
        return (
            <section className="rounded-[12px] border border-danger/30 bg-danger/5 p-6">
                <h2 className="text-xl font-bold text-dark">Assets unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    {dashboardError
                        ? 'We could not load your dashboard context. Please try again later.'
                        : 'Dashboard context is unavailable.'}
                </p>
            </section>
        );
    }

    if (!dashboard.activeOrganization) {
        if (dashboard.pendingRequests.length > 0) {
            return <PendingOrganizationDashboard pendingRequests={dashboard.pendingRequests} />;
        }

        return <NoOrganizationDashboard />;
    }

    if (!canReadAsset) {
        return (
            <section className="rounded-[12px] border border-gray-main bg-round/60 p-6">
                <h2 className="text-xl font-bold text-dark">Assets unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    You do not have permission to view assets for this organization.
                </p>
            </section>
        );
    }

    if (isPending) {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <section className="rounded-[12px] border border-danger/30 bg-danger/5 p-6">
                <h2 className="text-xl font-bold text-dark">Assets unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    {errorMessage ?? 'We could not load your assets. Please try again later.'}
                </p>
            </section>
        );
    }

    return <AssetTable assets={assets} />;
};
