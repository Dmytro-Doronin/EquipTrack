const ArrowRightIcon = () => (
    <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m9 18 6-6-6-6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
);

export const SidebarUserCard = () => {
    return (
        <section className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-200 text-sm font-bold text-dark">
                AJ
            </div>
            <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold text-white">Alexajohn</h2>
                <p className="truncate text-xs text-gray-400">John@mail.com</p>
            </div>
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
