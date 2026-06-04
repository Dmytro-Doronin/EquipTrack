import { PendingJoinRequestsPanel } from '@/components/dashboard/PendingJoinRequestsPanel';
import { DashboardContext } from '@/types/dashboard/types';

type AdminDashboardProps = {
    organization: NonNullable<DashboardContext['activeOrganization']>;
};

export function AdminDashboard({ organization }: AdminDashboardProps) {
    return (
        <section className="space-y-5">
            <div className="rounded-xl border border-gray-main bg-white p-6">
                <p className="mb-2 text-sm font-medium text-sub-text">Organization</p>
                <h2 className="text-2xl font-bold text-dark">{organization.name}</h2>
            </div>

            <PendingJoinRequestsPanel organizationId={organization.id} />
        </section>
    );
}
