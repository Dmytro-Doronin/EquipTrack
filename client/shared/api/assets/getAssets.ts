import type { AssetTableItem } from '@/components/assets/model/types';
import type { GetAssetsResponse } from '@/shared/api/types/asset.types';

import { apiClient } from '@/shared/api/apiClient';
import { mapAssetToTableItem } from '@/utils/mappers/assets';

export const getAssets = async (): Promise<AssetTableItem[]> => {
    const response = await apiClient.get<GetAssetsResponse>('/assets');

    return response.data.data.map(mapAssetToTableItem);
};
