import type { DashboardContext } from '@/types/dashboard/types';

import { AssetStatusOverview } from '@/components/dashboard/adminDashboard/AssetStatusOverview';
import { LatestAssetsList } from '@/components/dashboard/adminDashboard/LatestAssetsList';
import { MembersPreviewList } from '@/components/dashboard/adminDashboard/MembersPreviewList';
import { RecentActivityList } from '@/components/dashboard/adminDashboard/RecentActivityList';
import { PendingJoinRequestsPanel } from '@/components/dashboard/PendingJoinRequestsPanel';
import { formatRole } from '@/utils/formatUtils';

type AdminDashboardProps = {
    context: DashboardContext;
    organization: NonNullable<DashboardContext['activeOrganization']>;
};

const summaryCards = [
    {
        key: 'totalAssets',
        label: 'Total assets',
    },
    {
        key: 'assignedAssets',
        label: 'Assigned assets',
    },
    {
        key: 'availableAssets',
        label: 'Available assets',
    },
    {
        key: 'maintenanceAssets',
        label: 'Maintenance',
    },
    {
        key: 'lostAssets',
        label: 'Lost',
    },
    {
        key: 'members',
        label: 'Members',
    },
    {
        key: 'pendingJoinRequests',
        label: 'Pending join requests',
    },
    {
        key: 'pendingTransfers',
        label: 'Pending transfers',
    },
    {
        key: 'overdueReturns',
        label: 'Overdue returns',
    },
] as const;

export const AdminDashboard = ({ context, organization }: AdminDashboardProps) => {
    const roleLabel = formatRole(context.membership?.role);

    return (
        <section className="space-y-5">
            <div className="rounded-[12px] border border-gray-main bg-white p-6">
                <p className="text-sm font-medium text-sub-text">{organization.name}</p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className="text-2xl font-bold text-dark">Organization dashboard</h1>
                    {roleLabel && (
                        <span className="inline-flex w-fit rounded-full bg-round px-3 py-1 text-xs font-medium text-main">
                            {roleLabel}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map((card) => (
                    <article
                        className="rounded-[12px] border border-gray-main bg-white p-5"
                        key={card.key}
                    >
                        <p className="text-sm font-medium text-sub-text">{card.label}</p>
                        <p className="mt-3 text-3xl font-bold text-dark">
                            {context.stats[card.key]}
                        </p>
                    </article>
                ))}
            </div>

            <AssetStatusOverview context={context} />
            <LatestAssetsList assets={context.latestAssets} />
            <MembersPreviewList members={context.membersPreview} />
            <PendingJoinRequestsPanel organizationId={organization.id} />
            <RecentActivityList recentActivity={context.recentActivity} />
        </section>
    );
};
