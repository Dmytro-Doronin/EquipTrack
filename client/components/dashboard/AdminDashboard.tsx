import type {
    DashboardAdminAsset,
    DashboardContext,
    DashboardOrganizationMemberPreview,
    DashboardRecentActivity,
} from '@/types/dashboard/types';

import { PendingJoinRequestsPanel } from '@/components/dashboard/PendingJoinRequestsPanel';
import { formatDisplayDate } from '@/utils/formatDate';

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

const assetStatusRows = [
    {
        key: 'assignedAssets',
        label: 'Assigned',
    },
    {
        key: 'availableAssets',
        label: 'Available',
    },
    {
        key: 'maintenanceAssets',
        label: 'Maintenance',
    },
    {
        key: 'lostAssets',
        label: 'Lost',
    },
] as const;

export function AdminDashboard({ context, organization }: AdminDashboardProps) {
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
}

type AssetStatusOverviewProps = {
    context: DashboardContext;
};

function AssetStatusOverview({ context }: AssetStatusOverviewProps) {
    const totalAssets = context.stats.totalAssets;

    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Asset overview</h2>

            <div className="mt-5 space-y-4">
                {assetStatusRows.map((row) => {
                    const value = context.stats[row.key];
                    const percentage =
                        totalAssets > 0 ? Math.round((value / totalAssets) * 100) : 0;

                    return (
                        <div key={row.key}>
                            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                <span className="font-medium text-dark">{row.label}</span>
                                <span className="text-sub-text">
                                    {value} {percentage > 0 ? `(${percentage}%)` : ''}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-round">
                                <div
                                    className="h-full rounded-full bg-main"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

type LatestAssetsListProps = {
    assets: DashboardAdminAsset[];
};

function LatestAssetsList({ assets }: LatestAssetsListProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Latest assets</h2>

            {assets.length === 0 && <EmptyState className="mt-5">No assets yet</EmptyState>}

            {assets.length > 0 && (
                <div className="mt-5 overflow-x-auto rounded-lg border border-gray-main">
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead className="bg-round text-xs font-medium uppercase text-sub-text">
                            <tr>
                                <th className="px-4 py-3" scope="col">
                                    Asset name
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Category
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Serial number
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Status
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Assigned to
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Created date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-main">
                            {assets.map((asset) => (
                                <LatestAssetRow asset={asset} key={asset.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

type LatestAssetRowProps = {
    asset: DashboardAdminAsset;
};

function LatestAssetRow({ asset }: LatestAssetRowProps) {
    const createdDate = formatDisplayDate(asset.createdAt);

    return (
        <tr className="bg-white align-top">
            <td className="px-4 py-4 font-medium text-dark">{asset.name}</td>
            <td className="px-4 py-4 text-sub-text">{asset.category}</td>
            <td className="px-4 py-4 text-sub-text">{asset.serialNumber}</td>
            <td className="px-4 py-4">
                <StatusBadge status={asset.status} />
            </td>
            <td className="px-4 py-4 text-sub-text">{asset.assignedTo?.login ?? 'Unassigned'}</td>
            <td className="px-4 py-4 text-sub-text">{createdDate ?? '-'}</td>
        </tr>
    );
}

type MembersPreviewListProps = {
    members: DashboardOrganizationMemberPreview[];
};

function MembersPreviewList({ members }: MembersPreviewListProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Members preview</h2>

            {members.length === 0 && <EmptyState className="mt-5">No members yet</EmptyState>}

            {members.length > 0 && (
                <div className="mt-5 overflow-x-auto rounded-lg border border-gray-main">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-round text-xs font-medium uppercase text-sub-text">
                            <tr>
                                <th className="px-4 py-3" scope="col">
                                    Login
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Email
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Organization role
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Status
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Joined date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-main">
                            {members.map((member) => (
                                <MemberPreviewRow key={member.id} member={member} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

type MemberPreviewRowProps = {
    member: DashboardOrganizationMemberPreview;
};

function MemberPreviewRow({ member }: MemberPreviewRowProps) {
    const joinedDate = formatDisplayDate(member.joinedAt);

    return (
        <tr className="bg-white align-top">
            <td className="px-4 py-4 font-medium text-dark">{member.login}</td>
            <td className="px-4 py-4 text-sub-text">{member.email}</td>
            <td className="px-4 py-4 text-sub-text">{formatRole(member.role)}</td>
            <td className="px-4 py-4">
                <StatusBadge status={member.status} />
            </td>
            <td className="px-4 py-4 text-sub-text">{joinedDate ?? '-'}</td>
        </tr>
    );
}

type RecentActivityListProps = {
    recentActivity: DashboardRecentActivity[];
};

function RecentActivityList({ recentActivity }: RecentActivityListProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Recent activity</h2>

            {recentActivity.length === 0 && (
                <EmptyState className="mt-5">No recent activity</EmptyState>
            )}

            {recentActivity.length > 0 && (
                <div className="mt-5 divide-y divide-gray-main overflow-hidden rounded-lg border border-gray-main">
                    {recentActivity.map((activity) => (
                        <ActivityRow activity={activity} key={activity.id} />
                    ))}
                </div>
            )}
        </section>
    );
}

type ActivityRowProps = {
    activity: DashboardRecentActivity;
};

function ActivityRow({ activity }: ActivityRowProps) {
    const createdDate = formatDisplayDate(activity.createdAt);

    return (
        <article className="flex flex-col gap-2 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-dark">{activity.message}</p>
            <p className="text-sm text-sub-text">{createdDate ?? '-'}</p>
        </article>
    );
}

type StatusBadgeProps = {
    className?: string;
    status: string;
};

function StatusBadge({ className = '', status }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex w-fit rounded-full bg-round px-3 py-1 text-xs font-medium capitalize text-main ${className}`}
        >
            {formatStatus(status)}
        </span>
    );
}

type EmptyStateProps = {
    children: string;
    className?: string;
};

function EmptyState({ children, className = '' }: EmptyStateProps) {
    return (
        <div
            className={`rounded-lg border border-gray-main bg-round px-4 py-5 text-center text-sm text-sub-text ${className}`}
        >
            {children}
        </div>
    );
}

const formatRole = (role?: string | null): string | null => {
    if (!role) {
        return null;
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
};

const formatStatus = (status: string): string => status.replaceAll('_', ' ');
