import type { DashboardRecentActivity } from '@/types/dashboard/types';

import { formatDisplayDate } from '@/utils/formatDate';

type ActivityRowProps = {
    activity: DashboardRecentActivity;
};

export const ActivityRow = ({ activity }: ActivityRowProps) => {
    const createdDate = formatDisplayDate(activity.createdAt);

    return (
        <article className="flex flex-col gap-2 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-dark">{activity.message}</p>
            <p className="text-sm text-sub-text">{createdDate ?? '-'}</p>
        </article>
    );
};
