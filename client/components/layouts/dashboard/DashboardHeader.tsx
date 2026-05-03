import { Button } from '@/components/ui/button/Button';

const SearchIcon = () => (
    <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

const NotificationIcon = () => (
    <svg
        aria-hidden="true"
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 22a2.6 2.6 0 0 0 2.46-1.75H9.54A2.6 2.6 0 0 0 12 22ZM19.55 17.34l-1.27-1.7V11a6.29 6.29 0 0 0-5.03-6.15V4a1.25 1.25 0 1 0-2.5 0v.85A6.29 6.29 0 0 0 5.72 11v4.64l-1.27 1.7a.92.92 0 0 0 .74 1.47h13.62a.92.92 0 0 0 .74-1.47Z" />
    </svg>
);

export const DashboardHeader = () => {
    return (
        <header className="flex flex-col gap-5 border-b border-gray-main bg-white px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-dark">Assets</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-sub-text">
                    Efficiently organize and keep track of your assets.
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
