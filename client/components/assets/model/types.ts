export type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'lost';

export type AssetAssignee = {
    id: number;
    login: string;
};

export type AssetTableItem = {
    assignedAt?: string | null;
    assignedTo?: AssetAssignee | null;
    category: string;
    createdAt: string;
    dueDate?: string | null;
    id: number;
    imageUrl?: string;
    name: string;
    serialNumber: string;
    status: AssetStatus;
};
