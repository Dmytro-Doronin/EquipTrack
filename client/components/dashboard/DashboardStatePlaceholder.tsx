import type { DashboardState } from '@/features/dashboard/models/types';

type DashboardStatePlaceholderProps = {
    state: Exclude<DashboardState, 'NO_ORGANIZATION'>;
};

const dashboardStateLabels: Record<DashboardStatePlaceholderProps['state'], string> = {
    PENDING_ORGANIZATION_REQUEST: 'Organization request pending',
    MEMBER_DASHBOARD: 'Member dashboard',
    ADMIN_DASHBOARD: 'Admin dashboard',
};

export function DashboardStatePlaceholder({ state }: DashboardStatePlaceholderProps) {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">{dashboardStateLabels[state]}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                This dashboard state is ready to be implemented next.
            </p>
        </section>
    );
}
