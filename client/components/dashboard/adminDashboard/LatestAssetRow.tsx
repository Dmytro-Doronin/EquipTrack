import type { DashboardAdminAsset } from '@/types/dashboard/types';

import { StatusBadge } from '@/components/dashboard/adminDashboard/StatusBadge';
import { formatDisplayDate } from '@/utils/formatDate';

type LatestAssetRowProps = {
    asset: DashboardAdminAsset;
};

export const LatestAssetRow = ({ asset }: LatestAssetRowProps) => {
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
};
