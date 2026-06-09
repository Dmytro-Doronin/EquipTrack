import type { ReactNode } from 'react';

import type { AssetTableItem } from '@/components/assets/model/types';

import { AssetTableRow } from '@/components/assets/AssetTableRow/AssetTableRow';

type AssetTableProps = {
    assets: AssetTableItem[];
};

type TableColumn = {
    align?: 'left' | 'right';
    isSortable?: boolean;
    label: string;
};

const columns: TableColumn[] = [
    {
        isSortable: true,
        label: 'Asset',
    },
    {
        isSortable: true,
        label: 'Category',
    },
    {
        isSortable: true,
        label: 'Status',
    },
    {
        label: 'Assigned to',
    },
    {
        isSortable: true,
        label: 'Assigned date',
    },
    {
        label: 'Due date',
    },
    {
        isSortable: true,
        label: 'Created date',
    },
    {
        align: 'right',
        label: 'Actions',
    },
];

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

type ColumnHeaderProps = {
    align?: TableColumn['align'];
    children: ReactNode;
    isSortable?: boolean;
};

const ColumnHeader = ({ align = 'left', children, isSortable = false }: ColumnHeaderProps) => (
    <span
        className={[
            'inline-flex items-center gap-1.5',
            isSortable ? 'text-main' : '',
            align === 'right' ? 'justify-end' : '',
        ].join(' ')}
    >
        {children}
        {isSortable && <SortIcon />}
    </span>
);

const SortIcon = () => (
    <svg aria-hidden="true" className="size-3.5 shrink-0" fill="none" viewBox="0 0 16 16">
        <path
            d="M5 6L8 3l3 3M11 10l-3 3-3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
        />
    </svg>
);
