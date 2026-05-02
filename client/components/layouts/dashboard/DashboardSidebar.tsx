import { SidebarNavItem } from '@/components/layouts/dashboard/SidebarNavItem';
import { SidebarUserCard } from '@/components/layouts/dashboard/SidebarUserCard';
import { SupportCard } from '@/components/layouts/dashboard/SupportCard';

const DashboardIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

const UsersIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M16 19a4 4 0 0 0-8 0m8-11a4 4 0 1 1-8 0m11 11a3.5 3.5 0 0 0-3-3.45M17 5.2a3 3 0 0 1 0 5.6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

const EquipmentIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M6 7h12v13H6V7Zm3-3h6l1 3H8l1-3Zm0 7h6m-6 4h6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

const TransactionsIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M7 7h10m0 0-3-3m3 3-3 3M17 17H7m0 0 3 3m-3-3 3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

const SettingsIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-2.2a7.8 7.8 0 0 0 0-2.6l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.2-1.3L14.5 3h-5l-.4 2.5A8 8 0 0 0 7 6.8l-2.4-1-2 3.4 2 1.5a7.8 7.8 0 0 0 0 2.6l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.2 1.3l.4 2.5h5l.4-2.5a8 8 0 0 0 2.2-1.3l2.4 1 2-3.4-2.2-1.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
        />
    </svg>
);

const HelpIcon = () => (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
        <path
            d="M9.2 9a3 3 0 1 1 5.1 2.12c-.82.8-1.55 1.24-1.98 2.38M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

const CollapseIcon = () => (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
        <path
            d="m15 18-6-6 6-6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

const LogoMark = () => (
    <svg aria-hidden="true" className="size-9 text-white" fill="none" viewBox="0 0 40 40">
        <path
            d="m20 4 13 7.5v15L20 34 7 26.5v-15L20 4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="3"
        />
        <path
            d="m13 15 7-4 7 4-14 8v-8Zm0 8 7 4 7-4"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="3"
        />
    </svg>
);

export const DashboardSidebar = () => {
    return (
        <aside className="hidden w-[280px] shrink-0 flex-col overflow-hidden rounded-[16px] bg-dark text-white lg:flex">
            <div className="flex min-h-[calc(100dvh-40px)] flex-col p-4">
                <div className="mb-9 flex items-center justify-between gap-4">
                    <a className="flex min-w-0 items-center gap-3" href="#">
                        <LogoMark />
                        <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-5">LOGO</span>
                            <span className="block text-xs text-gray-400">Finance App</span>
                        </span>
                    </a>
                    <button
                        aria-label="Collapse sidebar"
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-dark transition-colors hover:bg-gray-100"
                        type="button"
                    >
                        <CollapseIcon />
                    </button>
                </div>

                <nav aria-label="Dashboard navigation" className="space-y-7">
                    <section>
                        <h2 className="mb-3 px-1 text-[11px] font-medium uppercase tracking-normal text-gray-400">
                            Main
                        </h2>
                        <div className="space-y-1">
                            <SidebarNavItem icon={<DashboardIcon />} label="Dashboard" />
                            <SidebarNavItem icon={<UsersIcon />} label="Users" />
                            <SidebarNavItem icon={<EquipmentIcon />} label="Equipments" />
                            <SidebarNavItem
                                icon={<TransactionsIcon />}
                                isActive
                                label="Transactions"
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 px-1 text-[11px] font-medium uppercase tracking-normal text-gray-400">
                            Other
                        </h2>
                        <div className="space-y-1">
                            <SidebarNavItem icon={<SettingsIcon />} label="Settings" />
                            <SidebarNavItem icon={<HelpIcon />} label="Get Help" />
                        </div>
                    </section>
                </nav>

                <div className="mt-auto space-y-5 border-t border-white/10 pt-5">
                    <SupportCard />
                    <SidebarUserCard />
                </div>
            </div>
        </aside>
    );
};
