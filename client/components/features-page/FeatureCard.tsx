import { ReactNode } from 'react';

type FeatureCardProps = {
    description: string;
    icon: ReactNode;
    title: string;
};

export const FeatureCard = ({ description, icon, title }: FeatureCardProps) => {
    return (
        <article className="rounded-[8px] border border-gray-main bg-white p-6 shadow-[0_12px_40px_rgba(31,41,55,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(31,41,55,0.08)]">
            <div className="mb-7 flex size-10 items-center justify-center rounded-[8px] bg-round text-main">
                {icon}
            </div>
            <h3 className="max-w-[260px] text-2xl leading-[1.08] font-bold text-dark md:text-[22px]">
                {title}
            </h3>
            <p className="mt-5 max-w-[390px] text-[15px] leading-[1.65] text-main">{description}</p>
        </article>
    );
};
