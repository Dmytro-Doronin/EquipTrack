import type { AssetTableItem } from '@/components/assets/model/types';

import { ColumnHeader } from '@/components/assets/AssetTable/ColumnHeader';
import { columns } from '@/components/assets/AssetTable/variables';
import { AssetTableRow } from '@/components/assets/AssetTableRow/AssetTableRow';

type AssetTableProps = {
    assets: AssetTableItem[];
};

export const AssetTable = ({ assets }: AssetTableProps) => {
    return (
        <section className="overflow-hidden rounded-[12px] border border-gray-main bg-white shadow-sm">
            <div className="flex flex-col gap-1 border-b border-gray-main px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-dark">Asset inventory</h2>
                    <p className="mt-1 text-sm text-sub-text">{assets.length} assets tracked</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] border-collapse text-left">
                    <thead className="bg-round/80 text-xs font-semibold uppercase text-sub-text">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    className={[
                                        'px-5 py-3',
                                        column.align === 'right' ? 'text-right' : '',
                                    ].join(' ')}
                                    key={column.label}
                                    scope="col"
                                >
                                    <ColumnHeader
                                        align={column.align}
                                        isSortable={column.isSortable}
                                    >
                                        {column.label}
                                    </ColumnHeader>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-main">
                        {assets.map((asset) => (
                            <AssetTableRow asset={asset} key={asset.id} />
                        ))}
                    </tbody>
                </table>
            </div>

            {assets.length === 0 && (
                <div className="border-t border-gray-main px-5 py-8 text-center text-sm text-sub-text">
                    No assets to display.
                </div>
            )}
        </section>
    );
};
