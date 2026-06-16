'use client';

import { useQuery } from '@tanstack/react-query';

import { getAssets } from '@/shared/api/assets/getAssets';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMessage } from '@/utils/ErrorUtil';

export const assetsQueryKey = ['assets'] as const;

export const useAssetsQuery = () => {
    const authStatus = useAuthStore((state) => state.status);

    const assetsQuery = useQuery({
        queryKey: assetsQueryKey,
        queryFn: getAssets,
        enabled: authStatus !== 'checking',
    });

    return {
        ...assetsQuery,
        assets: assetsQuery.data ?? [],
        errorMessage: assetsQuery.error ? getErrorMessage(assetsQuery.error) : null,
    };
};
