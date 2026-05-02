import type { ReactNode } from 'react';

import { DashboardHeader } from '@/components/layouts/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/layouts/dashboard/DashboardSidebar';

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-dvh bg-gray-main py-5">
            <div className="container-centered flex min-h-[calc(100dvh-40px)] gap-5">
                <DashboardSidebar />
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] bg-white shadow-sm">
                    <DashboardHeader />
                    <main className="flex-1 bg-white px-5 py-6 lg:px-7">{children}</main>
                </div>
            </div>
        </div>
    );
}
