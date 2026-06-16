'use client';

import { AssetTable } from '@/components/assets/AssetTable/AssetTable';
import { Loader } from '@/components/loader/Loader';
import { useAssetsQuery } from '@/hooks/query/useAssetsQuery';

export const AssetsClient = () => {
    const { assets, errorMessage, isError, isPending } = useAssetsQuery();

    if (isPending) {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <section className="rounded-[12px] border border-danger/30 bg-danger/5 p-6">
                <h2 className="text-xl font-bold text-dark">Assets unavailable</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-sub-text">
                    {errorMessage ?? 'We could not load your assets. Please try again later.'}
                </p>
            </section>
        );
    }

    return <AssetTable assets={assets} />;
};
