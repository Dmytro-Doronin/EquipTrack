'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { SidebarNavItem } from '@/components/dashboard/SidebarNavItem';
import { SidebarUserCard } from '@/components/dashboard/SidebarUserCard';
import CollapseIcon from '@/components/icons/CollapseIcon';
import DashboardIcon from '@/components/icons/DashboardIcon';
import EquipmentIcon from '@/components/icons/EquipmentIcon';
import HelpIcon from '@/components/icons/HelpIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import UserDashboardIcon from '@/components/icons/UserDashboardIcon';
import { Button } from '@/components/ui/button/Button';
export const DashboardSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const isNavItemActive = (href: string) => {
        return pathname === href || pathname.startsWith(`${href}/`);
    };
    const sidebarLabelClassName = twMerge(
        'min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-in-out',
        isCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-[160px] opacity-100',
    );

    const sectionTitleClassName = twMerge(
        'overflow-hidden whitespace-nowrap px-1 text-[11px] font-medium uppercase tracking-normal text-gray-400 transition-[max-height,max-width,opacity,margin] duration-200 ease-in-out',
        isCollapsed ? 'mb-0 max-h-0 max-w-0 opacity-0' : 'mb-3 max-h-5 max-w-[120px] opacity-100',
    );

    return (
        <aside
            className={twMerge(
                'hidden shrink-0 flex-col overflow-hidden rounded-2xl bg-dark text-white transition-[width] duration-300 ease-in-out lg:flex',
                isCollapsed ? 'w-28' : 'w-70',
            )}
            id="dashboard-sidebar"
        >
            <div className="flex min-h-[calc(100dvh-40px)] flex-col p-4">
                <div
                    className={twMerge(
                        'mb-9 flex items-center gap-4 transition-[justify-content] duration-300 ease-in-out',
                        isCollapsed ? 'justify-center' : 'justify-between',
                    )}
                >
                    {!isCollapsed && (
                        <Button as={Link} href="/" variant="transparent" className="p-0 text-start">
                            <span className="min-w-0">
                                <span
                                    className={`${sidebarLabelClassName} block text-sm font-semibold leading-5`}
                                >
                                    Equip Tracker
                                </span>
                                <span
                                    className={`${sidebarLabelClassName} block text-xs text-gray-400`}
                                >
                                    App
                                </span>
                            </span>
                        </Button>
                    )}

                    <Button
                        aria-controls="dashboard-sidebar"
                        aria-expanded={!isCollapsed}
                        aria-label="Collapse sidebar"
                        className="grid p-2 shrink-0 place-items-center rounded-full bg-white text-dark transition-colors hover:bg-gray-100"
                        onClick={() => setIsCollapsed(true)}
                        type="button"
                        variant="transparent"
                        size="transparent"
                    >
                        <CollapseIcon />
                    </Button>
                </div>

                <nav aria-label="Dashboard navigation" className="space-y-7">
                    <section>
                        <h2 className={sectionTitleClassName}>Main</h2>
                        <div className="space-y-1">
                            <SidebarNavItem
                                href="/dashboard"
                                icon={<DashboardIcon />}
                                isCollapsed={isCollapsed}
                                label="Dashboard"
                                isActive={pathname === '/dashboard'}
                            />
                            <SidebarNavItem
                                href="/dashboard/users"
                                icon={<UserDashboardIcon />}
                                isCollapsed={isCollapsed}
                                isActive={isNavItemActive('/dashboard/users')}
                                label="Users"
                            />
                            <SidebarNavItem
                                href="/dashboard/equipments"
                                icon={<EquipmentIcon />}
                                isCollapsed={isCollapsed}
                                isActive={isNavItemActive('/dashboard/equipments')}
                                label="Equipments"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className={sectionTitleClassName}>Other</h2>
                        <div className="space-y-1">
                            <SidebarNavItem
                                href="/dashboard/settings"
                                isActive={isNavItemActive('/dashboard/settings')}
                                icon={<SettingsIcon />}
                                isCollapsed={isCollapsed}
                                label="Settings"
                            />
                            <SidebarNavItem
                                href="/dashboard/help"
                                isActive={isNavItemActive('/dashboard/help')}
                                icon={<HelpIcon />}
                                isCollapsed={isCollapsed}
                                label="Get Help"
                            />
                        </div>
                    </section>
                </nav>

                <div className="mt-auto space-y-5 border-t border-white/10 pt-5">
                    <SidebarUserCard
                        isCollapsed={isCollapsed}
                        onExpand={() => setIsCollapsed(false)}
                    />
                </div>
            </div>
        </aside>
    );
};
