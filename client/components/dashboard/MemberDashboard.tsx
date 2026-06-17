import type {
    DashboardContext,
    DashboardMemberAsset,
    DashboardMemberTransfer,
    DashboardRecentActivity,
    DashboardTransferUser,
} from '@/types/dashboard/types';

import { Can } from '@/components/dashboard/Can';
import { formatDisplayDate } from '@/utils/formatDate';

type MemberDashboardProps = {
    context: DashboardContext;
    organization: NonNullable<DashboardContext['activeOrganization']>;
};

const summaryCards = [
    {
        key: 'assignedAssets',
        label: 'Assigned assets',
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

export function MemberDashboard({ context, organization }: MemberDashboardProps) {
    const pendingTransfers = context.myTransfers.filter(
        (transfer) => transfer.status === 'pending',
    );

    return (
        <section className="space-y-5">
            <div className="rounded-[12px] border border-gray-main bg-white p-6">
                <p className="text-sm font-medium text-sub-text">{organization.name}</p>
                <h1 className="mt-2 text-2xl font-bold text-dark">My dashboard</h1>
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

            <Can permission="asset:read">
                <MemberAssetsList assets={context.myAssets} />
            </Can>
            <MemberTransfersList transfers={pendingTransfers} />
            <RecentActivityList recentActivity={context.recentActivity} />
        </section>
    );
}

type MemberAssetsListProps = {
    assets: DashboardMemberAsset[];
};

function MemberAssetsList({ assets }: MemberAssetsListProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">My assets</h2>

            {assets.length === 0 && (
                <EmptyState className="mt-5">No assets assigned to you yet</EmptyState>
            )}

            {assets.length > 0 && (
                <div className="mt-5 overflow-x-auto rounded-lg border border-gray-main">
                    <table className="w-full min-w-[760px] text-left text-sm">
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
                                    Assigned date
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Due date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-main">
                            {assets.map((asset) => (
                                <AssetRow asset={asset} key={asset.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

type AssetRowProps = {
    asset: DashboardMemberAsset;
};

function AssetRow({ asset }: AssetRowProps) {
    const assignedDate = formatDisplayDate(asset.assignedAt);
    const dueDate = formatDisplayDate(asset.dueDate);

    return (
        <tr className="bg-white align-top">
            <td className="px-4 py-4 font-medium text-dark">{asset.name}</td>
            <td className="px-4 py-4 text-sub-text">{asset.category}</td>
            <td className="px-4 py-4 text-sub-text">{asset.serialNumber}</td>
            <td className="px-4 py-4">
                <StatusBadge status={asset.status} />
            </td>
            <td className="px-4 py-4 text-sub-text">{assignedDate ?? '-'}</td>
            <td className="px-4 py-4 text-sub-text">{dueDate ?? '-'}</td>
        </tr>
    );
}

type MemberTransfersListProps = {
    transfers: DashboardMemberTransfer[];
};

function MemberTransfersList({ transfers }: MemberTransfersListProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Pending transfers</h2>

            {transfers.length === 0 && (
                <EmptyState className="mt-5">No pending transfers</EmptyState>
            )}

            {transfers.length > 0 && (
                <div className="mt-5 divide-y divide-gray-main overflow-hidden rounded-lg border border-gray-main">
                    {transfers.map((transfer) => (
                        <TransferRow key={transfer.id} transfer={transfer} />
                    ))}
                </div>
            )}
        </section>
    );
}

type TransferRowProps = {
    transfer: DashboardMemberTransfer;
};

function TransferRow({ transfer }: TransferRowProps) {
    const createdDate = formatDisplayDate(transfer.createdAt);

    return (
        <article className="grid gap-4 bg-white px-5 py-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:items-center">
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-sub-text">Asset</p>
                <h3 className="mt-1 truncate text-base font-bold text-dark">
                    {transfer.assetName}
                </h3>
            </div>
            <TransferDetail label="From" value={formatTransferUser(transfer.fromUser)} />
            <TransferDetail label="To" value={formatTransferUser(transfer.toUser)} />
            <div>
                <p className="text-xs font-medium uppercase text-sub-text">Status</p>
                <StatusBadge className="mt-2" status={transfer.status} />
            </div>
            <TransferDetail label="Created" value={createdDate ?? '-'} />
        </article>
    );
}

type TransferDetailProps = {
    label: string;
    value: string;
};

function TransferDetail({ label, value }: TransferDetailProps) {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-sub-text">{label}</p>
            <p className="mt-1 truncate text-sm text-dark">{value}</p>
        </div>
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

const formatTransferUser = (user?: DashboardTransferUser | null): string => {
    if (!user) {
        return 'Unknown user';
    }

    return user.login || `User ${user.id}`;
};

const formatStatus = (status: string): string => status.replaceAll('_', ' ');
