import CollapseIcon from '@/components/icons/CollapseIcon';
import DashboardIcon from '@/components/icons/DashboardIcon';
import EquipmentIcon from '@/components/icons/EquipmentIcon';
import HelpIcon from '@/components/icons/HelpIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import UserDashboardIcon from '@/components/icons/UserDashboardIcon';
import { SidebarNavItem } from '@/components/layouts/dashboard/SidebarNavItem';
import { SidebarUserCard } from '@/components/layouts/dashboard/SidebarUserCard';
import { Button } from '@/components/ui/button/Button';

export const DashboardSidebar = () => {
    return (
        <aside className="hidden w-[280px] shrink-0 flex-col overflow-hidden rounded-[16px] bg-dark text-white lg:flex">
            <div className="flex min-h-[calc(100dvh-40px)] flex-col p-4">
                <div className="mb-9 flex items-center justify-between gap-4">
                    <a className="flex min-w-0 items-center gap-3" href="#">
                        <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-5">
                                Equip Tracker
                            </span>
                            <span className="block text-xs text-gray-400">App</span>
                        </span>
                    </a>
                    <Button
                        aria-label="Collapse sidebar"
                        className="grid p-[8px] shrink-0 place-items-center rounded-full bg-white text-dark transition-colors hover:bg-gray-100"
                        type="button"
                        variant="transparent"
                        size="transparent"
                    >
                        <CollapseIcon />
                    </Button>
                </div>

                <nav aria-label="Dashboard navigation" className="space-y-7">
                    <section>
                        <h2 className="mb-3 px-1 text-[11px] font-medium uppercase tracking-normal text-gray-400">
                            Main
                        </h2>
                        <div className="space-y-1">
                            <SidebarNavItem icon={<DashboardIcon />} label="Dashboard" />
                            <SidebarNavItem icon={<UserDashboardIcon />} label="Users" />
                            <SidebarNavItem icon={<EquipmentIcon />} label="Equipments" />
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
                    <SidebarUserCard />
                </div>
            </div>
        </aside>
    );
};
