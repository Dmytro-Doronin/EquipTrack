import type { ReactNode } from 'react';

type SidebarNavItemProps = {
    href?: string;
    icon: ReactNode;
    isActive?: boolean;
    label: string;
};

export const SidebarNavItem = ({
    href = '#',
    icon,
    isActive = false,
    label,
}: SidebarNavItemProps) => {
    return (
        <a
            aria-current={isActive ? 'page' : undefined}
            className={[
                'flex h-11 items-center gap-3 rounded-[8px] px-3 text-sm font-medium transition-colors',
                isActive ? 'bg-white text-dark' : 'text-gray-400 hover:bg-white/8 hover:text-white',
            ].join(' ')}
            href={href}
        >
            <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>
            <span>{label}</span>
        </a>
    );
};
