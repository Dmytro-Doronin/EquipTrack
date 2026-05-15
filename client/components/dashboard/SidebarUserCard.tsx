'use client';

import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { UserInfo } from '@/components/userInfo/UserInfo';
import { useAuthStore } from '@/stores/auth.store';

export const SidebarUserCard = () => {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return null;
    }

    return (
        <section className="flex items-center gap-3">
            <UserInfo user={user} />
            <button
                aria-label="Open user menu"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-dark transition-colors hover:bg-gray-100"
                type="button"
            >
                <ArrowRightIcon />
            </button>
        </section>
    );
};
