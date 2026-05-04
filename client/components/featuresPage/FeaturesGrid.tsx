import { FeatureCard } from '@/components/featuresPage/FeatureCard';
import { features } from '@/mock/features';

export const FeaturesGrid = () => {
    return (
        <section className="bg-white py-20 md:py-28" aria-labelledby="features-heading">
            <div className="container-centered">
                <div className="mx-auto max-w-[620px] text-center">
                    <h2
                        id="features-heading"
                        className="text-3xl leading-tight font-bold text-dark md:text-[34px]"
                    >
                        Precision Management Tools
                    </h2>
                    <p className="mx-auto mt-4 max-w-[470px] text-[15px] leading-[1.55] text-main">
                        Everything you need to keep your assets moving and your team synchronized.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};
