export type TableColumn = {
    align?: 'left' | 'right';
    isSortable?: boolean;
    label: string;
};

export const columns: TableColumn[] = [
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
