import { AssetTable } from '@/components/assets/AssetTable/AssetTable';
import { mockAssets } from '@/components/assets/model/mockAssets';

export const AssetsClient = () => {
    return <AssetTable assets={mockAssets} />;
};
