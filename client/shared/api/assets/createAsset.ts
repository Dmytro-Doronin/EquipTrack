import type { AssetTableItem } from '@/components/assets/model/types';
import type { CreateAssetPayload, CreateAssetResponse } from '@/shared/api/types/asset.types';

import { apiClient } from '@/shared/api/apiClient';
import { mapAssetToTableItem } from '@/utils/mappers/assets';

export const createAsset = async (payload: CreateAssetPayload): Promise<AssetTableItem> => {
    const response = await apiClient.post<CreateAssetResponse>('/assets', payload);

    return mapAssetToTableItem(response.data.data);
};
