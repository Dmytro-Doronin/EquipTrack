'use client';

import NotificationIcon from '@/components/icons/NotificationIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import { Button } from '@/components/ui/button/Button';
import { useAuthStore } from '@/stores/auth.store';

export const DashboardHeader = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="flex flex-col gap-5 border-b border-gray-main bg-white px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-dark">Assets</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-sub-text">
                    Efficiently organize and keep track of your assets.
                </p>
            </div>
            {user && <div>{user.login}</div>}

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
                <Button
                    className="h-12 rounded-[8px] bg-main px-6 text-sm font-medium text-white transition-colors hover:bg-mail-light"
                    type="button"
                >
                    Add
                </Button>
            </div>
        </header>
    );
};
