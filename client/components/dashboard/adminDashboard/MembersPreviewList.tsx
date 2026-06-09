import type { DashboardOrganizationMemberPreview } from '@/types/dashboard/types';

import { EmptyState } from '@/components/dashboard/adminDashboard/EmptyState';
import { MemberPreviewRow } from '@/components/dashboard/adminDashboard/MemberPreviewRow';

type MembersPreviewListProps = {
    members: DashboardOrganizationMemberPreview[];
};

export const MembersPreviewList = ({ members }: MembersPreviewListProps) => {
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
};
