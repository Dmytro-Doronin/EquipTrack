'use client';

import { twMerge } from 'tailwind-merge';

import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { Button } from '@/components/ui/button/Button';
import { UserInfo } from '@/components/userInfo/UserInfo';
import { useAuthStore } from '@/stores/auth.store';

type SidebarUserCardProps = {
    isCollapsed: boolean;
    onExpand: () => void;
};

export const SidebarUserCard = ({ isCollapsed, onExpand }: SidebarUserCardProps) => {
    const user = useAuthStore((state) => state.user);
    if (!user && !isCollapsed) {
        return null;
    }

    return (
        <section
            className={twMerge(
                'items-center transition-[gap,grid-template-columns] duration-300 ease-in-out',
                user ? 'grid' : 'flex justify-center',
                isCollapsed && user
                    ? 'flex flex-col justify-center gap-0'
                    : 'grid-cols-[40px_minmax(0,1fr)_32px] gap-3',
            )}
        >
            {user && (
                <UserInfo
                    detailsClassName={twMerge(
                        'overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-in-out',
                        isCollapsed
                            ? 'max-w-0 translate-x-1 opacity-0'
                            : 'max-w-[160px] opacity-100',
                    )}
                    user={user}
                />
            )}
            <Button
                aria-controls="dashboard-sidebar"
                aria-expanded={!isCollapsed}
                aria-label="Expand sidebar"
                className="grid p-2 shrink-0 place-items-center rounded-full bg-white text-dark transition-colors hover:bg-gray-100"
                onClick={onExpand}
                type="button"
                variant="transparent"
                size="transparent"
            >
                <ArrowRightIcon />
            </Button>
        </section>
    );
};
