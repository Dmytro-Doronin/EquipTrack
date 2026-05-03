'use client';

import { FeaturesGrid } from '@/components/features-page/FeaturesGrid';
import { FeaturesHero } from '@/components/features-page/FeaturesHero';
import { StatCard } from '@/components/features-page/StatCard';
import { TestimonialCard } from '@/components/features-page/TestimonialCard';
import { TrustCard } from '@/components/features-page/TrustCard';

export const FeaturesPage = () => {
    return (
        <main className="bg-white">
            <FeaturesHero />
            <FeaturesGrid />

            <section className="bg-white pt-8 pb-20 md:pt-12 md:pb-28" aria-label="Customer trust">
                <div className="container-centered grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <TestimonialCard />
                    <div className="grid gap-5">
                        <TrustCard />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <StatCard value="99.9%" label="Uptime SLA" />
                            <StatCard value="24/7" label="Expert Support" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
