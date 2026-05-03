export const TrustCard = () => {
    return (
        <article className="flex min-h-[210px] items-center justify-between gap-8 rounded-[8px] bg-[#e8e4e7] p-8 md:p-10">
            <div>
                <h3 className="text-2xl leading-tight font-bold text-dark md:text-[28px]">
                    Trusted by 500+
                </h3>
                <p className="mt-2 text-[15px] text-main">Industrial leaders worldwide.</p>
            </div>
            <svg
                aria-hidden="true"
                className="size-9 shrink-0 text-main"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                />
            </svg>
        </article>
    );
};
