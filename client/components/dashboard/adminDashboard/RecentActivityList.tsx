import type { DashboardRecentActivity } from '@/types/dashboard/types';

import { ActivityRow } from '@/components/dashboard/adminDashboard/ActivityRow';
import { EmptyState } from '@/components/dashboard/adminDashboard/EmptyState';

type RecentActivityListProps = {
    recentActivity: DashboardRecentActivity[];
};

export const RecentActivityList = ({ recentActivity }: RecentActivityListProps) => {
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
};
