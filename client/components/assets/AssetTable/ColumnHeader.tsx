import type { ReactNode } from 'react';

import { twMerge } from 'tailwind-merge';

import { TableColumn } from '@/components/assets/AssetTable/variables';
import SortIcon from '@/components/icons/SortIcon';

type ColumnHeaderProps = {
    align?: TableColumn['align'];
    children: ReactNode;
    isSortable?: boolean;
};

export const ColumnHeader = ({
    align = 'left',
    children,
    isSortable = false,
}: ColumnHeaderProps) => (
    <span
        className={twMerge(
            'inline-flex items-center gap-1.5',
            isSortable ? 'text-main' : '',
            align === 'right' ? 'justify-end' : '',
        )}
    >
        {children}
        {isSortable && <SortIcon />}
    </span>
);
