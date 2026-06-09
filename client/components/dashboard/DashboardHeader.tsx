'use client';

import { usePathname } from 'next/navigation';

import NotificationIcon from '@/components/icons/NotificationIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import { Button } from '@/components/ui/button/Button';
import { HEADER_CONFIG } from '@/mock/headerConfig';

export const DashboardHeader = () => {
    const pathname = usePathname();

    const header = HEADER_CONFIG[pathname] ?? {
        title: 'Dashboard',
        description: 'Manage your organization workspace.',
    };

    return (
        <header className="flex flex-col gap-5 border-b border-gray-main bg-white px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-dark">{header.title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-sub-text">
                    {header.description}
                </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
                <Button
                    aria-label="Search"
                    className="grid size-10 place-items-center rounded-full text-sub-text transition-colors hover:bg-gray-100 hover:text-dark"
                    type="button"
                    variant="transparent"
                    size="transparent"
                >
                    <SearchIcon />
                </Button>
                <Button
                    aria-label="Notifications"
                    className="grid size-10 place-items-center rounded-full text-sub-text transition-colors hover:bg-gray-100 hover:text-dark"
                    type="button"
                    variant="transparent"
                    size="transparent"
                >
                    <NotificationIcon />
                </Button>
            </div>
        </header>
    );
};
