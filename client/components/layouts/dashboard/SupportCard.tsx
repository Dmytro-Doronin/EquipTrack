const HeadsetIcon = () => (
    <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4 13a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
        <path
            d="M6 17h-.5A2.5 2.5 0 0 1 3 14.5v-1A2.5 2.5 0 0 1 5.5 11H6v6Zm12 0h.5a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-2.5-2.5H18v6Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
        />
    </svg>
);

export const SupportCard = () => {
    return (
        <section className="rounded-[12px] bg-white p-3 text-dark">
            <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <HeadsetIcon />
                    <h2 className="text-sm font-semibold">Need Support?</h2>
                </div>
                <button
                    aria-label="Dismiss support card"
                    className="grid size-6 place-items-center rounded-full text-lg leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-dark"
                    type="button"
                >
                    &times;
                </button>
            </div>
            <p className="mb-3 text-xs leading-5 text-sub-text">
                contact with one of our experts to get supports
            </p>
            <button
                className="h-9 w-full rounded-[8px] border border-gray-main text-sm font-medium text-dark transition-colors hover:bg-gray-50"
                type="button"
            >
                Contact Us
            </button>
        </section>
    );
};
