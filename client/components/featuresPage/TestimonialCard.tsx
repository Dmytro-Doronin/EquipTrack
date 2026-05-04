import TestimonialIcon from '@/components/icons/TestimonialIcon';

export const TestimonialCard = () => {
    return (
        <article className="relative min-h-[360px] overflow-hidden rounded-[8px] bg-main p-8 text-white md:min-h-[500px] md:p-12">
            <div
                className="flex gap-1 text-2xl leading-none text-[#facc15]"
                aria-label="Five star rating"
            >
                <span aria-hidden="true">★</span>
                <span aria-hidden="true">★</span>
                <span aria-hidden="true">★</span>
                <span aria-hidden="true">★</span>
                <span aria-hidden="true">★</span>
            </div>

            <blockquote className="mt-8 max-w-[520px] text-3xl leading-[1.15] font-extrabold md:text-[34px]">
                &quot;The most intuitive tracking software we&apos;ve ever deployed.&quot;
            </blockquote>

            <p className="mt-9 text-sm text-gray-main/70">
                Marcus Thorne, Operations Director at AeroWorks
            </p>

            <TestimonialIcon />
        </article>
    );
};
