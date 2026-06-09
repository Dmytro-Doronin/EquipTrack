import type { DashboardOrganizationMemberPreview } from '@/types/dashboard/types';

import { StatusBadge } from '@/components/dashboard/adminDashboard/StatusBadge';
import { formatDisplayDate } from '@/utils/formatDate';
import { formatRole } from '@/utils/formatUtils';

type MemberPreviewRowProps = {
    member: DashboardOrganizationMemberPreview;
};

export const MemberPreviewRow = ({ member }: MemberPreviewRowProps) => {
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
};
