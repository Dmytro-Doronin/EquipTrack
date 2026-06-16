import type { AssetTableItem } from '@/components/assets/model/types';
import type { Asset, GetAssetsResponse } from '@/shared/api/types/asset.types';

import { apiClient } from '@/shared/api/apiClient';

export const getAssets = async (): Promise<AssetTableItem[]> => {
    const response = await apiClient.get<GetAssetsResponse>('/assets');

    return response.data.data.map(mapAssetToTableItem);
};

const mapAssetToTableItem = (asset: Asset): AssetTableItem => ({
    assignedAt: asset.assignedAt,
    assignedTo: asset.assignedTo,
    category: asset.category,
    createdAt: asset.createdAt,
    dueDate: asset.dueDate,
    id: asset.id,
    imageUrl: asset.imageUrl ?? undefined,
    name: asset.name,
    serialNumber: asset.serialNumber,
    status: asset.status,
});
