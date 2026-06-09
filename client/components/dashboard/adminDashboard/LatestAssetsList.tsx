import type { DashboardAdminAsset } from '@/types/dashboard/types';

import { EmptyState } from '@/components/dashboard/adminDashboard/EmptyState';
import { LatestAssetRow } from '@/components/dashboard/adminDashboard/LatestAssetRow';

type LatestAssetsListProps = {
    assets: DashboardAdminAsset[];
};

export const LatestAssetsList = ({ assets }: LatestAssetsListProps) => {
    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Latest assets</h2>

            {assets.length === 0 && <EmptyState className="mt-5">No assets yet</EmptyState>}

            {assets.length > 0 && (
                <div className="mt-5 overflow-x-auto rounded-lg border border-gray-main">
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead className="bg-round text-xs font-medium uppercase text-sub-text">
                            <tr>
                                <th className="px-4 py-3" scope="col">
                                    Asset name
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Category
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Serial number
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Status
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Assigned to
                                </th>
                                <th className="px-4 py-3" scope="col">
                                    Created date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-main">
                            {assets.map((asset) => (
                                <LatestAssetRow asset={asset} key={asset.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};
