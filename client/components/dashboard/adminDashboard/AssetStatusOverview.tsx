import type { DashboardContext } from '@/types/dashboard/types';
const assetStatusRows = [
    {
        key: 'assignedAssets',
        label: 'Assigned',
    },
    {
        key: 'availableAssets',
        label: 'Available',
    },
    {
        key: 'maintenanceAssets',
        label: 'Maintenance',
    },
    {
        key: 'lostAssets',
        label: 'Lost',
    },
] as const;

type AssetStatusOverviewProps = {
    context: DashboardContext;
};

export const AssetStatusOverview = ({ context }: AssetStatusOverviewProps) => {
    const totalAssets = context.stats.totalAssets;

    return (
        <section className="rounded-[12px] border border-gray-main bg-white p-6">
            <h2 className="text-xl font-bold text-dark">Asset overview</h2>

            <div className="mt-5 space-y-4">
                {assetStatusRows.map((row) => {
                    const value = context.stats[row.key];
                    const percentage =
                        totalAssets > 0 ? Math.round((value / totalAssets) * 100) : 0;

                    return (
                        <div key={row.key}>
                            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                <span className="font-medium text-dark">{row.label}</span>
                                <span className="text-sub-text">
                                    {value} {percentage > 0 ? `(${percentage}%)` : ''}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-round">
                                <div
                                    className="h-full rounded-full bg-main"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
