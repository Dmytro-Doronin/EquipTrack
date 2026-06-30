import { useMutation, useQueryClient } from '@tanstack/react-query';

import { assetsQueryKey } from '@/hooks/query/useAssetsQuery';
import { createAsset } from '@/shared/api/assets/createAsset';

export function useCreateAssetMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAsset,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: assetsQueryKey }),
    });
}
