import type { ReactNode } from 'react';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button/Button';

type SidebarNavItemProps = {
    href?: string;
    icon: ReactNode;
    isActive?: boolean;
    isCollapsed?: boolean;
    label: string;
};

export const SidebarNavItem = ({
    href = '/',
    icon,
    isActive = false,
    isCollapsed = false,
    label,
}: SidebarNavItemProps) => {
    return (
        <Button
            as={Link}
            variant="transparent"
            aria-current={isActive ? 'page' : undefined}
            className={twMerge(
                'flex h-11 items-center justify-start rounded-lg text-sm font-medium transition-[background-color,color,padding] duration-300 ease-in-out p-0 text-start',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                isActive ? 'bg-white text-dark' : 'text-gray-400 hover:bg-white/8 hover:text-white',
            )}
            href={href}
        >
            <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>
            <span
                className={twMerge(
                    'overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-in-out',
                    isCollapsed ? 'max-w-0 translate-x-1 opacity-0' : 'max-w-40 opacity-100',
                )}
            >
                {label}
            </span>
        </Button>
    );
};
