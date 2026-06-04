import { DashboardContext } from '@/types/dashboard/types';
import { formatDisplayDate } from '@/utils/formatDate';

type PendingOrganizationDashboardProps = {
    pendingRequests: DashboardContext['pendingRequests'];
};

export function PendingOrganizationDashboard({
    pendingRequests,
}: PendingOrganizationDashboardProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <p className="mb-2 text-sm font-medium text-sub-text">Join request</p>
            <h2 className="text-2xl font-bold text-dark">Your request is pending</h2>

            <div className="mt-6 space-y-3">
                {pendingRequests.map((request) => {
                    const requestedDate = formatDisplayDate(request.createdAt);

                    return (
                        <div
                            className="rounded-lg border border-gray-main bg-round px-5 py-4"
                            key={request.id}
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <h3 className="truncate text-lg font-bold text-dark">
                                        {request.organizationName}
                                    </h3>
                                    <p className="mt-1 text-sm text-sub-text">
                                        Waiting for admin approval
                                    </p>
                                </div>
                                <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-main">
                                    Pending
                                </span>
                            </div>

                            {requestedDate && (
                                <p className="mt-4 text-sm text-sub-text">
                                    Requested on {requestedDate}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
