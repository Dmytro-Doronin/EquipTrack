'use client';

import { Loader } from '@/components/loader/Loader';
import { useDashboardAccess } from '@/hooks/custom/useDashboardAccess';

export default function SettingsPage() {
    const { canUpdateOrganization, dashboard, isLoading } = useDashboardAccess();

    if (!dashboard && isLoading) {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!canUpdateOrganization) {
        return (
            <section className="rounded-[12px] border border-gray-main bg-round/60 p-6">
                <h2 className="text-xl font-bold text-dark">Settings unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    You do not have permission to update this organization.
                </p>
            </section>
        );
    }

    return <div>settings</div>;
}
