import Link from 'next/link';

import { Button } from '@/components/ui/button/Button';

export const FeaturesHero = () => {
    return (
        <section
            className="relative isolate min-h-[560px] overflow-hidden bg-white bg-cover bg-center"
            style={{ backgroundImage: "url('/heroBackground.png')" }}
            aria-labelledby="features-hero-heading"
        >
            <div className="container-centered flex min-h-[560px] items-center justify-center py-24">
                <div className="mx-auto max-w-[780px] text-center">
                    <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-gray-main bg-round/90 px-4 py-1.5 text-xs font-medium text-main shadow-[0_8px_24px_rgba(31,41,55,0.06)]">
                        Next-Gen Asset Tracking
                    </p>

                    <h1
                        id="features-hero-heading"
                        className="mx-auto mt-7 max-w-[720px] text-[40px] leading-[1.08] font-extrabold text-dark md:text-[58px]"
                    >
                        Track every piece of equipment with confidence.
                    </h1>

                    <p className="mx-auto mt-6 max-w-[650px] text-base leading-[1.75] text-main md:text-lg">
                        EquipTrack helps teams organize, monitor, and manage equipment in one simple
                        place. Streamline your inventory workflows with professional-grade tools.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button as={Link} href="/signup">
                            Registration
                        </Button>
                        <Button as={Link} href="/signin" variant="secondary">
                            Log In
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
