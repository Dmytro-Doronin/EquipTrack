'use client';

import { useQuery } from '@tanstack/react-query';

import { getAssets } from '@/shared/api/assets/getAssets';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/utils/ErrorUtil';

export const assetsQueryKey = ['assets'] as const;

type UseAssetsQueryOptions = {
    enabled?: boolean;
};

export const useAssetsQuery = ({ enabled = true }: UseAssetsQueryOptions = {}) => {
    const authStatus = useAuthStore((state) => state.status);

    const assetsQuery = useQuery({
        queryKey: assetsQueryKey,
        queryFn: getAssets,
        enabled: authStatus === 'authenticated' && enabled,
    });

    return {
        ...assetsQuery,
        assets: assetsQuery.data ?? [],
        errorMessage: assetsQuery.error ? getErrorMessage(assetsQuery.error) : null,
    };
};
